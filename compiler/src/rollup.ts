import { Parser, Node } from "acorn";
import { simple } from "acorn-walk";
import escodegen from "escodegen";
import fs from "fs";
import path from "path";
import { Result, Success, Failure } from "./utils/result";

global.kvelte = {
  dependencies: {},
};

export function modify(
  sourceAbsPath: string,
  config: RollupConfig,
  targetAbsPath: string
): Result<string, Error> {
  global.kvelte.dependencies[config.inputSvelteFilePath] = [];
  // read input file
  const baseNode = readInputFile(sourceAbsPath);

  // validation
  if (!hasRollupPluginVirtual(baseNode)) {
    return errorIsRequired(
      `import virtual from "@rollup/plugin-virtual"`,
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

  // manipulate input
  manipulateInput(exportDefault);
  manipulateOutput(exportDefault, config);
  manipulateVirtualNode(plugins, config);
  manipulateSvelteGenerate(svelte, config);
  if (css) manipulateCss(css, "bundle.css");
  manipulateModuleContext(exportDefault, config);
  manipulateWatch(exportDefault);

  // write modified file
  const dir = path.dirname(targetAbsPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  fs.writeFileSync(targetAbsPath, escodegen.generate(baseNode));
  return new Success("success");
}

function readInputFile(sourceAbsPath: string): Node {
  const str = fs.readFileSync(sourceAbsPath, "utf-8");
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
  let svelte: Node | undefined = undefined;
  simple(plugins, {
    CallExpression(node) {
      if ((node as any).callee?.name === "css") {
        svelte = node;
      }
    },
  });
  return svelte;
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

function manipulateOutput(exportDefault: Node, config: RollupConfig) {
  const { declaration } = exportDefault as any;
  declaration.properties = declaration?.properties.filter((p: any) => {
    return p.type !== "Property" || p.key?.name !== "output";
  });
  declaration?.properties?.push(createOutputNode(config));
}

function manipulateVirtualNode(plugins: Node, config: RollupConfig): Node {
  const { value } = plugins as any;
  value.elements = value.elements.filter((e: any) => {
    return e.type !== "CallExpression" || e.callee?.name !== "virtual";
  });
  const virtual = createVirtualNode(config);
  value.elements.push(virtual);
  return virtual;
}

function manipulateSvelteGenerate(svelte: Node, config: RollupConfig) {
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
  value.properties.push(createCompileOptionsGenerate(config.dom));
  value.properties.push(createCompileOptionsHydratable(config.dom));
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
  output = createCssOutputNode(outputFileName);
  if (args.length === 0) {
    args.push({
      type: "ObjectExpression",
      properties: [],
    });
  }
  args[0].properties.push(output);
}
const { value } = output as any;
  value.value = outputFileName;
  value.raw = outputFileName;
}

function manipulateModuleContext(exportDefault: Node, config: RollupConfig) {
  const { declaration } = exportDefault as any;
  declaration.properties = declaration?.properties.filter((p: any) => {
    return p.type !== "Property" || p.key?.name !== "moduleContext";
  });
  declaration?.properties?.push(createModuleContextNode(config));
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

function createOutputNode(config: RollupConfig): Node {
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
            value: true,
            raw: "true",
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
            name: `"${path.resolve(config.outputDir) + "/bundle.js"}"`,
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

function createCssOutputNode(outputFileName: string): Node {
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
      type: "Identifier",
      name: `"${outputFileName}"`,
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

function createModuleContextNode(config: RollupConfig) {
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
      name: `(id) => { global.kvelte.dependencies["${config.inputSvelteFilePath}"].push(id); }`,
    },
    kind: "init",
  };
}

function createVirtualNode(config: RollupConfig): Node {
  const createVirtualFile = (config: RollupConfig) => {
    if (config.dom) {
      return `
      import App from '${config.inputSvelteFilePath}';
      const app = new App({
        target: document.body,
        props: __KVELTE_PROPS__,
        hydrate: true
      });
      export default app;
    `;
    }
    return `import App from '${config.inputSvelteFilePath}';`;
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
              name: `\`${createVirtualFile(config)}\``,
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
