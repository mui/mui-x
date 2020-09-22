const replaceInFiles = require('replace-in-files');

replaceInFiles({
  files: 'build/*',
  from: '@material-ui/x-grid-modules',
  to: './x-grid-modules/src',
});
