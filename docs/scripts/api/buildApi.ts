/* eslint-disable no-await-in-loop */
import yargs, { type ArgumentsCamelCase } from 'yargs';
import { hideBin } from 'yargs/helpers';
import path from 'path';
import fs from 'fs';
import { kebabCase } from 'es-toolkit/string';
import {
  buildApiInterfacesJson,
  buildInterfacesDocumentationPage,
} from './buildInterfacesDocumentation';
import buildExportsDocumentation from './buildExportsDocumentation';
import buildGridSelectorsDocumentation from './buildGridSelectorsDocumentation';
import buildGridEventsDocumentation from './buildGridEventsDocumentation';
import {
  XTypeScriptProjects,
  createXTypeScriptProjects,
  datagridApiToDocument,
  interfacesToDocument,
} from '../createXTypeScriptProjects';
import { DocumentedInterfaces, writePrettifiedFile } from './utils';

const bracketsRegexp = /\[\[([^\]]+)\]\]/g;

/**
 * linkify all the [[...]] occurence by the documentedInterfaces if possible.
 * @param {string} directory
 * @param {DocumentedInterfaces} documentedInterfaces
 */
export default async function linkifyTranslation(
  directory: string,
  documentedInterfaces: DocumentedInterfaces,
  folder: string,
) {
  const items = fs.readdirSync(directory);

  await Promise.all(
    items.map(async (item) => {
      const itemPath = path.resolve(directory, item);

      if (fs.statSync(itemPath).isDirectory()) {
        await linkifyTranslation(itemPath, documentedInterfaces, folder);
        return;
      }

      const text = fs.readFileSync(itemPath).toString();

      if (!bracketsRegexp.test(text)) {
        return;
      }

      const linkified = text.replaceAll(bracketsRegexp, (match: string, content: string) => {
        if (!documentedInterfaces.get(content)) {
          return content;
        }
        const url = `/x/api/${folder}/${kebabCase(content)}/`;
        return `<a href='${url}'>${content}</a>`;
      });

      await writePrettifiedFile(itemPath, linkified);
    }),
  );
}

async function run(argv: ArgumentsCamelCase<{ project?: string | undefined }>) {
  const projects = createXTypeScriptProjects();
  const projectFilter = argv.project;

  // Create documentation folder if it does not exist
  const apiPagesFolder = path.resolve('./docs/pages/x/api');

  const filteredInterfaces = projectFilter
    ? interfacesToDocument.filter(({ folder }) => folder === projectFilter)
    : interfacesToDocument;

  for (const { folder, packages, documentedInterfaces } of filteredInterfaces) {
    const subProjects: XTypeScriptProjects = new Map();

    packages.forEach((pck) => {
      subProjects.set(pck, projects.get(pck)!);
    });

    // Create translation folder if it does not exist
    const translationFolder = path.resolve(`./docs/translations/api-docs/${folder}/`);

    const interfacesWithDedicatedPage = await buildInterfacesDocumentationPage({
      projects: subProjects,
      translationPagesDirectory: `docs/translations/api-docs/${folder}`,
      importTranslationPagesDirectory: `docs/translations/api-docs/${folder}`,
      apiPagesDirectory: path.join(process.cwd(), `docs/pages/x/api/${folder}`),
      folder,
      interfaces: documentedInterfaces,
    });

    await linkifyTranslation(translationFolder, interfacesWithDedicatedPage, folder);

    if (folder === 'data-grid') {
      // Generate JSON for some API inerfaces rendered in the `<ApiDocs />` components.
      // This is API insterted inside some demo pages, and not dedicated pages.
      await buildApiInterfacesJson({
        projects: subProjects,
        apiPagesFolder,
        folder,
        interfaces: datagridApiToDocument,
        interfacesWithDedicatedPage,
      });

      await buildGridEventsDocumentation({
        projects: subProjects,
        interfacesWithDedicatedPage,
      });

      await buildGridSelectorsDocumentation({
        project: projects.get('x-data-grid-premium')!,
        apiPagesFolder,
      });
    }
  }

  let exportsProjects = projects;
  if (projectFilter) {
    exportsProjects = new Map();
    projects.forEach((project, name) => {
      if (project.documentationFolderName === projectFilter) {
        exportsProjects.set(name, project);
      }
    });
  }

  buildExportsDocumentation({
    projects: exportsProjects,
  });
}

yargs(hideBin(process.argv))
  .command({
    command: '$0',
    describe: 'generates API docs',
    builder: (command) => {
      return command.option('project', {
        description:
          'Only generate API docs for the given project (e.g. "charts", "data-grid", "date-pickers", "tree-view", "scheduler", "chat").',
        type: 'string',
      });
    },
    handler: run,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
