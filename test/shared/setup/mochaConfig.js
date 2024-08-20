const path = require('path');
const fs = require('fs');

// This function is used to find the packages directory from the current directory.
// It allows us to run tests from the root directory or from the package directory.
const resolvePackagesDir = (fileGlob, currentDir) => {
  if (currentDir === '/') {
    throw new Error(`Could not find packages directory from ${__dirname}`);
  }

  if (fs.existsSync(path.resolve(currentDir, 'packages'))) {
    return path.join(currentDir, fileGlob);
  }

  return resolvePackagesDir(fileGlob, path.join(currentDir, '..'));
};

module.exports = {
  resolvePackagesDir,
  sharedConfig: {
    extension: ['js', 'ts', 'tsx'],
    ignore: ['**/build/**', '**/node_modules/**'],
    recursive: true,
    timeout: (process.env.CIRCLECI === 'true' ? 5 : 2) * 1000, // Circle CI has low-performance CPUs.
    reporter: 'dot',
    // breaks momentjs tests
    // parallel: true,
    // jobs: 8,
    'watch-ignore': [
      '**/node_modules/**',
      // Unrelated directories with a large number of files
      '**/build/**',
    ],
  },
};
