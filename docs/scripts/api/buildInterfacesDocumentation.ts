import * as ts from 'typescript';
import * as prettier from 'prettier';
import kebabCase from 'lodash/kebabCase';
import path from 'path';
import { renderMarkdown } from '@mui/monorepo/packages/markdown';
import {
  escapeCell,
  getSymbolDescription,
  getSymbolJSDocTags,
  linkify,
  stringifySymbol,
  writePrettifiedFile,
  resolveExportSpecifier,
  DocumentedInterfaces,
} from './utils';
import {
  XTypeScriptProjects,
  XTypeScriptProject,
  XProjectNames,
} from '../createXTypeScriptProjects';

interface ParsedObject {
  name: string;
  projects: XProjectNames[];
  description?: string;
  properties: ParsedProperty[];
  tags: { [tagName: string]: ts.JSDocTagInfo };
}

interface ParsedProperty {
  name: string;
  description: string;
  tags: { [tagName: string]: ts.JSDocTagInfo };
  isOptional: boolean;
  typeStr: string;
  /**
   * Name of the projects on which the interface has this property
   */
  projects: XProjectNames[];
}

const GRID_API_INTERFACES_WITH_DEDICATED_PAGES = [
  'GridCellSelectionApi',
  'GridColumnPinningApi',
  'GridColumnResizeApi',
  'GridCsvExportApi',
  'GridDetailPanelApi',
  'GridEditingApi',
  'GridExcelExportApi',
  'GridFilterApi',
  'GridPaginationApi',
  'GridPrintExportApi',
  'GridRowGroupingApi',
  'GridRowMultiSelectionApi',
  'GridRowSelectionApi',
  'GridScrollApi',
  'GridSortApi',
  'GridVirtualizationApi',
];

const OTHER_GRID_INTERFACES_WITH_DEDICATED_PAGES = [
  // apiRef
  'GridApi',

  // Params
  'GridCellParams',
  'GridRowParams',
  'GridRowClassNameParams',
  'GridRowSpacingParams',
  'GridExportStateParams',

  // Others
  'GridColDef',
  'GridSingleSelectColDef',
  'GridActionsColDef',
  'GridCsvExportOptions',
  'GridPrintExportOptions',
  'GridExcelExportOptions',

  // Filters
  'GridFilterModel',
  'GridFilterItem',
  'GridFilterOperator',

  // Aggregation
  'GridAggregationFunction',
];

const parseProperty = async (
  propertySymbol: ts.Symbol,
  project: XTypeScriptProject,
): Promise<ParsedProperty> => ({
  name: propertySymbol.name,
  description: getSymbolDescription(propertySymbol, project),
  tags: getSymbolJSDocTags(propertySymbol),
  isOptional: !!propertySymbol.declarations?.find(ts.isPropertySignature)?.questionToken,
  typeStr: await stringifySymbol(propertySymbol, project),
  projects: [project.name],
});

interface ProjectInterface {
  project: XTypeScriptProject;
  symbol: ts.Symbol;
  type: ts.Type;
  declaration: ts.InterfaceDeclaration;
}

const parseInterfaceSymbol = async (
  interfaceName: string,
  documentedInterfaces: DocumentedInterfaces,
  projects: XTypeScriptProjects,
): Promise<ParsedObject | null> => {
  const projectInterfaces = documentedInterfaces
    .get(interfaceName)!
    .map((projectName) => {
      const project = projects.get(projectName)!;

      const declaration = project.exports[interfaceName].declarations?.[0];
      if (!declaration) {
        return null;
      }

      const exportedSymbol = project.exports[interfaceName];
      const type = project.checker.getDeclaredTypeOfSymbol(exportedSymbol);
      const symbol = resolveExportSpecifier(exportedSymbol, project);

      return {
        symbol,
        project,
        type,
        declaration,
      };
    })
    .filter((projectInterface): projectInterface is ProjectInterface => !!projectInterface);

  if (projectInterfaces.length === 0) {
    return null;
  }

  const defaultProjectInterface = projectInterfaces[0];

  const parsedInterface: ParsedObject = {
    name: defaultProjectInterface.symbol.name,
    description: getSymbolDescription(
      defaultProjectInterface.symbol,
      defaultProjectInterface.project,
    ),
    properties: [],
    tags: getSymbolJSDocTags(defaultProjectInterface.symbol),
    projects: projectInterfaces.map((projectInterface) => projectInterface.project.name),
  };

  const properties: Record<string, ParsedProperty> = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const { type, project } of projectInterfaces) {
    const propertiesOnProject = type.getProperties();

    // eslint-disable-next-line no-restricted-syntax
    for (const propertySymbol of propertiesOnProject) {
      if (properties[propertySymbol.name]) {
        properties[propertySymbol.name].projects.push(project.name);
      } else {
        // eslint-disable-next-line no-await-in-loop
        properties[propertySymbol.name] = await parseProperty(propertySymbol, project);
      }
    }
  }

  parsedInterface.properties = Object.values(properties)
    .filter((property) => !property.tags.ignore)
    .sort((a, b) => a.name.localeCompare(b.name));

  return parsedInterface;
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

    let planImg: string;
    if (property.projects.includes('x-data-grid')) {
      planImg = '';
    } else if (property.projects.includes('x-data-grid-pro')) {
      planImg =
        ' [<span class="plan-pro" title="Pro plan"></span>](/x/introduction/licensing/#pro-plan)';
    } else if (property.projects.includes('x-data-grid-premium')) {
      planImg =
        ' [<span class="plan-premium" title="Premium plan"></span>](/x/introduction/licensing/#premium-plan)';
    } else {
      throw new Error(`No valid plan found for ${property.name} property in ${object.name}`);
    }

    const formattedName = property.isOptional
      ? `<span class="prop-name optional">${property.name}<sup><abbr title="optional">?</abbr></sup>${planImg}</span>`
      : `<span class="prop-name">${property.name}${planImg}</span>`;

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

