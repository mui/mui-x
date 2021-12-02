import * as ts from 'typescript';
import path from 'path';
import { renderInline as renderMarkdownInline } from '@material-ui/monorepo/docs/packages/markdown';

import { getSymbolDescription, linkify, Project, writePrettifiedFile } from './utils';

interface BuildEventsDocumentationOptions {
  project: Project;
  documentedInterfaces: Map<string, boolean>;
  workspaceRoot: string;
  prettierConfigPath: string;
}

export default function buildEventsDocumentation(options: BuildEventsDocumentationOptions) {
  const { project, documentedInterfaces, workspaceRoot, prettierConfigPath } = options;

  const gridEventsSymbol = project.exports.GridEvents;
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
        eventParams[memberName.toString()] = project.checker.typeToString(
          project.checker.getTypeOfSymbolAtLocation(member, member.valueDeclaration!),
        );
      });
    }
    eventLookup[event.name] = eventParams;
  });

  gridEventsDeclaration.members.forEach((member) => {
    const name = member.name.getText();
    const description = linkify(
      getSymbolDescription(project.checker.getTypeAtLocation(member).symbol, project),
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
    path.resolve(workspaceRoot, 'docs/src/pages/components/data-grid/events/events.json'),
    JSON.stringify(sortedEvents),
    prettierConfigPath,
  );

  // eslint-disable-next-line no-console
  console.log('Built events file');
}
