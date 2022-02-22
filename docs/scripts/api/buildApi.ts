import * as yargs from 'yargs';
import * as fse from 'fs-extra';
import path from 'path';
import buildComponentsDocumentation from './buildComponentsDocumentation';
import buildInterfacesDocumentation from './buildInterfacesDocumentation';
import buildExportsDocumentation from './buildExportsDocumentation';
import buildGridSelectorsDocumentation from './buildGridSelectorsDocumentation';
import buildGridEventsDocumentation from './buildGridEventsDocumentation';
import FEATURE_TOGGLE from '../../src/featureToggle';
import { getTypeScriptProjects } from '../getTypeScriptProjects';

async function run() {
  let documentationRoots = ['./docs/pages/api-docs'];
  if (FEATURE_TOGGLE.enable_product_scope) {
      documentationRoots = ['./docs/pages/api-docs', './docs/pages/x/api'];
  }
  if (FEATURE_TOGGLE.enable_redirects) {
      documentationRoots = ['./docs/pages/x/api'];
  }

  const projects = getTypeScriptProjects();

  await Promise.all(
      documentationRoots.map(async (documentationRoot) => {
      projects.forEach(project => {
          fse.mkdirSync(path.resolve(path.join(documentationRoot, project.documentationFolderName)), { mode: 0o777, recursive: true });
      })

      const documentedInterfaces = buildInterfacesDocumentation({
        projects,
          documentationRoot,
      });

      await buildComponentsDocumentation({
          documentationRoot,
        documentedInterfaces,
        projects,
      });

          // TODO: Pass all the projects and add the pro icon for pro-only events.
          buildGridEventsDocumentation({
        project: projects.get('x-data-grid-pro')!,
        documentedInterfaces,
      });

          // TODO: Pass all the projects and add the pro icon for pro-only selectors.
          buildGridSelectorsDocumentation({
        project: projects.get('x-data-grid-pro')!,
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
