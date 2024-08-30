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
    apiPathname: `/x/api/tree-view/${kebabCase(name)}`,
    apiPagesDirectory: path.join(process.cwd(), `docs/pages/x/api/tree-view`),
    readFile: () => {
      srcInfo = parseFile(filename);
      return srcInfo;
    },
    getInheritance: () => null, // TODO: Support inheritance
    getDemos: () => {
      const allMarkdowns = findPagesMarkdown(
        path.join(__dirname, '../../../docs/data/tree-view/'),
      ).map((markdown) => {
        const markdownContent = fs.readFileSync(markdown.filename, 'utf8');
        const markdownHeaders = getHeaders(markdownContent) as any;

        return {
          ...markdown,
          markdownContent,
          components: markdownHeaders.components as string[],
        };
      });

      return allMarkdowns
        .filter((page) => page.pathname.startsWith('/tree-view') && page.components.includes(name))
        .map((page) => {
          return {
            demoPageTitle: renderMarkdown(getTitle(page.markdownContent)),
            demoPathname: `${page.pathname.replace('/tree-view', '/x/react-tree-view')}/`,
          };
        });
    },
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

  if (rootImportPath === '@mui/x-tree-view' && name !== 'RichTreeView') {
    reExportPackage.push('@mui/x-tree-view-pro');
  }

  return [
    `import { ${name} } from '${subdirectoryImportPath}';`,
    ...reExportPackage.map((importPath) => `import { ${name} } from '${importPath}';`),
  ];
}
