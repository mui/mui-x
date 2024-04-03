import * as ts from 'typescript';
import { EOL } from 'os';
import kebabCase from 'lodash/kebabCase';
import path from 'path';
import { renderMarkdown } from '@mui/monorepo/packages/markdown';
import {
  getSymbolDescription,
  getSymbolJSDocTags,
  linkify,
  stringifySymbol,
  writePrettifiedFile,
  resolveExportSpecifier,
  DocumentedInterfaces,
  escapeCell,
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
  required: boolean;
  typeStr: string;
  /**
   * Name of the projects on which the interface has this property
   */
  projects: XProjectNames[];
}

const translationPagesDirectory = 'docs/translations/api-docs/data-grid';
const importTranslationPagesDirectory = 'docsx/translations/api-docs/data-grid';
const apiPagesDirectory = path.join(process.cwd(), `docs/pages/x/api/data-grid`);

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
  required: !propertySymbol.declarations?.find(ts.isPropertySignature)?.questionToken,
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

function getPlanLevel(property: ParsedProperty) {
  if (property.projects.includes('x-data-grid')) {
    return '';
  }
  if (property.projects.includes('x-data-grid-pro')) {
    return 'pro';
  }
  if (property.projects.includes('x-data-grid-premium')) {
    return 'premium';
  }
  throw new Error(`No valid plan found for ${property.name} property`);
}

function getDefaultValue(property: ParsedProperty) {
  const defaultValue = property.tags.default?.text?.[0].text;
  if (defaultValue === undefined) {
    return defaultValue;
  }
  return escapeCell(defaultValue);
}

function generateImportStatement(object: ParsedObject, projects: XTypeScriptProjects) {
  const projectImports = Array.from(projects.values())
    .map((project) => {
      if (!project.exports[object.name]) {
        return null;
      }

      return `import { ${object.name} } from '@mui/${project.name}'`;
    })
    .filter((el): el is string => !!el)
    // Display the imports from the pro packages above imports from the community packages
    .sort((a, b) => b.length - a.length);
  return projectImports;
}

function extractDemos(tagInfo: ts.JSDocTagInfo): { demos?: string } {
  if (!tagInfo || !tagInfo.text) {
    return {};
  }
  const demos = tagInfo.text
    .map(({ text }) => text.matchAll(/\[(.*)\]\((.*)\)/g).next().value)
    .map(([, text, url]) => `<li><a href="${url}">${text}</a></li>`);

  if (demos.length === 0) {
    return {};
  }

  return { demos: `<ul>${demos.join('\n')}</ul>` };
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
      const content = {
        name: parsedInterface.name,
        imports: generateImportStatement(parsedInterface, projects),
        ...extractDemos(parsedInterface.tags.demos),
        properties: {},
      };

      const translations = {
        interfaceDescription: renderMarkdown(
          linkify(escapeCell(parsedInterface.description || ''), documentedInterfaces, 'html'),
        ),
        propertiesDescriptions: {},
      };

      parsedInterface.properties
        .map((property) => ({
          name: property.name,
          description: renderMarkdown(
            linkify(escapeCell(property.description), documentedInterfaces, 'html'),
          ),
          type: { description: escapeCell(property.typeStr) },
          default: getDefaultValue(property),
          planLevel: getPlanLevel(property),
          required: property.required,
        }))
        .sort((a, b) => {
          if ((a.required && b.required) || (!a.required && !b.required)) {
            return a.name.localeCompare(b.name);
          }
          if (a.required) {
            return -1;
          }
          return 1;
        })
        .forEach(({ name, description, type, default: defaultValue, required, planLevel }) => {
          content.properties[name] = { type };
          if (defaultValue) {
            content.properties[name].default = defaultValue;
          }
          if (required) {
            content.properties[name].required = required;
          }
          if (planLevel === 'pro') {
            content.properties[name].isProPlan = true;
          }
          if (planLevel === 'premium') {
            content.properties[name].isPremiumPlan = true;
          }
          translations.propertiesDescriptions[name] = { description };
        });

      // eslint-disable-next-line no-await-in-loop
      await writePrettifiedFile(
        path.resolve(apiPagesDirectory, `${slug}.json`),
        JSON.stringify(content),
        project,
      );

      // eslint-disable-next-line no-await-in-loop
      await writePrettifiedFile(
        path.resolve(translationPagesDirectory, `${slug}.json`),
        JSON.stringify(translations),
        project,
      );

      // eslint-disable-next-line no-await-in-loop
      await writePrettifiedFile(
        path.resolve(apiPagesDirectory, `${slug}.js`),
        `import * as React from 'react';
    import InterfaceApiPage from 'docsx/src/modules/components/InterfaceApiPage';
    import layoutConfig from 'docsx/src/modules/utils/dataGridLayoutConfig';
    import mapApiPageTranslations from 'docs/src/modules/utils/mapApiPageTranslations';
    import jsonPageContent from './${slug}.json';
  
    export default function Page(props) {
      const { descriptions, pageContent } = props;
      return <InterfaceApiPage {...layoutConfig} descriptions={descriptions} pageContent={pageContent} />;
    }
    
    Page.getInitialProps = () => {
      const req = require.context(
        '${importTranslationPagesDirectory}/',
        false,
        /\\.\\/${slug}.*.json$/,
      );
      const descriptions = mapApiPageTranslations(req);
  
      return {
        descriptions,
        pageContent: jsonPageContent,
      };
    };
    `.replace(/\r?\n/g, EOL),
        project,
      );

      // eslint-disable-next-line no-console
      console.log('Built API docs for', parsedInterface.name);
    }
  }

  return documentedInterfaces;
}
