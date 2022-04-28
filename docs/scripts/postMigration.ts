import fs from 'fs-extra';
import path from 'path';
import prettier from 'prettier';

const replaceMaterialLinks = (markdown: string) => {
  return markdown.replace(
    /\(\/(guides|customization|getting-started|discover-more)\/([^)]*)\)/gm,
    '(/material/$1/$2)',
  );
};

const replaceComponentLinks = (markdown: string) => {
  return markdown
    .replace(/\(\/components\/data-grid([^)]*)\)/gm, '(/x/react-data-grid$1)')
    .replace(
      /\(\/components\/((icons|material-icons|transitions|pickers|about-the-lab)\/?[^)]*)\)/gm,
      '(/material/$1)',
    )
    .replace(/\(\/components\/(?!tabs|breadcrumbs)([^)]*)\)/gm, '(/material/react-$1)')
    .replace(/\(\/material\/(react-[-a-z]+)(x|ch)es(\/|#)([^)]*)\)/gm, '(/material/$1$2$3$4)')
    .replace(/\(\/material\/(react-[-a-z]+)(x|ch)es"/gm, '(/material/$1$2)')
    .replace(
      /\(\/material\/(?!react-tabs|react-breadcrumbs)(react-[-a-z]+)s(\/|#)([^)]*)\)/gm,
      '(/material/$1$2$3)',
    )
    .replace(/\(\/material\/(?!react-tabs|react-breadcrumbs)(react-[-a-z]+)s"/gm, '(/material/$1)')
    .replace(/\(\/components\/(tabs|breadcrumbs)([^)]*)\)/gm, '(/material/react-$1$2)');
};

const replaceAPILinks = (markdown: string) => {
  return markdown
    .replace(/\(\/api\/data-grid([^)]*)\)/gm, '(/x/api/data-grid$1)')
    .replace(
      /\(\/api\/(loading-button|tab-list|tab-panel|date-picker|date-time-picker|time-picker|calendar-picker|calendar-picker-skeleton|desktop-picker|mobile-date-picker|month-picker|pickers-day|static-date-picker|year-picker|masonry|timeline|timeline-connector|timeline-content|timeline-dot|timeline-item|timeline-opposite-content|timeline-separator|unstable-trap-focus|tree-item|tree-view)([^)]*)\)/gm,
      '(/material/api/$1$2)',
    )
    .replace(/\(\/api\/([^"-]+-unstyled)([^)]*)\)/gm, '(/base/api/$1$2)')
    .replace(/\(\/api\/([^)]*)\)/gm, '(/material/api/$1)');
};

const replaceStylesLinks = (markdown: string) => {
  return markdown.replace(/\(\/styles\/([^)]*)\)/gm, '(/system/styles/$1)');
};

const replaceMarkdownLinks = (markdown: string) => {
  return replaceStylesLinks(replaceMaterialLinks(replaceAPILinks(replaceComponentLinks(markdown))));
};

const workspaceRoot = path.resolve(__dirname, '../../');
const prettierConfigPath = path.join(workspaceRoot, 'prettier.config.js');

function writePrettifiedFile(filename: string, data: string, options: object = {}) {
  const prettierConfig = prettier.resolveConfig.sync(filename, {
    config: prettierConfigPath,
  });
  if (prettierConfig === null) {
    throw new Error(
      `Could not resolve config for '${filename}' using prettier config path '${prettierConfigPath}'.`,
    );
  }

  fs.writeFileSync(filename, prettier.format(data, { ...prettierConfig, filepath: filename }), {
    encoding: 'utf8',
    ...options,
  });
}

const readdirDeep = (directory: string, pathsProp: string[] = []) => {
  const paths: string[] = pathsProp;
  const items = fs.readdirSync(directory);
  items.forEach((item) => {
    const itemPath = path.resolve(directory, item);

    if (fs.statSync(itemPath).isDirectory()) {
      readdirDeep(itemPath, paths);
    }

    if (itemPath.match(/.*\/[^/]+\.[^.]+/)) {
      // ends with extension
      paths.push(itemPath);
    }
  });

  return paths;
};

function run() {
  fs.removeSync(path.resolve(`docs/pages/api-docs`));
  fs.removeSync(path.resolve(`docs/pages/components`));

  fs.removeSync(path.resolve(`test/e2e-website/data-grid-current.spec.ts`));

  const dataDir = readdirDeep(path.resolve(`docs/data`));
  dataDir.forEach((filePath) => {
    if (filePath.endsWith('.md')) {
      let data = fs.readFileSync(filePath, { encoding: 'utf-8' });

      data = replaceMarkdownLinks(data);

      writePrettifiedFile(filePath, data);
    }
  });

  // Turn feature toggle `enable_product_scope: true`
  const featureTogglePath = path.join(process.cwd(), 'docs/src/featureToggle.js');
  let featureToggle = fs.readFileSync(featureTogglePath, { encoding: 'utf8' });

  featureToggle = featureToggle.replace(`enable_redirects: false`, `enable_redirects: true`);

  fs.writeFileSync(featureTogglePath, featureToggle);

  // Add redirects to _redirects (netlify)
  const redirectsPath = path.join(process.cwd(), 'docs/public/_redirects');
  let redirects = fs.readFileSync(redirectsPath, { encoding: 'utf8' });

  redirects = redirects.replace(`/ /components/data-grid/`, `/ /x/react-data-grid/`);

  fs.writeFileSync(redirectsPath, redirects);
}

run();
