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
  let outputDirectories = ['./docs/pages/api-docs'];
  if (FEATURE_TOGGLE.enable_product_scope) {
    outputDirectories = ['./docs/pages/api-docs', './docs/pages/x/api'];
  }
  if (FEATURE_TOGGLE.enable_redirects) {
    outputDirectories = ['./docs/pages/x/api'];
  }

  const projects = getTypeScriptProjects();

  await Promise.all(
    outputDirectories.map(async (dir) => {
      const outputDirectory = path.resolve(dir);
      fse.mkdirSync(outputDirectory, { mode: 0o777, recursive: true });

      const documentedInterfaces = buildInterfacesDocumentation({
        projects,
        outputDirectory,
      });

      await buildComponentsDocumentation({
        outputDirectory,
        documentedInterfaces,
        projects,
      });

      buildGridEventsDocumentation({
        // TODO: Pass all the projects and add the pro icon for pro-only events
        project: projects.get('x-data-grid-pro')!,
        documentedInterfaces,
      });

      buildGridSelectorsDocumentation({
        project: projects.get('x-data-grid-pro')!,
        documentationRoot: outputDirectory,
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
