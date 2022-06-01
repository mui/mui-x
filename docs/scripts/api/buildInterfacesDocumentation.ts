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
  stringifySymbol,
  writePrettifiedFile,
  resolveExportSpecifier,
  DocumentedInterfaces,
} from './utils';
import { Projects, Project, ProjectNames } from '../getTypeScriptProjects';

interface ParsedObject {
  name: string;
  projects: ProjectNames[];
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
  projects: ProjectNames[];
}

const GRID_API_INTERFACES_WITH_DEDICATED_PAGES = [
  'GridSelectionApi',
  'GridFilterApi',
  'GridSortApi',
  'GridPaginationApi',
  'GridCsvExportApi',
  'GridScrollApi',
  'GridEditingApi',
  'GridOldEditingApi',
  'GridNewEditingApi',
  'GridRowGroupingApi',
  'GridColumnPinningApi',
  'GridDetailPanelApi',
  'GridPrintExportApi',
  'GridDisableVirtualizationApi',
  'GridExcelExportApi',
];

const OTHER_GRID_INTERFACES_WITH_DEDICATED_PAGES = [
  // apiRef
  'GridApi',

  // Params
  'GridCellParams',
  'GridRowParams',
  'GridRowClassNameParams',
  'GridRowSpacingParams',

  // Others
  'GridColDef',
  'GridCsvExportOptions',
  'GridPrintExportOptions',
  'GridExcelExportOptions',

  // Filters
  'GridFilterModel',
  'GridFilterItem',
  'GridFilterOperator',
];

const parseProperty = (propertySymbol: ts.Symbol, project: Project): ParsedProperty => ({
  name: propertySymbol.name,
  description: getSymbolDescription(propertySymbol, project),
  tags: getSymbolJSDocTags(propertySymbol),
  isOptional: !!propertySymbol.declarations?.find(ts.isPropertySignature)?.questionToken,
  typeStr: stringifySymbol(propertySymbol, project),
  projects: [project.name],
});

interface ProjectInterface {
  project: Project;
  symbol: ts.Symbol;
  type: ts.Type;
  declaration: ts.InterfaceDeclaration;
}

const parseInterfaceSymbol = (
  interfaceName: string,
  documentedInterfaces: DocumentedInterfaces,
  projects: Projects,
): ParsedObject | null => {
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
      const typeDeclaration = type.symbol.declarations?.[0];
      const symbol = resolveExportSpecifier(exportedSymbol, project);

      if (!typeDeclaration || !ts.isInterfaceDeclaration(typeDeclaration)) {
        return null;
      }

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
  projectInterfaces.forEach(({ type, project }) => {
    const propertiesOnProject = type.getProperties();

    propertiesOnProject.forEach((propertySymbol) => {
      if (properties[propertySymbol.name]) {
        properties[propertySymbol.name].projects.push(project.name);
      } else {
        properties[propertySymbol.name] = parseProperty(propertySymbol, project);
      }
    });
  });

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
        ' [<span class="plan-pro" title="Pro plan"></span>](https://mui.com/store/items/mui-x-pro/)';
    } else if (property.projects.includes('x-data-grid-premium')) {
      planImg =
        ' [<span class="plan-premium" title="Premium plan"></span>](https://mui.com/store/items/material-ui-premium/)';
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

function generateImportStatement(objects: ParsedObject[], projects: Projects) {
  let imports = '```js\n';

  const projectImports = Array.from(projects.values())
    .map((project) => {
      const objectsInProject = objects.filter((object) => {
        // TODO: Remove after opening the apiRef on the community plan
        if (
          ['GridApiCommunity', 'GridApi'].includes(object.name) &&
          project.name === 'x-data-grid'
        ) {
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
    .filter((el): el is string => !!el)
    // Display the imports from the pro packages above imports from the community packages
    .sort((a, b) => b.length - a.length);

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
  documentationRoot: string;
}

export default function buildInterfacesDocumentation(options: BuildInterfacesDocumentationOptions) {
  const { projects, documentationRoot } = options;

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

  documentedInterfaces.forEach((packagesWithThisInterface, interfaceName) => {
    const project = projects.get(packagesWithThisInterface[0])!;
    const parsedInterface = parseInterfaceSymbol(interfaceName, documentedInterfaces, projects);
    if (!parsedInterface) {
      return;
    }

    const slug = kebabCase(parsedInterface.name);

    if (GRID_API_INTERFACES_WITH_DEDICATED_PAGES.includes(parsedInterface.name)) {
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
        path.resolve(documentationRoot, project.documentationFolderName, `${slug}.json`),
        JSON.stringify(json),
        project,
      );
      // eslint-disable-next-line no-console
      console.log('Built JSON file for', parsedInterface.name);
    } else {
      const markdown = generateMarkdown(parsedInterface, projects, documentedInterfaces);
      writePrettifiedFile(
        path.resolve(documentationRoot, project.documentationFolderName, `${slug}.md`),
        markdown,
        project,
      );

      writePrettifiedFile(
        path.resolve(documentationRoot, project.documentationFolderName, `${slug}.js`),
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
