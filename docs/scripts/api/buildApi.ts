import * as yargs from 'yargs';
import * as fse from 'fs-extra';
import path from 'path';
import buildComponentsDocumentation from './buildComponentsDocumentation';
import buildInterfacesDocumentation from './buildInterfacesDocumentation';
import buildExportsDocumentation from './buildExportsDocumentation';
import buildSelectorsDocumentation from './buildSelectorsDocumentation';
import buildEventsDocumentation from './buildEventsDocumentation';
import FEATURE_TOGGLE from '../../src/featureToggle';
import { getTypeScriptProjects } from '../getTypeScriptProjects';

async function run() {
  let outputDirectories = ['./docs/pages/api-docs/data-grid'];
  if (FEATURE_TOGGLE.enable_product_scope) {
    outputDirectories = ['./docs/pages/api-docs/data-grid', './docs/pages/x/api/data-grid'];
  }
  if (FEATURE_TOGGLE.enable_redirects) {
    outputDirectories = ['./docs/pages/x/api/data-grid'];
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

      buildEventsDocumentation({
        // TODO: Pass all the projects and add the pro icon for pro-only events
        project: projects.get('x-data-grid-pro')!,
        documentedInterfaces,
      });

      buildSelectorsDocumentation({
        project: projects.get('x-data-grid-pro')!,
        outputDirectory,
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
