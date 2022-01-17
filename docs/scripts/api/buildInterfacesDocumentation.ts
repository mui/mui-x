import * as ts from 'typescript';
import * as prettier from 'prettier';
import kebabCase from 'lodash/kebabCase';
import path from 'path';
import { renderInline as renderMarkdownInline } from '@mui/monorepo/docs/packages/markdown';
import {
  escapeCell,
  getSymbolDescription,
  getSymbolJSDocTags,
  linkify,
  Project,
  Projects,
  stringifySymbol,
  writePrettifiedFile,
  DocumentedInterfaces,
  ProjectNames,
} from './utils';

interface ParsedObject {
  name: string;
  project: ProjectNames;
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

  // Filters
  'GridFilterModel',
  'GridFilterItem',
  'GridFilterOperator',
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
  let resolvedSymbol = symbol;

  // If the export is done using `export type { XXX } from './module'`
  // We must go to the root declaration
  while (resolvedSymbol.declarations && ts.isExportSpecifier(resolvedSymbol.declarations[0])) {
    if (ts.isExportSpecifier(symbol.declarations![0]!)) {
      const sourceFile = project.checker.getSymbolAtLocation(
        symbol.declarations![0].parent.parent.moduleSpecifier!,
      );
      const sourceFileDeclaration = sourceFile?.declarations?.find((el) =>
        ts.isSourceFile(el),
      ) as ts.SourceFile;
      const exports = project.checker.getExportsOfModule(
        project.checker.getSymbolAtLocation(sourceFileDeclaration)!,
      );
      resolvedSymbol = exports.find((el) => el.name === symbol.name)!;
    }
  }

  const declaration = resolvedSymbol.declarations![0];
  if (!ts.isInterfaceDeclaration(declaration) && !ts.isExportSpecifier(declaration)) {
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
    description: getSymbolDescription(resolvedSymbol, project),
    properties,
    tags: getSymbolJSDocTags(resolvedSymbol),
    project: project.name,
  };
};

function generateMarkdownFromProperties(
  object: ParsedObject,
  documentedInterfaces: DocumentedInterfaces,
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

  const projectImports = Array.from(projects.values())
    .map((project) => {
      const objectsInProject = objects.filter((object) => {
        // TODO: Remove after opening the apiRef on the community plan
        if (object.name === 'GridApi' && project.name === 'x-data-grid') {
          return false;
        }

        return !!project.exports[object.name];
      });

      if (objectsInProject.length === 0) {
        return null;
      }

      return `import {${objectsInProject.map((object) => object.name)}} from '@mui/${
        project.name
      }'`;
    })
    .filter((el): el is string => !!el);

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
  documentedInterfaces: DocumentedInterfaces,
) {
  const description = linkify(object.description, documentedInterfaces, 'html');
  const imports = generateImportStatement([object], projects);

  let text = `# ${object.name} Interface\n`;
  text += `<p class="description">${description}</p>\n\n`;
  text += '## Import\n\n';
  text += `${imports}\n\n`;
  text += '## Properties\n\n';
  text += `${generateMarkdownFromProperties(object, documentedInterfaces)}`;

  return text;
}

interface BuildInterfacesDocumentationOptions {
  projects: Projects;
  outputDirectory: string;
}

export default function buildInterfacesDocumentation(options: BuildInterfacesDocumentationOptions) {
  const { projects, outputDirectory } = options;

  const allProjectsName = Array.from(projects.keys());

  const documentedInterfaces: DocumentedInterfaces = new Map();
  INTERFACES_WITH_DEDICATED_PAGES.forEach((interfaceName) => {
    const packagesWithThisInterface = allProjectsName.filter(
      (projectName) => !!projects.get(projectName)!.exports[interfaceName],
    );

    if (packagesWithThisInterface.length === 0) {
      throw new Error(`Can't find symbol for ${interfaceName}`);
    }

    documentedInterfaces.set(interfaceName, packagesWithThisInterface);
  });

  const gridApiExtendsFrom: string[] = (
    (projects.get('x-data-grid-pro')!.exports.GridApi.declarations![0] as ts.InterfaceDeclaration)
      .heritageClauses ?? []
  ).flatMap((clause) =>
    clause.types
      .map((type) => type.expression)
      .filter(ts.isIdentifier)
      .map((expression) => expression.escapedText),
  );

  documentedInterfaces.forEach((packagesWithThisInterface, interfaceName) => {
    const project = projects.get(packagesWithThisInterface[0])!;
    const symbol = project.exports[interfaceName];
    const parsedInterface = parseInterfaceSymbol(symbol, project);

    if (!parsedInterface) {
      return;
    }

    const slug = kebabCase(parsedInterface.name);

    if (gridApiExtendsFrom.includes(parsedInterface.name)) {
      const json = {
        name: parsedInterface.name,
        description: linkify(parsedInterface.description, documentedInterfaces, 'html'),
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
    import MarkdownDocs from '@mui/monorepo/docs/src/modules/components/MarkdownDocs';
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
