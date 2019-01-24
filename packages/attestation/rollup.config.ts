// Copyright 2019 Centrality Investments Limited
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';
// import camelCase from 'lodash.camelcase'
import typescript from 'rollup-plugin-typescript2';

const pkg = require('./package.json');

export default {
    input: 'src/index.ts',
    output: [
        {file: pkg.main, format: 'cjs', sourcemap: true},
        // {file: pkg.module, format: 'es', sourcemap: true},
    ],

    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: id => {
        const isExternal = !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/') && id !== 'tslib';
        // console.log(id, isExternal);
        return isExternal;
    },
    // external: [],
    watch: {
        include: 'src/**',
    },
    plugins: [
        // Allow json resolution
        json(),
        // Compile TypeScript files
        typescript({
            useTsconfigDeclarationDir: true,
            tsconfigOverride: {
                compilerOptions: {module: 'esnext'},
            },
        }),
        // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
        commonjs(),
        // Allow node_modules resolution, so you can use 'external' to control
        // which external modules to include in the bundle
        // https://github.com/rollup/rollup-plugin-node-resolve#usage
        resolve(),

        // Resolve source maps to the original source
        sourceMaps(),
    ],
};
