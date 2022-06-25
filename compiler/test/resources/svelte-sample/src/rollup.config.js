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
export default {
    plugins: [
        svelte({
            preprocess: sveltePreprocess({ sourceMap: !production }),
            compilerOptions: {
                generate: "dom",
                hydratable: true
            }
        }),
        css({ output: 'bundle.css' }),
        resolve({
            browser: true,
            dedupe: ['svelte'],
            moduleDirectories: ['/Users/baseballyama/Desktop/git/kvelte/compiler/test/resources/temp/1650810073285/dom/node_modules']
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
      import App from '/Users/baseballyama/Desktop/git/kvelte/compiler/test/resources/temp/1650810073285/dom/src/App.svelte';
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
        file: "/Users/baseballyama/Desktop/git/kvelte/compiler/test/resources/temp/1650810073285/dom/bundle.js"
    },
    moduleContext: (id) => { global.kvelte["/Users/baseballyama/Desktop/git/kvelte/compiler/test/resources/temp/1650810073285/dom/src/App.svelte"].dependencies.push(id); }
};