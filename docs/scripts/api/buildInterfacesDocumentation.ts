import * as ts from 'typescript';
import * as prettier from 'prettier';
import kebabCase from 'lodash/kebabCase';
import path from 'path';
import { renderInline as renderMarkdownInline } from '@material-ui/monorepo/docs/packages/markdown';
import {
  escapeCell,
  getSymbolDescription,
  getSymbolJSDocTags,
  linkify,
  Project,
  Projects,
  stringifySymbol,
  writePrettifiedFile,
} from './utils';

interface ParsedObject {
  name: string;
  project: keyof Projects;
  description?: string;
  properties: ParsedProperty[];
  tags: { [tagName: string]: ts.JSDocTagInfo };
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
  // apiRef
  'GridApi',
  'GridSelectionApi',
  'GridFilterApi',
  'GridSortApi',
  'GridPaginationApi',
  'GridCsvExportApi',
  'GridScrollApi',
  'GridEditRowApi',
  'GridColumnPinningApi',
  'GridPrintExportApi',
  'GridDisableVirtualizationApi',

  // Params
  'GridCellParams',
  'GridRowParams',

  // Others
  'GridColDef',
  'GridCsvExportOptions',
  'GridPrintExportOptions',
  'GridFilterModel',
];

const parseProperty = (propertySymbol: ts.Symbol, project: Project): ParsedProperty => ({
  name: propertySymbol.name,
  description: getSymbolDescription(propertySymbol, project),
  tags: getSymbolJSDocTags(propertySymbol),
  symbol: propertySymbol,
  isOptional: !!propertySymbol.declarations?.find(ts.isPropertySignature)?.questionToken,
  typeStr: stringifySymbol(propertySymbol, project),
});

const parseInterfaceSymbol = (symbol: ts.Symbol, project: Project): ParsedObject | null => {
  const declaration = symbol.declarations![0];

  if (!ts.isInterfaceDeclaration(declaration)) {
    return null;
  }

  const interfaceType = project.checker.getTypeAtLocation(declaration.name);
  const properties = interfaceType
    .getProperties()
    .map((property) => parseProperty(property, project))
    .filter((property) => !property.tags.ignore)
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    name: symbol.name,
    description: getSymbolDescription(symbol, project),
    properties,
    tags: getSymbolJSDocTags(symbol),
    project: project.name,
  };
};

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

  let text = `${headers}\n`;

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

function generateImportStatement(objects: ParsedObject[], projects: Projects) {
  let imports = '```js\n';

  const projectImports = Object.values(projects).map((project) => {
    const objectsInProject = objects.filter((object) => !!project.exports[object.name]);

    return `import {${objectsInProject.map((object) => object.name)}} from '@mui/${project.name}'`;
  });

  imports += prettier.format(projectImports.join('\n// or\n'), {
    singleQuote: true,
    semi: false,
    trailingComma: 'none',
    parser: 'typescript',
  });
  imports += '\n```';

  return imports;
}

function generateMarkdown(
  object: ParsedObject,
  projects: Projects,
  documentedInterfaces: Map<string, boolean>,
) {
  const project = projects[object.project];
  const inlinedInterfaces =
    object.tags.inline?.text?.[0].text
      .split(',')
      .map((el) => {
        const name = el.trim();

        if (!project.exports[name]) {
          return null;
        }

        return parseInterfaceSymbol(project.exports[name], project);
      })
      .filter((el): el is ParsedObject => !!el)
      .sort((a, b) => a.name.localeCompare(b.name)) ?? [];

  const description = linkify(object.description, documentedInterfaces, 'html');
  const imports = generateImportStatement([object, ...inlinedInterfaces], projects);

  let text = `# ${object.name} Interface\n`;
  text += `<p class="description">${description}</p>\n\n`;
  text += '## Import\n\n';
  text += `${imports}\n\n`;
  text += '## Properties\n\n';
  text += `${generateMarkdownFromProperties(object, documentedInterfaces)}`;

  inlinedInterfaces.forEach((inlinedInterface) => {
    text += '\n\n';
    text += `## ${inlinedInterface.name}\n\n`;

    if (object.description) {
      text += `${linkify(inlinedInterface.description, documentedInterfaces, 'html')}\n\n`;
    }

    text += `${generateMarkdownFromProperties(inlinedInterface, documentedInterfaces)}`;
  });

  return text;
}

interface BuildInterfacesDocumentationOptions {
  projects: Projects;
  outputDirectory: string;
}

export default function buildInterfacesDocumentation(options: BuildInterfacesDocumentationOptions) {
  const { projects, outputDirectory } = options;

  const documentedInterfaces = new Map<string, true>();
  const symbols: { projectName: keyof Projects; value: ts.Symbol }[] = [];
  INTERFACES_WITH_DEDICATED_PAGES.forEach((name) => {
    const symbolInXDataGridPro = projects['x-data-grid-pro'].exports[name];
    if (symbolInXDataGridPro) {
      documentedInterfaces.set(name, true);
      return symbols.push({ value: symbolInXDataGridPro, projectName: 'x-data-grid-pro' });
    }

    const symbolInXDataGrid = projects['x-data-grid'].exports[name];
    if (symbolInXDataGrid) {
      documentedInterfaces.set(name, true);
      return symbols.push({ value: symbolInXDataGrid, projectName: 'x-data-grid' });
    }

    throw new Error(`Can't find symbol for ${name}`);
  });

  const gridApiExtendsFrom: string[] = (
    (projects['x-data-grid-pro'].exports.GridApi.declarations![0] as ts.InterfaceDeclaration)
      .heritageClauses ?? []
  ).flatMap((clause) =>
    clause.types
      .map((type) => type.expression)
      .filter(ts.isIdentifier)
      .map((expression) => expression.escapedText),
  );

  symbols.forEach((symbol) => {
    const project = projects[symbol.projectName];
    const parsedInterface = parseInterfaceSymbol(symbol.value, project);

    if (!parsedInterface) {
      return;
    }

    const slug = kebabCase(parsedInterface.name);

    if (gridApiExtendsFrom.includes(parsedInterface.name)) {
      const json = {
        name: parsedInterface.name,
        description: linkify(
          getSymbolDescription(symbol.value, project),
          documentedInterfaces,
          'html',
        ),
        properties: parsedInterface.properties.map((property) => ({
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
      console.log('Built JSON file for', parsedInterface.name);
    } else {
      const markdown = generateMarkdown(parsedInterface, projects, documentedInterfaces);
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
      console.log('Built API docs for', parsedInterface.name);
    }
  });

  return documentedInterfaces;
}
