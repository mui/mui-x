import type {
  Symbol,
  JSDocTagInfo,
  Type,
  InterfaceDeclaration,
  Node,
  TypeAliasDeclaration,
} from 'typescript';
import {
  createSourceFile,
  forEachChild,
  isConditionalTypeNode,
  isTypeAliasDeclaration,
  ScriptTarget,
  SymbolFlags,
  TypeFlags,
  TypeFormatFlags,
} from 'typescript';
import { EOL } from 'os';
import { kebabCase } from 'es-toolkit/string';
import path from 'path';
import { renderMarkdown } from '@mui/internal-markdown';
import type { DocumentedInterfaces } from './utils';
import {
  formatType,
  getSymbolDescription,
  getSymbolJSDocTags,
  linkify,
  stringifySymbol,
  writePrettifiedFile,
  resolveExportSpecifier,
  escapeCell,
} from './utils';
import type {
  XTypeScriptProjects,
  XTypeScriptProject,
  XProjectNames,
} from '../createXTypeScriptProjects';

interface ParsedObject {
  name: string;
  projects: XProjectNames[];
  description?: string;
  properties: ParsedProperty[];
  tags: { [tagName: string]: JSDocTagInfo };
}

interface ParsedProperty {
  name: string;
  description: string;
  tags: { [tagName: string]: JSDocTagInfo };
  required: boolean;
  typeStr: string;
  /**
   * Name of the projects on which the interface has this property
   */
  projects: XProjectNames[];
}

const MAX_DOCUMENTED_MEMBERS = 100;

/**
 * Returns the type to document, with generic aliases expanded over their union type parameters.
 * For example `AxisConfig` becomes `AxisConfig<'band', V, ChartsXAxisProps> | ...`.
 */
export const getDocumentedType = (symbol: Symbol, project: XTypeScriptProject): Type => {
  const { checker } = project;
  const declaredType = checker.getDeclaredTypeOfSymbol(symbol);
  const declaration = symbol.declarations?.find(isTypeAliasDeclaration);
  const typeParameters = declaration?.typeParameters ?? [];
  const distributed = typeParameters.flatMap((parameter) => {
    const constraint = checker.getBaseConstraintOfType(checker.getTypeAtLocation(parameter));
    return constraint?.isUnion()
      ? [{ name: parameter.name.text, size: constraint.types.length }]
      : [];
  });
  if (!declaration || distributed.length === 0) {
    return declaredType;
  }

  const memberCount = distributed.reduce((count, { size }) => count * size, 1);
  if (memberCount > MAX_DOCUMENTED_MEMBERS) {
    throw new Error(
      `Expanding "${declaration.name.text}" over its union type parameters gives ${memberCount} members, ` +
        `above the limit of ${MAX_DOCUMENTED_MEMBERS}. ` +
        'Narrow the type parameter constraints or document a specific instantiation instead.',
    );
  }

  // TS has no public API to instantiate a generic: evaluate a distributive conditional
  // inside the alias body so its type parameters resolve, then take its constraint.
  // For AxisConfig: `S extends any ? AxisProps extends any ? AxisConfig<S, V, AxisProps> : never : never`.
  const reference = `${declaration.name.text}<${typeParameters.map((parameter) => parameter.name.text).join(', ')}>`;
  const conditional = distributed.reduceRight(
    (body, { name }) => `${name} extends any ? ${body} : never`,
    reference,
  );
  const node = (
    createSourceFile('', `type T = ${conditional};`, ScriptTarget.Latest, true)
      .statements[0] as TypeAliasDeclaration
  ).type;
  (node as { parent: Node }).parent = declaration.type;
  return checker.getBaseConstraintOfType(checker.getTypeFromTypeNode(node)) ?? declaredType;
};

const getMembers = (type: Type) => (type.isUnion() ? type.types : [type]);

/**
 * Union members of `type` without `undefined`, keeping named aliases such as `NumberValue` whole.
 */
const getDefinedMembers = (type: Type, project: XTypeScriptProject) => {
  const members = getMembers(type).filter(
    (member) => member.flags !== TypeFlags.Undefined && member.flags !== TypeFlags.Never,
  );
  const definedType = project.checker.getNonNullableType(type);
  return definedType.aliasSymbol
    ? [definedType, ...members.filter((member) => member.flags === TypeFlags.Null)]
    : members;
};

const getPropertyMembers = (member: Type, name: string, project: XTypeScriptProject) => {
  const property = member.getProperty(name);
  return property ? getDefinedMembers(project.checker.getTypeOfSymbol(property), project) : [];
};

const getStringLiteral = (member: Type, name: string, project: XTypeScriptProject) => {
  const [type, ...others] = getPropertyMembers(member, name, project);
  return type?.isStringLiteral() && others.length === 0 ? type.value : undefined;
};

/**
 * Describes which union members have the property, for example "Only applies to `scaleType: 'band'`".
 * Returns an empty string when no exact description exists.
 */
export const getAvailability = (name: string, type: Type, project: XTypeScriptProject) => {
  const members = getMembers(type);
  const owners = members.filter((member) => getPropertyMembers(member, name, project).length > 0);
  if (owners.length === members.length) {
    return '';
  }

  const conditions = owners[0].getProperties().flatMap(({ name: discriminant }) => {
    const values = new Set(owners.map((owner) => getStringLiteral(owner, discriminant, project)));
    const isRestrictive =
      discriminant !== name &&
      !values.has(undefined) &&
      members.some((member) => !values.has(getStringLiteral(member, discriminant, project)));
    return isRestrictive ? [{ discriminant, values }] : [];
  });
  const isExact = members.every(
    (member) =>
      owners.includes(member) ===
      conditions.every(({ discriminant, values }) =>
        values.has(getStringLiteral(member, discriminant, project)),
      ),
  );
  if (conditions.length === 0 || !isExact) {
    return '';
  }

  const descriptions = conditions.map(({ discriminant, values }) => {
    const valuesStr = Array.from(values, (value) => `'${value}'`)
      .sort()
      .join(' | ');
    return `\`${discriminant}: ${valuesStr}\``;
  });
  return `Only applies to ${descriptions.join(' and ')}.`;
};

