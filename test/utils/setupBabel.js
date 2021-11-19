require('@babel/register')({
  extensions: ['.js', '.ts', '.tsx'],
  ignore: [/node_modules\/(?!@material-ui\/(monorepo|unstyled))/],
});
