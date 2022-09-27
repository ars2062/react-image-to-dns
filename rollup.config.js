import typescript from '@rollup/plugin-typescript';

import pkg from './package.json';

/** @type {import('rollup').RollupOptions} */
export default {
  input: 'src/index.ts',
  external: [...Object.keys(pkg.dependencies), 'fs'],
  output: { file: pkg.main, format: 'module', esModule: true },
  plugins: [typescript({ sourceMap: false })]
};