const hasConditionalType = (node: Node): boolean =>
  isConditionalTypeNode(node) || !!forEachChild(node, hasConditionalType);

export const stringifyProperty = async (symbols: Symbol[], project: XTypeScriptProject) => {
  const declarations = new Set(symbols.flatMap((symbol) => symbol.declarations ?? []));
  const [declaration] = declarations;
  if (declarations.size <= 1 && !(declaration && hasConditionalType(declaration))) {
    return stringifySymbol(symbols[0], project);
  }

  // The source text would only show one union member or an unresolved conditional type.
  // Constituents are sorted because the checker orders unions by creation order.
  const { checker } = project;
  const typeStrs = new Set(
    symbols
      .flatMap((symbol) => getDefinedMembers(checker.getTypeOfSymbol(symbol), project))
      .map((type) => checker.typeToString(type, undefined, TypeFormatFlags.NoTruncation)),
  );
  if (typeStrs.has('false') && typeStrs.has('true')) {
    typeStrs.delete('false');
    typeStrs.delete('true');
    typeStrs.add('boolean');
  }
  return formatType(
    Array.from(typeStrs, (typeStr) => `(${typeStr})`)
      .sort()
      .join(' | '),
  );
};

const parseProperty = async (
  name: string,
  type: Type,
  project: XTypeScriptProject,
): Promise<ParsedProperty> => {
  const commonProperty = type.getProperty(name);
  const symbols = commonProperty
    ? [commonProperty]
    : getMembers(type).flatMap((member) => member.getProperty(name) ?? []);

  return {
    name,
    description: [getSymbolDescription(symbols[0], project), getAvailability(name, type, project)]
      .filter(Boolean)
      .join('\n\n'),
    tags: getSymbolJSDocTags(symbols[0]),
    // eslint-disable-next-line no-bitwise
    required: !!commonProperty && !(commonProperty.flags & SymbolFlags.Optional),
    typeStr: await stringifyProperty(symbols, project),
    projects: [project.name],
  };
};

interface ProjectInterface {
  project: XTypeScriptProject;
  symbol: Symbol;
  type: Type;
  declaration: InterfaceDeclaration;
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
      const symbol = resolveExportSpecifier(exportedSymbol, project);
      const type = getDocumentedType(symbol, project);

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
    const propertyNames = new Set(
      getMembers(type).flatMap((member) => member.getProperties().map(({ name }) => name)),
    );

    for (const name of propertyNames) {
      if (properties[name]) {
        properties[name].projects.push(project.name);
      } else {
        // eslint-disable-next-line no-await-in-loop
        properties[name] = await parseProperty(name, type, project);
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

function extractDemos(tagInfo: JSDocTagInfo): { demos?: string } {
  if (!tagInfo || !tagInfo.text) {
    return {};
  }
  const demos = tagInfo.text
    .map(({ text }) => text.matchAll(/\[(.*)\]\((.*)\)/g).next().value)
    .map((match) => {
      if (match) {
        const [, text, url] = match;
        return `<li><a href="${url}">${text}</a></li>`;
      }
      return '';
    });

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

export interface InterfaceApiContent {
  /**
   * The name of the documented interface.
   */
  name: string;
  /**
   * The array of way to import this interface.
   */
  imports: string[];
  /**
   * The HTML content of the demonstrations list.
   */
  demos?: string;
  /**
   * The mapping of property name to their typing.
   */
  properties: {
    [property: string]: {
      /**
       * The initial type definition.
       */
      type: { description: string };
      default?: string;
      required?: true;
      isProPlan?: true;
      isPremiumPlan?: true;
    };
  };
}

export interface InterfaceApiTranslation {
  interfaceDescription: string;
  propertiesDescriptions: { [property: string]: { description: string } };
}
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

    const content: InterfaceApiContent = {
      name: parsedInterface.name,
      imports: generateImportStatement(parsedInterface, projects),
      ...extractDemos(parsedInterface.tags.demos),
      properties: {},
    };

    const translations: InterfaceApiTranslation = {
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
    );

    // eslint-disable-next-line no-await-in-loop
    await writePrettifiedFile(
      path.resolve(translationPagesDirectory, `${slug}.json`),
      JSON.stringify(translations),
    );

    // eslint-disable-next-line no-await-in-loop
    await writePrettifiedFile(
      path.resolve(apiPagesDirectory, `${slug}.js`),
      `import * as React from 'react';
import InterfaceApiPage from 'docs/src/modules/components/InterfaceApiPage';
import layoutConfig from 'docs/src/modules/utils/dataGridLayoutConfig';
import descriptions from '${importTranslationPagesDirectory}/${slug}.json';
import jsonPageContent from './${slug}.json';

export default function Page() {
  return <InterfaceApiPage {...layoutConfig} descriptions={descriptions} pageContent={jsonPageContent} />;
}
`.replace(/\r?\n/g, EOL),
    );

    // eslint-disable-next-line no-console
    console.log('Built API docs for', parsedInterface.name);
  }

  return documentedInterfaces;
}
