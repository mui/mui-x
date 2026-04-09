import fs from 'fs';
import path from 'path';
import { kebabCase } from 'es-toolkit/string';
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
    apiPathname: `/x/api/chat/${kebabCase(name)}`,
    apiPagesDirectory: path.join(process.cwd(), `docs/pages/x/api/chat`),
    readFile: () => {
      srcInfo = parseFile(filename);
      return srcInfo;
    },
    getInheritance: () => null,
    getDemos: () => {
      const allMarkdowns = findPagesMarkdown(path.join(__dirname, '../../../docs/data/chat/')).map(
        (markdown) => {
          const markdownContent = fs.readFileSync(markdown.filename, 'utf8');
          const markdownHeaders = getHeaders(markdownContent) as any;

          return {
            ...markdown,
            markdownContent,
            components: markdownHeaders.components as string[],
          };
        },
      );

      return allMarkdowns
        .filter((page) => page.pathname.startsWith('/chat') && page.components.includes(name))
        .map((page) => {
          const rawPathname = page.pathname.replace('/chat', '/x/react-chat');
          // The overview page is mapped to /x/react-chat (not /x/react-chat/overview)
          const demoPathname = rawPathname.endsWith('/overview')
            ? `${rawPathname.replace('/overview', '')}/`
            : `${rawPathname}/`;
          return {
            filePath: page.filename,
            demoPageTitle: renderMarkdown(getTitle(page.markdownContent)),
            demoPathname,
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

  let rootImportPath = githubPath.replace(
    /\/packages\/(.+?)?\/src\/.*/,
    (match, pkg) => `@mui/${pkg}`,
  );

  let subdirectoryImportPath = githubPath.replace(
    /\/packages\/(.+?)?\/src\/([^\\/]+)\/.*/,
    (match, pkg, directory) => `@mui/${pkg}/${directory}`,
  );

  // Consolidate x-chat-headless imports into x-chat equivalents
  if (rootImportPath === '@mui/x-chat-headless') {
    rootImportPath = '@mui/x-chat/headless';
  }
  if (subdirectoryImportPath.startsWith('@mui/x-chat-headless/')) {
    const subpath = subdirectoryImportPath.replace('@mui/x-chat-headless/', '');
    if (subpath === 'core' || subpath === 'types') {
      subdirectoryImportPath = `@mui/x-chat/${subpath}`;
    } else {
      subdirectoryImportPath = '@mui/x-chat/headless';
    }
  }

  return [
    `import { ${name} } from '${subdirectoryImportPath}';`,
    `import { ${name} } from '${rootImportPath}';`,
  ];
}
