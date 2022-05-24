import * as yargs from 'yargs';
import * as fse from 'fs-extra';
import path from 'path';
import buildComponentsDocumentation from './buildComponentsDocumentation';
import buildInterfacesDocumentation from './buildInterfacesDocumentation';
import buildExportsDocumentation from './buildExportsDocumentation';
import buildGridSelectorsDocumentation from './buildGridSelectorsDocumentation';
import buildGridEventsDocumentation from './buildGridEventsDocumentation';
import { getTypeScriptProjects } from '../getTypeScriptProjects';

async function run() {
  const documentationRoots = ['./docs/pages/x/api'];

  const projects = getTypeScriptProjects();

  await Promise.all(
    documentationRoots.map(async (relativeDocumentationRoot) => {
      const documentationRoot = path.resolve(relativeDocumentationRoot);
      fse.mkdirSync(documentationRoot, { mode: 0o777, recursive: true });

      const documentedInterfaces = buildInterfacesDocumentation({
        projects,
        documentationRoot,
      });

      await buildComponentsDocumentation({
        documentationRoot,
        documentedInterfaces,
        projects,
      });

      buildGridEventsDocumentation({
        // TODO: Pass all the projects and add the pro / premium icon for pro-only / premium-only events
        project: projects.get('x-data-grid-premium')!,
        documentedInterfaces,
      });

      buildGridSelectorsDocumentation({
        project: projects.get('x-data-grid-premium')!,
        documentationRoot,
      });

      buildExportsDocumentation({
        projects,
      });

      return Promise.resolve();
    }),
  );
}

yargs
  .command({
    command: '$0',
    describe: 'generates API docs',
    handler: run,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
