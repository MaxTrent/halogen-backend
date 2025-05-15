const { build } = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

build({
  entryPoints: ['src/server.ts'],
  outfile: 'dist/server.js',
  bundle: true,
  platform: 'node',
  target: 'es2020',
  format: 'esm',
  sourcemap: true,
  plugins: [nodeExternalsPlugin()],
}).catch(() => process.exit(1));