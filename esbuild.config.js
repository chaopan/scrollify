import * as esbuild from 'esbuild';

const isProduction = process.argv.includes('production');

const config = {
  entryPoints: ['src/index.tsx'],
  bundle: true,
  outdir: 'public',
  format: 'iife',
  globalName: 'App',
  target: ['es2020'],
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
    '.jsx': 'jsx',
    '.js': 'js',
  },
  plugins: [],
  define: {
    'process.env.NODE_ENV': isProduction ? '"production"' : '"development"',
  },
  minify: isProduction,
  sourcemap: !isProduction,
};

if (isProduction) {
  esbuild.build(config).catch(() => process.exit(1));
} else {
  const context = await esbuild.context(config);
  await context.watch();
  await context.serve({
    servedir: 'public',
    port: 8000,
    fallback: 'public/index.html',
  });
  console.log('🚀 Development server running at http://localhost:8000');
  console.log('📁 Serving static files from root directory');
} 