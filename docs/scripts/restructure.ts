import fs from 'fs';
import path from 'path';

const readdirDeep = (directory: string, pathsProp: string[] = []) => {
  const paths: string[] = pathsProp;
  const items = fs.readdirSync(directory);
  items.forEach((item) => {
    const itemPath = path.resolve(directory, item);

    if (fs.statSync(itemPath).isDirectory()) {
      readdirDeep(itemPath, paths);
    }

    paths.push(itemPath);
  });

  return paths;
};

const copyFile = (sourcePath: string, destinationPath: string) => {
  const file = fs.readFileSync(path.join(process.cwd(), sourcePath), { encoding: 'utf8' });
  const match = destinationPath.match(/^(.*)\/[^/]+\.(ts|js|tsx|md|json|tsx\.preview)$/);
  if (match) {
    fs.mkdirSync(path.join(process.cwd(), match[1].replace('api-docs', 'x/api')), {
      recursive: true,
    });
    fs.writeFileSync(path.join(process.cwd(), destinationPath.replace('api-docs', 'x/api')), file);
  }
};

function run() {
  /**
   * clone pages & api data from `docs/src/pages.ts` to `docs/src/data/materialPages.ts`
   * also prefix all pathnames with `/$product/` by using Regexp replace
   */

  // clone js/md data to new location
  const dataDir = readdirDeep(path.resolve(`docs/src/pages/components/data-grid`));
  dataDir.forEach((filePath) => {
    const match = filePath.match(/^(.*)\/[^/]+\.(ts|js|tsx|md|json|tsx\.preview)$/);
    const info = match
      ? {
          directory: match[1].replace('src/pages/components', 'data'),
          path: filePath.replace('src/pages/components', 'data'),
        }
      : null;
    // pathname could be a directory
    if (info) {
      let data = fs.readFileSync(filePath, { encoding: 'utf-8' });
      if (filePath.endsWith('.md')) {
        // remove relative path, so that the demos does not rely on a specific path
        // before: {{"demo": "pages/components/data-grid/accessibility/DensitySelectorSmallGrid.js", "bg": "inline"}}
        // after: {{"demo": "DensitySelectorSmallGrid.js", "bg": "inline"}}
        data = data.replace(/"pages\/?[^"]*\/([^"]+\.js)"/gm, `"$1"`);
      }
      if (filePath.endsWith('.js')) {
        data = data.replace('pages/api-docs/data-grid', `pages/x/api/data-grid`);
      }
      fs.mkdirSync(info.directory, { recursive: true });
      fs.writeFileSync(info.path, data);

      fs.rmSync(filePath);
    }
  });

  const pagesDir = readdirDeep(path.resolve(`docs/pages/components/data-grid`));
  pagesDir.forEach((filePath) => {
    const match = filePath.match(/^(.*)\/[^/]+\.(ts|js|tsx|md|json|tsx\.preview)$/);
    const info = match
      ? {
          directory: match[1].replace('components/data-grid', 'x/react-data-grid'),
          path: filePath.replace('components/data-grid', 'x/react-data-grid'),
        }
      : null;

    if (info) {
      let data = fs.readFileSync(filePath, { encoding: 'utf-8' });

      if (filePath.endsWith('.js')) {
        data = data.replace('src/pages/components', `data`); // point to data path (A) in new directory
      }

      fs.mkdirSync(info.directory, { recursive: true });
      fs.writeFileSync(info.path, data);

      fs.writeFileSync(filePath, data);
    }
  });

  // copy docs/pages/api-docs/data-grid/index to docs/pages/x/api/data-grid/index
  copyFile('docs/pages/api-docs/data-grid/index.js', 'docs/pages/x/api/data-grid/index.js');
  copyFile('docs/pages/api-docs/data-grid/index.md', 'docs/pages/x/api/data-grid/index.md');

  // Turn feature toggle `enable_product_scope: true`
  const featureTogglePath = path.join(process.cwd(), 'docs/src/featureToggle.js');
  let featureToggle = fs.readFileSync(featureTogglePath, { encoding: 'utf8' });

  featureToggle = featureToggle.replace(
    `enable_product_scope: false`,
    `enable_product_scope: true`,
  );

  fs.writeFileSync(featureTogglePath, featureToggle);

  // update file import in SelectorDocs
  const selectorDocsPath = path.join(process.cwd(), 'docs/src/modules/components/SelectorsDocs.js');
  let selectorDocs = fs.readFileSync(selectorDocsPath, { encoding: 'utf8' });

  selectorDocs = selectorDocs.replace(
    `docsx/pages/api-docs/data-grid`,
    `docsx/pages/x/api/data-grid`,
  );
  fs.writeFileSync(selectorDocsPath, selectorDocs);
}

run();
