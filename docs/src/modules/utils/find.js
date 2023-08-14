const fs = require('fs');
const path = require('path');

const jsRegex = /\.js$/;
const blackList = ['/.eslintrc', '/_document', '/_app'];

// Returns the Next.js pages available in a nested format.
// The output is in the next.js format.
// Each pathname is a route you can navigate to.
function findPages(
  options = {},
  directory = path.resolve(__dirname, '../../../pages'),
  pages = [],
) {
  fs.readdirSync(directory).forEach((item) => {
    const itemPath = path.resolve(directory, item);
    const pathname = itemPath
      .replace(new RegExp(`\\${path.sep}`, 'g'), '/')
      .replace(/^.*\/pages/, '')
      .replace('.js', '')
      .replace(/^\/index$/, '/') // Replace `index` by `/`.
      .replace(/\/index$/, '');

    if (
      pathname.indexOf('.eslintrc') !== -1 ||
      // skip playground pages
      pathname.startsWith('/playground')
    ) {
      return;
    }

    if (
      options.front &&
      pathname.indexOf('/components') === -1 &&
      pathname.indexOf('/api-docs') === -1
    ) {
      return;
    }

    if (fs.statSync(itemPath).isDirectory()) {
      const children = [];
      pages.push({
        pathname,
        children,
      });
      findPages(options, itemPath, children);
      return;
    }

    if (!jsRegex.test(item) || blackList.includes(pathname)) {
      return;
    }

    pages.push({
      pathname,
    });
  });

  // sort by pathname without '-' so that e.g. card comes before card-action
  pages.sort((a, b) => {
    const pathnameA = a.pathname.replace(/-/g, '');
    const pathnameB = b.pathname.replace(/-/g, '');
    if (pathnameA < pathnameB) {
      return -1;
    }
    if (pathnameA > pathnameB) {
      return 1;
    }
    return 0;
  });

  return pages;
}

module.exports = {
  findPages,
};
