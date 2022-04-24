import { Parser, Node } from "acorn";
import { simple } from "acorn-walk";
import escodegen from "escodegen";
import fs from "fs";
import path from "path";
import { Result, Success, Failure } from "./utils/result";

export type Props = {
  svelteProjectAbsDirPath: string;
  svelteRelativeFilePath: string;
  outputAbsDirPath: string;
  dom: boolean;
  debug: boolean;
};

global.kvelte = {};

/**
 * manipulate `rollup.config.js` for using it by kvelte.
 *
 * @param sourceAbsPath
 * @param config
 * @param targetAbsPath folder path of manipulated rollup.config.js.
 * @returns
 */
export function manipulate(props: Props): Result<string, Error> {
  global.kvelte[props.svelteRelativeFilePath] = {
    dependencies: [],
    ssr: "",
  };
  // read input file
  const baseNode = readInputFile(props.svelteProjectAbsDirPath);

  // validation
  if (!hasRollupPluginVirtual(baseNode)) {
    return errorIsRequired(
      `import virtual from "@rollup/plugin-virtual";`,
      "Please run 'npm i -D @rollup/plugin-virtual'"
    );
  }

  const exportDefault = getExportDefault(baseNode);
  if (!exportDefault) return errorIsRequired(`export default`);

  const plugins = getPlugins(exportDefault);
  if (!plugins) return errorIsRequired(`plugins`);

  const svelte = getSvelte(plugins);
  if (!svelte) return errorIsRequired(`plugins.svelte`);

  const css = getCss(plugins);

  const resolve = getPluginNodeResolve(baseNode, plugins);
  if (!resolve) {
    return errorIsRequired(
      `import resolve from '@rollup/plugin-node-resolve';"`,
      "Please run 'npm i -D @rollup/plugin-node-resolve'"
    );
  }

  // manipulate input
  manipulateInput(exportDefault);
  manipulateOutput(exportDefault, props);
  manipulateVirtualNode(plugins, props);
  manipulateSvelteGenerate(svelte, props);
  if (css) manipulateCss(css, "bundle.css");
  manipulateResolve(resolve, props);
  manipulateModuleContext(exportDefault, props);
  manipulateWatch(exportDefault);

  // write modified file
  const dir = path.resolve(props.svelteProjectAbsDirPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const generated = escodegen.generate(baseNode);
  fs.writeFileSync(path.join(dir, "rollup.config.js"), generated);
  return new Success(generated);
}

function readInputFile(inputSvelteProjectAbsDirPath: string): Node {
  const str = fs.readFileSync(
    path.join(inputSvelteProjectAbsDirPath, "rollup.config.js"),
    "utf-8"
  );
  return Parser.parse(str, { ecmaVersion: "latest", sourceType: "module" });
}

function hasRollupPluginVirtual(baseNode: Node): boolean {
  const body = (baseNode as any).body as Node[];
  const imports = body.filter((n) => n.type === "ImportDeclaration");
  return !!imports.find(
    (i) => (i as any).source.value === "@rollup/plugin-virtual"
  );
}

// ----------------------------------------------------------------------
// AST walk
// ----------------------------------------------------------------------

function getExportDefault(baseNode: Node): Node | undefined {
  let exportDefault: Node | undefined = undefined;
  simple(baseNode, {
    ExportDefaultDeclaration(node) {
      exportDefault = node;
    },
  });

  const declaration = (exportDefault as any)?.declaration;
  if (declaration?.type === "Identifier") {
    simple(baseNode, {
      VariableDeclaration(node) {
        if ((node as any).id?.name === declaration?.name) exportDefault = node;
      },
    });
  }
  return exportDefault;
}

function getPlugins(exportDefault: Node): Node | undefined {
  let plugins: Node | undefined = undefined;
  simple(exportDefault, {
    Property(node) {
      if ((node as any).key?.name === "plugins") {
        plugins = node;
      }
    },
  });
  return plugins;
}

function getSvelte(plugins: Node): Node | undefined {
  let svelte: Node | undefined = undefined;
  simple(plugins, {
    CallExpression(node) {
      if ((node as any).callee?.name === "svelte") {
        svelte = node;
      }
    },
  });
  return svelte;
}

function getCss(plugins: Node): Node | undefined {
  let css: Node | undefined = undefined;
  simple(plugins, {
    CallExpression(node) {
      if ((node as any).callee?.name === "css") {
        css = node;
      }
    },
  });
  return css;
}

function getPluginNodeResolve(baseNode: Node, plugins: Node): Node | undefined {
  let pluginNodeResolveName: string | undefined = undefined;
  simple(baseNode, {
    ImportDeclaration(node) {
      if ((node as any).source?.value === "@rollup/plugin-node-resolve") {
        pluginNodeResolveName = (node as any).specifiers[0]?.local.name;
      }
    },
  });

  let resolve: Node | undefined = undefined;
  simple(plugins, {
    CallExpression(node) {
      if ((node as any).callee?.name === pluginNodeResolveName) {
        resolve = node;
      }
    },
  });
  return resolve;
}

// ----------------------------------------------------------------------
// AST manipulate
// ----------------------------------------------------------------------

function manipulateInput(exportDefault: Node) {
  const { declaration } = exportDefault as any;
  declaration.properties = declaration?.properties.filter((p: any) => {
    return p.type !== "Property" || p.key?.name !== "input";
  });
  declaration?.properties?.push(createInputNode());
}

function manipulateOutput(exportDefault: Node, props: Props) {
  const { declaration } = exportDefault as any;
  declaration.properties = declaration?.properties.filter((p: any) => {
    return p.type !== "Property" || p.key?.name !== "output";
  });
  declaration?.properties?.push(createOutputNode(props));
}

function manipulateVirtualNode(plugins: Node, props: Props): Node {
  const { value } = plugins as any;
  value.elements = value.elements.filter((e: any) => {
    return e.type !== "CallExpression" || e.callee?.name !== "virtual";
  });
  const virtual = createVirtualNode(props);
  value.elements.push(virtual);
  return virtual;
}

function manipulateSvelteGenerate(svelte: Node, props: Props) {
  const args = (svelte as any).arguments;
  let compilerOptions: Node | undefined = undefined;
  args
    .filter((e: any) => e.type === "ObjectExpression")
    .forEach((e: any) => {
      const buf = e.properties.find(
        (p: any) => p.key?.name === "compilerOptions"
      );
      if (buf) compilerOptions = buf;
    });

  if (!compilerOptions) {
    compilerOptions = createCompilerOptionsNode();
    if (args.length === 0) {
      args.push({
        type: "ObjectExpression",
        properties: [],
      });
    }
    args[0].properties.push(compilerOptions);
  }

  const { value } = compilerOptions as any;
  value.properties = value.properties.filter((p: any) => {
    return !(
      p.type === "Property" &&
      (p.key?.name !== "generate" || p.key?.name !== "hydratable")
    );
  });
  value.properties.push(createCompileOptionsGenerate(props.dom));
  value.properties.push(createCompileOptionsHydratable(props.dom));
}

function manipulateCss(css: Node, outputFileName: string) {
  const args = (css as any).arguments;
  let output: Node | undefined = undefined;
  args
    .filter((e: any) => e.type === "ObjectExpression")
    .forEach((e: any) => {
      const buf = e.properties.find((p: any) => p.key?.name === "output");
      if (buf) output = buf;
    });

  if (!output) {
    output = createCssOutputNode();
    if (args.length === 0) {
      args.push({
        type: "ObjectExpression",
        properties: [],
      });
    }
    args[0].properties.push(output);
  }
  const { value } = output as any;
  value.raw = `"${outputFileName}"`;
  value.value = outputFileName;
}

function manipulateResolve(resolve: Node, props: Props) {
  const args = (resolve as any).arguments;
  let moduleDirectories: Node | undefined = undefined;
  args
    .filter((e: any) => e.type === "ObjectExpression")
    .forEach((e: any) => {
      const buf = e.properties.find(
        (p: any) => p.key?.name === "moduleDirectories"
      );
      if (buf) moduleDirectories = buf;
    });

  if (!moduleDirectories) {
    moduleDirectories = createModuleDirectories(props);
    if (args.length === 0) {
      args.push({
        type: "ObjectExpression",
        properties: [],
      });
    }
    args[0].properties.push(moduleDirectories);
  }
}

function manipulateModuleContext(exportDefault: Node, props: Props) {
  const { declaration } = exportDefault as any;
  declaration.properties = declaration?.properties.filter((p: any) => {
    return p.type !== "Property" || p.key?.name !== "moduleContext";
  });
  declaration?.properties?.push(createModuleContextNode(props));
}

function manipulateWatch(exportDefault: Node) {
  const { declaration } = exportDefault as any;
  declaration.properties = declaration?.properties.filter((p: any) => {
    return p.type !== "Property" || p.key?.name !== "watch";
  });
}

// ----------------------------------------------------------------------
// AST parts
// ----------------------------------------------------------------------

function createInputNode(): Node {
  return {
    type: "Property",
    method: false,
    shorthand: false,
    computed: false,
    key: {
      type: "Identifier",
      name: "input",
    },
    value: {
      type: "Literal",
      value: "main",
      raw: '"main"',
    },
    kind: "init",
  } as unknown as Node;
}

function createOutputNode(props: Props): Node {
  return {
    type: "Property",
    method: false,
    shorthand: false,
    computed: false,
    key: {
      type: "Identifier",
      name: "output",
    },
    value: {
      type: "ObjectExpression",
      properties: [
        {
          type: "Property",
          method: false,
          shorthand: false,
          computed: false,
          key: {
            type: "Identifier",
            name: "sourcemap",
          },
          value: {
            type: "Literal",
            value: props.debug ? "inline" : false,
            raw: props.debug ? '"inline"' : false,
          },
          kind: "init",
        },
        {
          type: "Property",
          method: false,
          shorthand: false,
          computed: false,
          key: {
            type: "Identifier",
            name: "format",
          },
          value: {
            type: "Literal",
            value: "iife",
            raw: '"iife"',
          },
          kind: "init",
        },
        {
          type: "Property",
          method: false,
          shorthand: false,
          computed: false,
          key: {
            type: "Identifier",
            name: "name",
          },
          value: {
            type: "Literal",
            value: "app",
            raw: '"app"',
          },
          kind: "init",
        },
        {
          type: "Property",
          method: false,
          shorthand: false,
          computed: false,
          key: {
            type: "Identifier",
            name: "file",
          },
          value: {
            type: "Identifier",
            name: `"${path.join(
              props.outputAbsDirPath,
              props.svelteRelativeFilePath,
              "/bundle.js"
            )}"`,
          },
          kind: "init",
        },
      ],
    },
    kind: "init",
  } as unknown as Node;
}

function createCompilerOptionsNode(): Node {
  return {
    type: "Property",
    method: false,
    shorthand: false,
    computed: false,
    key: {
      type: "Identifier",
      name: "compilerOptions",
    },
    value: {
      type: "ObjectExpression",
      properties: [],
    },
    kind: "init",
  } as unknown as Node;
}

function createModuleDirectories(props: Props): Node {
  return {
    type: "Property",
    method: false,
    shorthand: false,
    computed: false,
    key: {
      type: "Identifier",
      name: "moduleDirectories",
    },
    value: {
      type: "ArrayExpression",
      elements: [
        {
          type: "Literal",
          value: `${path.join(props.svelteProjectAbsDirPath, "/node_modules")}`,
          raw: `"${path.join(props.svelteProjectAbsDirPath, "/node_modules")}"`,
        },
      ],
    },
    kind: "init",
  } as unknown as Node;
}

function createCssOutputNode(): Node {
  return {
    type: "Property",
    method: false,
    shorthand: false,
    computed: false,
    key: {
      type: "Identifier",
      name: "output",
    },
    value: {
      type: "Literal",
      value: "",
    },
    kind: "init",
  } as unknown as Node;
}

function createCompileOptionsGenerate(dom: boolean): Node {
  return {
    type: "Property",
    method: false,
    shorthand: false,
    computed: false,
    key: {
      type: "Identifier",
      name: "generate",
    },
    value: {
      type: "Identifier",
      name: `"${dom ? "dom" : "ssr"}"`,
    },
    kind: "init",
  } as unknown as Node;
}

function createCompileOptionsHydratable(dom: boolean): Node {
  return {
    type: "Property",
    method: false,
    shorthand: false,
    computed: false,
    key: {
      type: "Identifier",
      name: "hydratable",
    },
    value: {
      type: "Identifier",
      name: dom,
    },
    kind: "init",
  } as unknown as Node;
}

function createModuleContextNode(props: Props) {
  return {
    type: "Property",
    method: false,
    shorthand: false,
    computed: false,
    key: {
      type: "Identifier",
      name: "moduleContext",
    },
    value: {
      type: "Identifier",
      name: `(id) => { global.kvelte["${props.svelteRelativeFilePath}"].dependencies.push(id); }`,
    },
    kind: "init",
  };
}

function createVirtualNode(props: Props): Node {
  const createVirtualFile = () => {
    const filePath = path.join(
      props.svelteProjectAbsDirPath,
      props.svelteRelativeFilePath
    );
    if (props.dom) {
      return `
      import App from '${filePath}';
      const app = new App({
        target: document.body,
        props: __KVELTE_PROPS__,
        hydrate: true
      });
      export default app;
    `;
    }
    return `
    import App from '${filePath}';
    global.kvelte["${props.svelteRelativeFilePath}"].ssr = App.render().html;
    `;
  };

  return {
    type: "CallExpression",
    callee: {
      type: "Identifier",
      name: "virtual",
    },
    arguments: [
      {
        type: "ObjectExpression",
        properties: [
          {
            type: "Property",
            method: false,
            shorthand: false,
            computed: false,
            key: {
              type: "Identifier",
              name: "main",
            },
            value: {
              type: "Identifier",
              name: `\`${createVirtualFile()}\``,
            },
            kind: "init",
          },
        ],
      },
    ],
    optional: false,
  } as unknown as Node;
}

// ----------------------------------------------------------------------
// Error
// ----------------------------------------------------------------------

function errorIsRequired(
  str: string,
  additional: string | undefined = undefined
): Failure<Error> {
  const additionalStr = additional ? `\n${additional}` : "";
  return new Failure(
    new Error(`'${str}' is required in 'rollup.config.js'.${additionalStr}`)
  );
}
