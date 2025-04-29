import * as ts from 'typescript';
import path from 'path';
import { renderMarkdown } from '@mui/internal-markdown';
import {
  DocumentedInterfaces,
  getSymbolDescription,
  getSymbolJSDocTags,
  linkify,
  stringifySymbol,
  writePrettifiedFile,
} from './utils';
import { XProjectNames, XTypeScriptProjects } from '../createXTypeScriptProjects';

interface BuildEventsDocumentationOptions {
  projects: XTypeScriptProjects;
  interfacesWithDedicatedPage: DocumentedInterfaces;
}

const GRID_PROJECTS: XProjectNames[] = ['x-data-grid', 'x-data-grid-pro', 'x-data-grid-premium'];

export default async function buildGridEventsDocumentation(
  options: BuildEventsDocumentationOptions,
) {
  const { projects, interfacesWithDedicatedPage } = options;

  const events: {
    [eventName: string]: {
      name: string;
      description: string;
      params?: string;
      event?: string;
      projects: XProjectNames[];
      componentProp?: string;
    };
  } = {};

  for (const projectName of GRID_PROJECTS) {
    const project = projects.get(projectName)!;
    const gridEventLookupSymbol = project.exports.GridEventLookup;
    const gridEventLookupType = project.checker.getTypeAtLocation(
      (gridEventLookupSymbol.declarations![0] as ts.InterfaceDeclaration).name,
    ) as ts.EnumType;

    // eslint-disable-next-line no-await-in-loop
    await Promise.all(
      gridEventLookupType.getProperties().map(async (event) => {
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
            interfacesWithDedicatedPage,
            'html',
            'data-grid',
          );

          const eventParams: { [key: string]: string } = {};
          const symbol = project.checker.getTypeAtLocation(declaration.name).symbol;

          if (symbol.members) {
            await Promise.all(
              Array.from(symbol.members.entries(), async ([memberName, member]) => {
                eventParams[memberName.toString()] = await stringifySymbol(member, project);
              }),
            );
          }

          events[event.name] = {
            projects: [project.name],
            name: event.name,
            description: renderMarkdown(description),
            params: linkify(eventParams.params, interfacesWithDedicatedPage, 'html', 'data-grid'),
            event: `MuiEvent<${eventParams.event ?? '{}'}>`,
          };
        }
      }),
    );
  }

  const defaultProject = projects.get('x-data-grid-premium')!;

  const dataGridPremiumProps = defaultProject.checker
    .getTypeAtLocation(
      (defaultProject.exports.DataGridPremiumProps.declarations![0] as ts.ExportSpecifier).name,
    )
    .getProperties();

  // Link the DataGridXXX component props to their events.
  dataGridPremiumProps.forEach((prop) => {
    const declaration = prop.declarations?.find(ts.isPropertySignature);

    const tags = getSymbolJSDocTags(prop);

    if (tags.ignore) {
      return;
    }

    if (
      declaration?.type &&
      ts.isTypeReferenceNode(declaration.type) &&
      ts.isIdentifier(declaration.type.typeName) &&
      declaration.type.typeName.escapedText === 'GridEventListener'
    ) {
      const literalTypeNode = declaration.type.typeArguments?.find(ts.isLiteralTypeNode);
      if (literalTypeNode) {
        const eventName = literalTypeNode.literal.getText().replace(/'/g, '');

        if (events[eventName]) {
          events[eventName].componentProp = prop.escapedName.toString();
        }
      }
    }
  });

  const sortedEvents = Object.values(events).sort((a, b) => a.name.localeCompare(b.name));

  await writePrettifiedFile(
    path.resolve(defaultProject.workspaceRoot, 'docs/data/data-grid/events/events.json'),
    JSON.stringify(sortedEvents),
    defaultProject,
  );

  // eslint-disable-next-line no-console
  console.log('Built events file');
}
