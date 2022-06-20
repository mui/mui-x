import * as ts from 'typescript';
import path from 'path';
import { renderInline as renderMarkdownInline } from '@mui/monorepo/docs/packages/markdown';

import {
  DocumentedInterfaces,
  getSymbolDescription,
  getSymbolJSDocTags,
  linkify,
  stringifySymbol,
  writePrettifiedFile,
} from './utils';
import { ProjectNames, Projects } from '../getTypeScriptProjects';

interface BuildEventsDocumentationOptions {
  projects: Projects;
  documentedInterfaces: DocumentedInterfaces;
}

const GRID_PROJECTS: ProjectNames[] = ['x-data-grid', 'x-data-grid-pro', 'x-data-grid-premium'];

export default function buildGridEventsDocumentation(options: BuildEventsDocumentationOptions) {
  const { projects, documentedInterfaces } = options;

  const events: {
    [eventName: string]: {
      name: string;
      description: string;
      params?: string;
      event?: string;
      projects: ProjectNames[];
    };
  } = {};

  GRID_PROJECTS.forEach((projectName) => {
    const project = projects.get(projectName)!;
    const gridEventLookupSymbol = project.exports.GridEventLookup;
    const gridEventLookupType = project.checker.getTypeAtLocation(
      (gridEventLookupSymbol.declarations![0] as ts.InterfaceDeclaration).name,
    ) as ts.EnumType;

    gridEventLookupType.getProperties().forEach((event) => {
      const tags = getSymbolJSDocTags(event);

      if (tags.ignore) {
        return;
      }

      if (events[event.name]) {
        events[event.name].projects.push(project.name);
      } else {
        const declaration = event.declarations?.find(ts.isPropertySignature);
        if (!declaration) {
          return;
        }

        const description = linkify(
          getSymbolDescription(event, project),
          documentedInterfaces,
          'html',
        );

        const eventParams: { [key: string]: any } = {};
        const symbol = project.checker.getTypeAtLocation(declaration.name).symbol;
        symbol.members?.forEach((member, memberName) => {
          eventParams[memberName.toString()] = stringifySymbol(member, project);
        });

        events[event.name] = {
          projects: [project.name],
          name: event.name,
          description: renderMarkdownInline(description),
          params: linkify(eventParams.params, documentedInterfaces, 'html'),
          event: `MuiEvent<${eventParams.event ?? '{}'}>`,
        };
      }
    });
  });

  const sortedEvents = Object.values(events).sort((a, b) => a.name.localeCompare(b.name));
  const defaultProject = projects.get('x-data-grid')!;

  writePrettifiedFile(
    path.resolve(defaultProject.workspaceRoot, 'docs/data/data-grid/events/events.json'),
    JSON.stringify(sortedEvents),
    defaultProject,
  );

  // eslint-disable-next-line no-console
  console.log('Built events file');
}
