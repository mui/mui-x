import fs from 'fs';
import path from 'path';
import kebabCase from 'lodash/kebabCase';
import { getHeaders, getTitle, renderMarkdown } from '@mui/internal-markdown';
import {
  ComponentInfo,
  extractPackageFile,
  getMuiName,
  parseFile,
  toGitHubPath,
} from '@mui-internal/api-docs-builder/buildApiUtils';
import findPagesMarkdown from '@mui-internal/api-docs-builder/utils/findPagesMarkdown';

export function getComponentInfo(filename: string): ComponentInfo {
  const { name } = extractPackageFile(filename);
  let srcInfo: null | ReturnType<ComponentInfo['readFile']> = null;
  if (!name) {
    throw new Error(`Could not find the component name from: ${filename}`);
  }
  return {
    filename,
    name,
    muiName: getMuiName(name),
    apiPathname: `/x/api/data-grid/${kebabCase(name)}`,
    apiPagesDirectory: path.join(process.cwd(), `docs/pages/x/api/data-grid`),
    readFile: () => {
      srcInfo = parseFile(filename);

      const shouldSkip =
        filename.indexOf('internal') !== -1 ||
        !!srcInfo.src.match(/@ignore - internal component\./) ||
        !!srcInfo.src.match(/@ignore - internal hook\./);
      return { ...srcInfo, shouldSkip };
    },
    slotInterfaceName: `${name.replace('DataGrid', 'Grid')}SlotsComponent`,
    getInheritance: () => null, // TODO: Support inheritance
    getDemos: () => {
      if (filename.includes('/components/')) {
        const allMarkdowns = findPagesMarkdown(
          path.join(__dirname, '../../../docs/data/data-grid/components/'),
        ).map((markdown) => {
          const markdownContent = fs.readFileSync(markdown.filename, 'utf8');
          const markdownHeaders = getHeaders(markdownContent) as any;

          return {
            ...markdown,
            markdownContent,
            components: markdownHeaders.components as string[],
          };
        });

        const componentDemos = allMarkdowns
          .filter((page) => page.components?.includes(name))
          .map((page) => ({
            demoPageTitle: renderMarkdown(getTitle(page.markdownContent)),
            demoPathname: `/x/react-data-grid/components/${path.basename(page.pathname)}`,
          }));

        if (componentDemos.length > 0) {
          return componentDemos;
        }
      }

      return [
        { demoPathname: '/x/react-data-grid/#mit-version-free-forever', demoPageTitle: 'DataGrid' },
        { demoPathname: '/x/react-data-grid/#pro-version', demoPageTitle: 'DataGridPro' },
        { demoPathname: '/x/react-data-grid/#premium-version', demoPageTitle: 'DataGridPremium' },
      ];
    },
    layoutConfigPath: 'docsx/src/modules/utils/dataGridLayoutConfig',
  };
}

/**
 * Helper to get the import options
 * @param name The name of the component
 * @param filename The filename where its defined (to infer the package)
 * @returns an array of import command
 */
export function getComponentImports(name: string, filename: string) {
  const githubPath = toGitHubPath(filename);

  const rootImportPath = githubPath.replace(
    /\/packages\/(.+?)?\/src\/.*/,
    (match, pkg) => `@mui/${pkg}`,
  );

  const subdirectoryImportPath = githubPath.replace(
    /\/packages\/(.+?)?\/src\/([^\\/]+)\/.*/,
    (match, pkg, directory) => `@mui/${pkg}/${directory}`,
  );

  const reExportPackage = [rootImportPath];

  if (rootImportPath === '@mui/x-data-grid') {
    reExportPackage.push('@mui/x-data-grid-pro');
    reExportPackage.push('@mui/x-data-grid-premium');
  }
  if (rootImportPath === '@mui/x-data-grid-pro') {
    reExportPackage.push('@mui/x-data-grid-premium');
  }

  return [
    `import { ${name} } from '${subdirectoryImportPath}';`,
    ...reExportPackage.map((importPath) => `import { ${name} } from '${importPath}';`),
  ];
}
