/* eslint-disable no-console */
const path = require('path');
const fse = require('fs-extra');
const { createRender } = require('@mui/monorepo/docs/packages/markdown');
const { marked } = require('marked');

// Use renderer to extract all links into a markdown document
const getPageLinks = (markdown) => {
  const hrefs = [];

  const renderer = new marked.Renderer();
  renderer.link = (href) => {
    if (href[0] === '/') {
      hrefs.push(href);
    }
  };
  marked(markdown, { renderer });
  return hrefs;
};

// List all .js files in a folder
const getJsFilesInFolder = (folderPath) => {
  const files = fse.readdirSync(folderPath, { withFileTypes: true });
  return files.reduce((acc, file) => {
    if (file.isDirectory()) {
      const filesInFolder = getJsFilesInFolder(path.join(folderPath, file.name));
      return [...acc, ...filesInFolder];
    }
    if (file.name.endsWith('.js')) {
      return [...acc, path.join(folderPath, file.name)];
    }
    return acc;
  }, []);
};

// Returns url assuming it's "./docs/pages/x/..." becomes  "mui.com/x/..."
const jsFilePathToUrl = (jsFilePath) => {
  const folder = path.dirname(jsFilePath);
  const file = path.basename(jsFilePath);

  const root = folder.slice(jsFilePath.indexOf('/pages') + '/pages'.length);
  let page = `/${file.slice(0, file.length - '.js'.length)}`;

  if (page === '/index') {
    page = '';
  }

  return `${root}${page}`;
};

function getLinksAndAnchors(fileName) {
  const toc = [];
  const headingHashes = {};
  const userLanguage = 'en';
  const render = createRender({ headingHashes, toc, userLanguage });

  const data = fse.readFileSync(fileName, { encoding: 'utf-8' });
  render(data);

  const links = getPageLinks(data);

  return {
    hashes: Object.keys(headingHashes),
    links,
  };
}

// {[url with hash]: true}
const availableLinks = {};

// {[url with hash]: list of files using this link}
const usedLinks = {};

const jsPageFiles = getJsFilesInFolder(path.join(__dirname, '../pages/x'));

const mdFiles = jsPageFiles.flatMap((jsPageFile) => {
  // For each JS file extract the markdown rendered if it exists
  const fileContent = fse.readFileSync(jsPageFile, 'utf8');
  /**
   * Content files can be represented by either:
   * - 'docsx/data/advanced-components/overview.md?@mui/markdown';
   * - './index.md?@mui/markdown';
   */
  const importPaths = fileContent.match(/'.*\?@mui\/markdown'/g);

  return importPaths === null
    ? []
    : importPaths.map((importPath) => {
        let cleanImportPath = importPath.slice(1, importPath.length - "?@mui/markdown'".length);
        if (cleanImportPath.startsWith('docsx/data/')) {
          cleanImportPath = path.join(__dirname, `../${cleanImportPath.slice('docsx/'.length)}`);
        } else {
          cleanImportPath = path.join(path.dirname(jsPageFile), cleanImportPath);
        }
        const url = jsFilePathToUrl(jsPageFile);

        return { fileName: cleanImportPath, url };
      });
});

// Mark all the existing page as available
jsPageFiles.forEach((jsFilePath) => {
  const url = jsFilePathToUrl(jsFilePath);
  availableLinks[url] = true;
});

// For each markdown file, extract links
mdFiles.forEach(({ fileName, url }) => {
  const { hashes, links } = getLinksAndAnchors(fileName);

  links
    .map((link) => (link[link.length - 1] === '/' ? link.slice(0, link.length - 1) : link))
    .forEach((link) => {
      if (usedLinks[link] === undefined) {
        usedLinks[link] = [fileName];
      } else {
        usedLinks[link].push(fileName);
      }
    });

  hashes.forEach((hash) => {
    availableLinks[`${url}/#${hash}`] = true;
  });
});

function getPageUrlFromLink(link) {
  const [rep] = link.split('/#');
  return rep;
}

Object.keys(usedLinks)
  .filter((link) => link.startsWith('/x'))
  .filter((link) => !availableLinks[link])
  .sort()
  .forEach((linkKey) => {
    console.log(`not found: https://mui.com${linkKey}`);
    console.log(`used in`);
    usedLinks[linkKey].forEach((f) => console.log(`- ${f}`));
    console.log('available on the same page:');
    console.log(
      Object.keys(availableLinks)
        .filter((link) => getPageUrlFromLink(link) === getPageUrlFromLink(linkKey))
        .sort(),
    );
    console.log('\n\n');
  });