async function generateImportStatement(objects: ParsedObject[], projects: XTypeScriptProjects) {
  let imports = '```js\n';

  const projectImports = Array.from(projects.values())
    .map((project) => {
      const objectsInProject = objects.filter((object) => {
        return !!project.exports[object.name];
      });

      if (objectsInProject.length === 0) {
        return null;
      }

      return `import {${objectsInProject.map((object) => object.name)}} from '@mui/${
        project.name
      }'`;
    })
    .filter((el): el is string => !!el)
    // Display the imports from the pro packages above imports from the community packages
    .sort((a, b) => b.length - a.length);

  imports += await prettier.format(projectImports.join('\n// or\n'), {
    singleQuote: true,
    semi: false,
    trailingComma: 'none',
    parser: 'typescript',
  });
  imports += '\n```';

  return imports;
}

async function generateMarkdown(
  object: ParsedObject,
  projects: XTypeScriptProjects,
  documentedInterfaces: DocumentedInterfaces,
) {
  const demos = object.tags.demos;
  const description = linkify(object.description, documentedInterfaces, 'html');
  const imports = await generateImportStatement([object], projects);

  let text = `# ${object.name} Interface\n`;
  text += `<p class="description">${description}</p>\n\n`;

  if (demos && demos.text && demos.text.length > 0) {
    text += '## Demos\n\n';
    text += ':::info\n';
    text += 'For examples and details on the usage, check the following pages:\n\n';
    demos.text.forEach((demoLink) => {
      text += demoLink.text;
    });
    text += '\n\n:::\n\n';
  }

  text += '## Import\n\n';
  text += `${imports}\n\n`;
  text += '## Properties\n\n';
  text += `${generateMarkdownFromProperties(object, documentedInterfaces)}`;

  return text;
}

interface BuildInterfacesDocumentationOptions {
  projects: XTypeScriptProjects;
  apiPagesFolder: string;
}

export default async function buildInterfacesDocumentation(
  options: BuildInterfacesDocumentationOptions,
) {
  const { projects, apiPagesFolder } = options;

  const allProjectsName = Array.from(projects.keys());

  const documentedInterfaces: DocumentedInterfaces = new Map();
  [
    ...OTHER_GRID_INTERFACES_WITH_DEDICATED_PAGES,
    ...GRID_API_INTERFACES_WITH_DEDICATED_PAGES,
  ].forEach((interfaceName) => {
    const packagesWithThisInterface = allProjectsName.filter(
      (projectName) => !!projects.get(projectName)!.exports[interfaceName],
    );

    if (packagesWithThisInterface.length === 0) {
      throw new Error(`Can't find symbol for ${interfaceName}`);
    }

    documentedInterfaces.set(interfaceName, packagesWithThisInterface);
  });

  // eslint-disable-next-line no-restricted-syntax
  for (const [interfaceName, packagesWithThisInterface] of Array.from(
    documentedInterfaces.entries(),
  )) {
    const project = projects.get(packagesWithThisInterface[0])!;
    // eslint-disable-next-line no-await-in-loop
    const parsedInterface = await parseInterfaceSymbol(
      interfaceName,
      documentedInterfaces,
      projects,
    );
    if (!parsedInterface) {
      continue;
    }

    const slug = kebabCase(parsedInterface.name);

    if (GRID_API_INTERFACES_WITH_DEDICATED_PAGES.includes(parsedInterface.name)) {
      const json = {
        name: parsedInterface.name,
        description: linkify(parsedInterface.description, documentedInterfaces, 'html'),
        properties: parsedInterface.properties.map((property) => ({
          name: property.name,
          description: renderMarkdown(linkify(property.description, documentedInterfaces, 'html')),
          type: property.typeStr,
        })),
      };
      // eslint-disable-next-line no-await-in-loop
      await writePrettifiedFile(
        path.resolve(apiPagesFolder, project.documentationFolderName, `${slug}.json`),
        JSON.stringify(json),
        project,
      );
      // eslint-disable-next-line no-console
      console.log('Built JSON file for', parsedInterface.name);
    } else {
      // eslint-disable-next-line no-await-in-loop
      const markdown = await generateMarkdown(parsedInterface, projects, documentedInterfaces);
      // eslint-disable-next-line no-await-in-loop
      await writePrettifiedFile(
        path.resolve(apiPagesFolder, project.documentationFolderName, `${slug}.md`),
        markdown,
        project,
      );

      // eslint-disable-next-line no-await-in-loop
      await writePrettifiedFile(
        path.resolve(apiPagesFolder, project.documentationFolderName, `${slug}.js`),
        `import * as React from 'react';
    import MarkdownDocs from '@mui/monorepo/docs/src/modules/components/MarkdownDocs';
    import * as pageProps from './${slug}.md?@mui/markdown';

    export default function Page() {
      return <MarkdownDocs {...pageProps} />;
    }
        `,
        project,
      );

      // eslint-disable-next-line no-console
      console.log('Built API docs for', parsedInterface.name);
    }
  }

  return documentedInterfaces;
}
