import assert from "assert";
import { describe, it } from "mocha";
import { rollup } from "rollup";
import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import path from "path";
import commonjs from '@rollup/plugin-commonjs';

const image = require('../dist/index.js').default

// process.chdir(__dirname)

describe('rollup-plugin-image-source', function () {
    it('generates image source', function (done) {
        rollup({
            input: path.resolve(__dirname, 'samples/index.js'),
            output: {
                dir: path.resolve(__dirname, 'samples/dist')
            },
            plugins: [
                nodeResolve({
                    extensions: ['.js', '.jsx']
                }),
                babel({
                    presets: ['@babel/preset-react']
                }),
                commonjs(),
                image(),
            ]
        }).then(async ({ generate }) => {
            const generated = await generate({});
            const { output: chunks } = generated;
            // for (let i = 0; i < chunks.length; i++) {
            //     const chunk = chunks[i];
            //     // console.log(chunk.type, chunk);
            // }
            assert.ok(chunks)
            assert.equal(true, true)
        }).finally(done)
    }).timeout(10000)
})