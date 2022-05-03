import * as ts from 'typescript';
import path from 'path';
import { renderInline as renderMarkdownInline } from '@mui/monorepo/docs/packages/markdown';

import {
  DocumentedInterfaces,
  getSymbolDescription,
  getSymbolJSDocTags,
  linkify,
  resolveExportSpecifier,
  stringifySymbol,
  writePrettifiedFile,
} from './utils';
import { Project } from '../getTypeScriptProjects';

interface BuildEventsDocumentationOptions {
  project: Project;
  documentedInterfaces: DocumentedInterfaces;
}

export default function buildGridEventsDocumentation(options: BuildEventsDocumentationOptions) {
  const { project, documentedInterfaces } = options;

  const gridEventsSymbol = resolveExportSpecifier(project.exports.GridEvents, project);
  const gridEventsDeclaration = gridEventsSymbol.declarations![0] as ts.EnumDeclaration;

  const gridEventLookupSymbol = project.exports.GridEventLookup;
  const gridEventLookupType = project.checker.getTypeAtLocation(
    (gridEventLookupSymbol.declarations![0] as ts.InterfaceDeclaration).name,
  ) as ts.EnumType;

  const events: { name: string; description: string; params?: string; event?: string }[] = [];
  const eventLookup: { [eventName: string]: any } = {};

  gridEventLookupType.getProperties().forEach((event) => {
    const eventParams = {};
    const declaration = event.declarations?.find(ts.isPropertySignature);
    if (declaration) {
      const symbol = project.checker.getTypeAtLocation(declaration.name).symbol;
      symbol.members?.forEach((member, memberName) => {
        eventParams[memberName.toString()] = stringifySymbol(member, project);
      });
    }
    eventLookup[event.name] = eventParams;
  });

  gridEventsDeclaration.members.forEach((member) => {
    const eventSymbol = project.checker.getTypeAtLocation(member).symbol;
    const tags = getSymbolJSDocTags(eventSymbol);

    if (tags.ignore) {
      return;
    }

    const name = member.name.getText();
    const description = linkify(
      getSymbolDescription(eventSymbol, project),
      documentedInterfaces,
      'html',
    );
    const eventProperties = eventLookup[name];

    events.push({
      name,
      description: renderMarkdownInline(description),
      params: linkify(eventProperties.params, documentedInterfaces, 'html'),
      event: `MuiEvent<${eventProperties.event ?? '{}'}>`,
    });
  });

  const sortedEvents = events.sort((a, b) => a.name.localeCompare(b.name));
  writePrettifiedFile(
    path.resolve(project.workspaceRoot, 'docs/data/data-grid/events/events.json'),
    JSON.stringify(sortedEvents),
    project,
  );

  // eslint-disable-next-line no-console
  console.log('Built events file');
}
