const { context } = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

async function watch() {
  const ctx = await context({
    entryPoints: ['src/server.ts'],
    outfile: 'dist/server.js',
    bundle: true,
    platform: 'node',
    target: 'es2022',
    format: 'esm',
    sourcemap: true,
    plugins: [nodeExternalsPlugin()],
  });

  await ctx.watch();
  console.log('Watching for changes...');

  process.on('SIGINT', async () => {
    await ctx.dispose();
    process.exit(0);
  });
}

watch().catch((error) => {
  console.error('Watch failed:', error);
  process.exit(1);
});