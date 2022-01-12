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
        data = data.replace(/"pages\/[/\-a-zA-Z]*\/([a-zA-Z]*\.js)"/gm, `"$1"`);
      }
      fs.mkdirSync(info.directory, { recursive: true });
      fs.writeFileSync(info.path, data); // (A)

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

  // Turn feature toggle `enable_product_scope: true`
  const featureTogglePath = path.join(process.cwd(), 'docs/src/featureToggle.js');
  let featureToggle = fs.readFileSync(featureTogglePath, { encoding: 'utf8' });

  featureToggle = featureToggle.replace(
    `enable_product_scope: false`,
    `enable_product_scope: true`,
  );

  fs.writeFileSync(featureTogglePath, featureToggle);
}

run();
