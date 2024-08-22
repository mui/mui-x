import * as ts from 'typescript';
import { EOL } from 'os';
import kebabCase from 'lodash/kebabCase';
import path from 'path';
import { renderMarkdown } from '@mui/internal-markdown';
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
  packagesWithThisInterface: XProjectNames[],
  projects: XTypeScriptProjects,
): Promise<ParsedObject | null> => {
  const projectInterfaces = packagesWithThisInterface
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
  for (const { type, project } of projectInterfaces) {
    const propertiesOnProject = type.getProperties();

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

const isPro = (project: string) => project.includes('-pro');
const isPremium = (project: string) => project.includes('-premium');

function getPlanLevel(property: ParsedProperty) {
  if (property.projects.some((project) => !isPro(project) && !isPremium(project))) {
    return '';
  }
  if (property.projects.some(isPro)) {
    return 'pro';
  }
  if (property.projects.some(isPremium)) {
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

interface BuildInterfacesCommonOptions {
  projects: XTypeScriptProjects;
  folder: string;
  /**
   * An array of the interfaces to process.
   */
  interfaces: string[];
}

type BuildApiInterfacesJsonOptions = BuildInterfacesCommonOptions & {
  apiPagesFolder: string;
  interfacesWithDedicatedPage: DocumentedInterfaces;
};

export async function buildApiInterfacesJson(options: BuildApiInterfacesJsonOptions) {
  const { projects, apiPagesFolder, folder, interfaces, interfacesWithDedicatedPage } = options;

  const allProjectsName = Array.from(projects.keys());

  await Promise.all(
    interfaces.map(async (interfaceName) => {
      const packagesWithThisInterface = allProjectsName.filter(
        (projectName) => !!projects.get(projectName)!.exports[interfaceName],
      );

      if (packagesWithThisInterface.length === 0) {
        throw new Error(`Can't find symbol for ${interfaceName}`);
      }

      const project = projects.get(packagesWithThisInterface[0])!;
      const parsedInterface = await parseInterfaceSymbol(
        interfaceName,
        packagesWithThisInterface,
        projects,
      );
      if (!parsedInterface) {
        return;
      }

      const slug = kebabCase(parsedInterface.name);

      const json = {
        name: parsedInterface.name,
        description: linkify(
          parsedInterface.description,
          interfacesWithDedicatedPage,
          'html',
          folder,
        ),
        properties: parsedInterface.properties.map((property) => ({
          name: property.name,
          description: renderMarkdown(
            linkify(property.description, interfacesWithDedicatedPage, 'html', folder),
          ),
          type: property.typeStr,
        })),
      };
      await writePrettifiedFile(
        path.resolve(apiPagesFolder, project.documentationFolderName, `${slug}.json`),
        JSON.stringify(json),
        project,
      );
      // eslint-disable-next-line no-console
      console.log('Built JSON file for', parsedInterface.name);
    }),
  );
}

type BuildInterfacesDocumentationPageOptions = BuildInterfacesCommonOptions & {
  apiPagesDirectory: string;
  translationPagesDirectory: string;
  importTranslationPagesDirectory: string;
};

export async function buildInterfacesDocumentationPage(
  options: BuildInterfacesDocumentationPageOptions,
) {
  const {
    projects,
    apiPagesDirectory,
    translationPagesDirectory,
    importTranslationPagesDirectory,
    folder,
    interfaces,
  } = options;

  const allProjectsName = Array.from(projects.keys());

  const documentedInterfaces: DocumentedInterfaces = new Map();

  interfaces.forEach((interfaceName) => {
    const packagesWithThisInterface = allProjectsName.filter(
      (projectName) => !!projects.get(projectName)!.exports[interfaceName],
    );

    if (packagesWithThisInterface.length === 0) {
      throw new Error(`Can't find symbol for ${interfaceName}`);
    }

    documentedInterfaces.set(interfaceName, packagesWithThisInterface);
  });

  for (const [interfaceName, packagesWithThisInterface] of Array.from(
    documentedInterfaces.entries(),
  )) {
    const project = projects.get(packagesWithThisInterface[0])!;
    // eslint-disable-next-line no-await-in-loop
    const parsedInterface = await parseInterfaceSymbol(
      interfaceName,
      packagesWithThisInterface,
      projects,
    );
    if (!parsedInterface) {
      continue;
    }

    const slug = kebabCase(parsedInterface.name);

    const content = {
      name: parsedInterface.name,
      imports: generateImportStatement(parsedInterface, projects),
      ...extractDemos(parsedInterface.tags.demos),
      properties: {},
    };

    const translations = {
      interfaceDescription: renderMarkdown(
        linkify(
          escapeCell(parsedInterface.description || ''),
          documentedInterfaces,
          'html',
          folder,
        ),
      ),
      propertiesDescriptions: {},
    };

    parsedInterface.properties
      .map((property) => ({
        name: property.name,
        description: renderMarkdown(
          linkify(escapeCell(property.description), documentedInterfaces, 'html', folder),
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

  return documentedInterfaces;
}
