import * as ts from 'typescript';
import kebabCase from 'lodash/kebabCase';
import path from 'path';
import { renderInline as renderMarkdownInline } from '@material-ui/monorepo/docs/packages/markdown';
import {
  escapeCell,
  getSymbolDescription,
  getSymbolJSDocTags,
  linkify,
  Project,
  stringifySymbol,
  writePrettifiedFile,
} from './utils';

interface ParsedObject {
  name: string;
  description?: string;
  properties: ParsedProperty[];
}

interface ParsedProperty {
  name: string;
  description: string;
  tags: { [tagName: string]: ts.JSDocTagInfo };
  isOptional: boolean;
  symbol: ts.Symbol;
  typeStr: string;
}

const INTERFACES_WITH_DEDICATED_PAGES = [
  'GridApi',
  'GridColDef',
  'GridCellParams',
  'GridRowParams',
  'GridSelectionApi',
  'GridFilterApi',
  'GridSortApi',
  'GridPaginationApi',
  'GridCsvExportApi',
  'GridCsvExportOptions',
  'GridPrintExportApi',
  'GridDisableVirtualizationApi',
  'GridPrintExportOptions',
  'GridScrollApi',
  'GridEditRowApi',
  'GridColumnPinningApi',
];

const parseProperty = (propertySymbol: ts.Symbol, project: Project): ParsedProperty => ({
  name: propertySymbol.name,
  description: getSymbolDescription(propertySymbol, project),
  tags: getSymbolJSDocTags(propertySymbol),
  symbol: propertySymbol,
  isOptional: !!propertySymbol.declarations?.find(ts.isPropertySignature)?.questionToken,
  typeStr: stringifySymbol(propertySymbol, project),
});

function generateMarkdownFromProperties(
  object: ParsedObject,
  documentedInterfaces: Map<string, boolean>,
) {
  const hasDefaultValue = object.properties.some((property) => {
    return property.tags.default;
  });

  const headers = hasDefaultValue
    ? `
| Name | Type | Default | Description |
|:-----|:-----|:--------|:------------|`
    : `
| Name | Type | Description |
|:-----|:-----|:------------|`;

  let text = `## Properties\n\n${headers}\n`;

  object.properties.forEach((property) => {
    const defaultValue = property.tags.default?.text?.[0].text;

    const formattedName = property.isOptional
      ? `<span class="prop-name optional">${property.name}<sup><abbr title="optional">?</abbr></sup></span>`
      : `<span class="prop-name">${property.name}</span>`;

    const formattedType = `<span class="prop-type">${escapeCell(property.typeStr)}</span>`;

    const formattedDefaultValue =
      defaultValue == null ? '' : `<span class="prop-default">${escapeCell(defaultValue)}</span>`;

    const formattedDescription = escapeCell(
      linkify(property.description, documentedInterfaces, 'markdown'),
    );

    if (hasDefaultValue) {
      text += `| ${formattedName} | ${formattedType} | ${formattedDefaultValue} | ${formattedDescription} |\n`;
    } else {
      text += `| ${formattedName} | ${formattedType} | ${formattedDescription} |\n`;
    }
  });

  return text;
}

function generateImportStatement(object: ParsedObject) {
  // TODO: Check if interface was exported
  if (object.name === 'GridApi') {
    return `\`\`\`js
import { ${object.name} } from '@mui/x-data-grid-pro';
\`\`\``;
  }

  return `\`\`\`js
import { ${object.name} } from '@mui/x-data-grid-pro';
// or
import { ${object.name} } from '@mui/x-data-grid';
\`\`\``;
}

function generateMarkdown(object: ParsedObject, documentedInterfaces: Map<string, boolean>) {
  return [
    `# ${object.name} Interface`,
    '',
    `<p class="description">${linkify(object.description, documentedInterfaces, 'html')}</p>`,
    '',
    '## Import',
    '',
    generateImportStatement(object),
    '',
    generateMarkdownFromProperties(object, documentedInterfaces),
  ].join('\n');
}

interface BuildInterfacesDocumentationOptions {
  project: Project;
  outputDirectory: string;
}

export default function buildInterfacesDocumentation(options: BuildInterfacesDocumentationOptions) {
  const { project, outputDirectory } = options;

  const documentedInterfaces = new Map<string, true>();
  INTERFACES_WITH_DEDICATED_PAGES.forEach((name) => {
    const symbol = project.exports[name];
    if (!symbol) {
      throw new Error(`Can't find symbol for ${name}`);
    }

    documentedInterfaces.set(name, true);
  });

  const gridApiExtendsFrom: string[] = (
    (project.exports.GridApi.declarations![0] as ts.InterfaceDeclaration).heritageClauses ?? []
  ).flatMap((clause) =>
    clause.types
      .map((type) => type.expression)
      .filter(ts.isIdentifier)
      .map((expression) => expression.escapedText),
  );

  documentedInterfaces.forEach((_, interfaceName) => {
    const interfaceSymbol = project.exports[interfaceName];
    const interfaceDeclaration = interfaceSymbol.declarations![0];

    if (!ts.isInterfaceDeclaration(interfaceDeclaration)) {
      return;
    }

    const interfaceType = project.checker.getTypeAtLocation(interfaceDeclaration.name);
    const properties = interfaceType
      .getProperties()
      .map((property) => parseProperty(property, project))
      .filter((property) => !property.tags.ignore)
      .sort((a, b) => a.name.localeCompare(b.name));

    const object: ParsedObject = {
      name: interfaceSymbol.name,
      description: getSymbolDescription(interfaceSymbol, project),
      properties,
    };

    const slug = kebabCase(object.name);

    if (gridApiExtendsFrom.includes(object.name)) {
      const json = {
        name: object.name,
        description: linkify(
          getSymbolDescription(interfaceSymbol, project),
          documentedInterfaces,
          'html',
        ),
        properties: properties.map((property) => ({
          name: property.name,
          description: renderMarkdownInline(
            linkify(property.description, documentedInterfaces, 'html'),
          ),
          type: property.typeStr,
        })),
      };
      writePrettifiedFile(
        path.resolve(outputDirectory, `${slug}.json`),
        JSON.stringify(json),
        project,
      );
      // eslint-disable-next-line no-console
      console.log('Built JSON file for', object.name);
    } else {
      const markdown = generateMarkdown(object, documentedInterfaces);
      writePrettifiedFile(path.resolve(outputDirectory, `${slug}.md`), markdown, project);

      writePrettifiedFile(
        path.resolve(outputDirectory, `${slug}.js`),
        `import * as React from 'react';
    import MarkdownDocs from '@material-ui/monorepo/docs/src/modules/components/MarkdownDocs';
    import { demos, docs, demoComponents } from './${slug}.md?@mui/markdown';

    export default function Page() {
      return <MarkdownDocs demos={demos} docs={docs} demoComponents={demoComponents} />;
    }
        `,
        project,
      );

      // eslint-disable-next-line no-console
      console.log('Built API docs for', object.name);
    }
  });

  return documentedInterfaces;
}
