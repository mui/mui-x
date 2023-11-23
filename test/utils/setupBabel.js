require('@babel/register')({
  extensions: ['.js', '.ts', '.tsx'],
  ignore: [/node_modules\/(?!@mui\/monorepo)/],
  plugins: ['@babel/plugin-transform-export-namespace-from'],
});
