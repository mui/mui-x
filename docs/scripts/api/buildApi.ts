import * as yargs from 'yargs';
import path from 'path';
import fs from 'fs';
import * as prettier from 'prettier';
import kebabCase from 'lodash/kebabCase';
import buildInterfacesDocumentation from './buildInterfacesDocumentation';
import buildExportsDocumentation from './buildExportsDocumentation';
import buildGridSelectorsDocumentation from './buildGridSelectorsDocumentation';
import buildGridEventsDocumentation from './buildGridEventsDocumentation';
import { createXTypeScriptProjects } from '../createXTypeScriptProjects';
import { DocumentedInterfaces } from './utils';

const DEFAULT_PRETTIER_CONFIG_PATH = path.join(process.cwd(), 'prettier.config.js');

export function writePrettifiedFile(
  filename: string,
  data: string,
  prettierConfigPath: string = DEFAULT_PRETTIER_CONFIG_PATH,
  options: object = {},
) {
  const prettierConfig = prettier.resolveConfig.sync(filename, {
    config: prettierConfigPath,
  });
  if (prettierConfig === null) {
    throw new Error(
      `Could not resolve config for '${filename}' using prettier config path '${prettierConfigPath}'.`,
    );
  }

  fs.writeFileSync(filename, prettier.format(data, { ...prettierConfig, filepath: filename }), {
    encoding: 'utf8',
    ...options,
  });
}

const bracketsRegexp = /\[\[([^\]]+)\]\]/g;

/**
 * linkify all the [[...]] occurence by the documentedInterfaces if possible.
 * @param {string} directory
 * @param {DocumentedInterfaces} documentedInterfaces
 */
export default function linkifyTranslation(
  directory: string,
  documentedInterfaces: DocumentedInterfaces,
) {
  const items = fs.readdirSync(directory);

  items.forEach((item) => {
    const itemPath = path.resolve(directory, item);

    if (fs.statSync(itemPath).isDirectory()) {
      linkifyTranslation(itemPath, documentedInterfaces);
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
      const url = `/x/api/data-grid/${kebabCase(content)}/`;
      return `<a href='${url}'>${content}</a>`;
    });

    writePrettifiedFile(itemPath, linkified);
  });
}

function run() {
  const projects = createXTypeScriptProjects();

  // Create documentation folder if it does not exist
  const apiPagesFolder = path.resolve('./docs/pages/x/api');
  const dataGridTranslationFolder = path.resolve('./docs/translations/api-docs/data-grid/');

  const documentedInterfaces = buildInterfacesDocumentation({
    projects,
    apiPagesFolder,
  });

  linkifyTranslation(dataGridTranslationFolder, documentedInterfaces);

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
