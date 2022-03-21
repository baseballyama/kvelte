import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import virtual from "@rollup/plugin-virtual";
import css from 'rollup-plugin-css-only';

const production = __KVELTE_PRODUCTION__;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
  input: "main",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: __KVELTE_OUTPUT__,
  },
  plugins: [
    virtual({
      main: __KVELTE_INPUT__,
    }),
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
        generate: __KVELTE_GENERATE__,
        hydratable: __KVELTE_HYDRATABLE__,
      },
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: __KVELTE_OUTPUT_CSS__ }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};


























































































