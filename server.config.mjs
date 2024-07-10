import typescript from '@rollup/plugin-typescript'

export default {
  input: {
    api: './src/api/server.ts',
  },
  output: {
    format: 'esm',
    dir: './dist/server',
    entryFileNames: '[name].mjs',
  },
  plugins: [
    typescript(),
  ],
}
