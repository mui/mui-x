import * as yargs from 'yargs';
import path from 'path';
import buildComponentsDocumentation from './buildComponentsDocumentation';
import buildInterfacesDocumentation from './buildInterfacesDocumentation';
import buildExportsDocumentation from './buildExportsDocumentation';
import buildGridSelectorsDocumentation from './buildGridSelectorsDocumentation';
import buildGridEventsDocumentation from './buildGridEventsDocumentation';
import { createXTypeScriptProjects } from '../createXTypeScriptProjects';

async function run() {
  const projects = createXTypeScriptProjects();

  // Create documentation folder if it does not exist
  const apiPagesFolder = path.resolve('./docs/pages/x/api');
  const dataFolder = path.resolve('./docs/data');

  const documentedInterfaces = buildInterfacesDocumentation({
    projects,
    apiPagesFolder,
  });

  await buildComponentsDocumentation({
    apiPagesFolder,
    dataFolder,
    documentedInterfaces,
    projects,
  });

  buildGridEventsDocumentation({
    projects,
    documentedInterfaces,
  });

  buildGridSelectorsDocumentation({
    project: projects.get('x-data-grid-premium')!,
    apiPagesFolder,
  });

  buildExportsDocumentation({
    projects,
  });
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
