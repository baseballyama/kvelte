import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import virtual from '@rollup/plugin-virtual';
const production = !process.env.ROLLUP_WATCH;
function serve() {
    let server;
    function toExit() {
        if (server)
            server.kill(0);
    }
    return {
        writeBundle() {
            if (server)
                return;
            server = require('child_process').spawn('npm', [
                'run',
                'start',
                '--',
                '--dev'
            ], {
                stdio: [
                    'ignore',
                    'inherit',
                    'inherit'
                ],
                shell: true
            });
            process.on('SIGTERM', toExit);
            process.on('exit', toExit);
        }
    };
}
const dummy1 = { plugins: 'abc' };
export default {
    plugins: [
        svelte({
            compilerOptions: {
                generate: "dom",
                hydratable: true
            }
        }),
        css({ output: 'bundle.css' }),
        resolve({
            browser: true,
            dedupe: ['svelte'],
            moduleDirectories: ['test/resources/rollup/success-no-compilerOptions2/node_modules']
        }),
        commonjs(),
        typescript({
            sourceMap: !production,
            inlineSources: !production
        }),
        !production && serve(),
        !production && livereload('public'),
        production && terser(),
        virtual({
            main: `
      import App from 'test/resources/rollup/success-no-compilerOptions2/input/index.svelte';
      const app = new App({
        target: document.body,
        props: __KVELTE_PROPS__,
        hydrate: true
      });
      export default app;
    `
        })
    ],
    input: 'main',
    output: {
        sourcemap: false,
        format: 'iife',
        name: 'app',
        file: "test/resources/rollup/success-no-compilerOptions2/output/rollup.config.js/input/index.svelte/bundle.js"
    },
    moduleContext: (id) => { global.kvelte["./input/index.svelte"].dependencies.push(id); }
};
const dummy2 = { plugins: 'abc' };