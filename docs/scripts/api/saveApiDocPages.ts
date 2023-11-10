import path from 'path';
import { XTypeScriptProject } from '../createXTypeScriptProjects';
import { writePrettifiedFile } from './utils';

export type ApiPageType = {
  folderName: string;
  pathname: string;
  title: string;
  plan?: 'pro' | 'premium' | undefined;
};

export function getPlan(imports: string[]): 'pro' | 'premium' | undefined {
  const packages = imports.map((el) => /(.*) from (.*)/.exec(el)?.[2] ?? '');

  if (
    packages.some((packageName) => !packageName.includes('premium') && !packageName.includes('pro'))
  ) {
    return undefined;
  }

  if (packages.some((packageName) => packageName.includes('pro'))) {
    return 'pro';
  }
  return 'premium';
}

type Options = {
  /**
   * The path the reach docs/data/.
   * Used to save the file
   */
  dataFolder: string;
  /**
   * A string to identify if those pages are about components, interfaces, selectors, or others.
   */
  identifier: string;
  /**
   * One of the projects. Used to prettify the docs
   */
  project: XTypeScriptProject;
};
export default async function saveApiDocPages(
  createdPages: ApiPageType[],
  { dataFolder, identifier, project }: Options,
) {
  const pagesPerFolder: { [folderName: string]: Omit<ApiPageType, 'folderName'>[] } = {};

  createdPages.forEach(({ folderName, ...other }) => {
    if (pagesPerFolder[folderName] === undefined) {
      pagesPerFolder[folderName] = [];
    }
    pagesPerFolder[folderName].push(other);
  });

  Object.keys(pagesPerFolder).forEach((folderName) => {
    pagesPerFolder[folderName].sort(({ title: titleA }, { title: titleB }) =>
      titleA.localeCompare(titleB),
    );

    writePrettifiedFile(
      path.resolve(dataFolder, `${folderName}-${identifier}-pages.ts`),
      `import type { MuiPage } from 'docs/src/MuiPage';
  
  export default ${JSON.stringify(pagesPerFolder[folderName])} as MuiPage[]`,
      project,
    );
  });
}
