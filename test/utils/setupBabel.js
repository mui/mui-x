require('@babel/register')({
  extensions: ['.js', '.ts', '.tsx'],
  ignore: [/node_modules\/.*\/node_modules\/(?!@mui\/monorepo)/],
});
