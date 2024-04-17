require('@babel/register')({
  extensions: ['.js', '.ts', '.tsx'],
  ignore: [
    function ignore(filePath) {
      if (filePath.includes('/node_modules/')) {
        return !filePath.includes('/node_modules/@mui/monorepo');
      }
      return false;
    },
  ],
});
