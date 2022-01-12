import * as ts from 'typescript';
import * as prettier from 'prettier';
import kebabCase from 'lodash/kebabCase';
import path from 'path';
import { renderInline as renderMarkdownInline } from '@mui/monorepo/docs/packages/markdown';
import {
  escapeCell,
  getSymbolDescription,
  getSymbolJSDocTags,
  linkifyComment,
  Project,
  Projects,
  stringifySymbol,
  writePrettifiedFile,
  DocumentedTypes,
  SymbolCommonFields,
  ParsedProperty,
  ParsedType,
  ParsedEnumMember,
  linkifyCode,
} from './utils';

const getSymbolCommonFields = (symbol: ts.Symbol, project: Project): SymbolCommonFields => ({
  name: symbol.name,
  description: getSymbolDescription(symbol, project),
  tags: getSymbolJSDocTags(symbol),
});

const parseProperty = (propertySymbol: ts.Symbol, project: Project): ParsedProperty => ({
  ...getSymbolCommonFields(propertySymbol, project),
  symbol: propertySymbol,
  isOptional: !!propertySymbol.declarations?.find(ts.isPropertySignature)?.questionToken,
  typeStr: stringifySymbol(propertySymbol, project),
});

/**
 * For export declarations (eg: `export type { XXX } from './modules`), we take the code and the comments from the resolved interface.
 * For type alias (eg: `export type XXX = YYY`), we take the code from the resolved interface and the comment from the root interface.
 */
const resolveTypeAliasOrExportDeclaration = (
  symbol: ts.Symbol,
  project: Project,
): ts.Symbol | null => {
  if (!symbol.declarations) {
    return null;
  }

  const declaration = symbol.declarations[0];

  if (ts.isExportSpecifier(declaration)) {
    const moduleSpecifier = declaration.parent.parent.moduleSpecifier;
    if (!moduleSpecifier) {
      // We don't support the format `const XXX = ''; export { XXX }` yet
      return null;
    }

    const sourceFile = project.checker.getSymbolAtLocation(moduleSpecifier);
    const sourceFileDeclaration = sourceFile?.declarations?.find((el) => ts.isSourceFile(el))!;
    const resolvedSymbol = project.checker.tryGetMemberInModuleExports(
      symbol.name,
      project.checker.getSymbolAtLocation(sourceFileDeclaration)!,
    );

    if (!resolvedSymbol) {
      return null;
    }

    return resolveTypeAliasOrExportDeclaration(resolvedSymbol, project);
  }

  return symbol;
};

const parseTypeSymbol = (rootSymbol: ts.Symbol, project: Project): ParsedType | null => {
  const symbol = resolveTypeAliasOrExportDeclaration(rootSymbol, project);
  if (!symbol) {
    return null;
  }

  const declaration = symbol.declarations?.[0];
  if (!declaration) {
    return null;
  }

  if (ts.isInterfaceDeclaration(declaration)) {
    const type = project.checker.getTypeAtLocation(declaration.name);

    const properties = type
      .getProperties()
      .map((property) => parseProperty(property, project))
      .filter((property) => !property.tags.ignore)
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      kind: 'interface',
      properties,
      ...getSymbolCommonFields(symbol, project),
    };
  }

  if (ts.isEnumDeclaration(declaration)) {
    const members: ParsedEnumMember[] = declaration.members.map((member) => {
      const memberSymbol = project.checker.getTypeAtLocation(member).symbol;

      return getSymbolCommonFields(memberSymbol, project);
    });

    return {
      kind: 'enum',
      members,
      ...getSymbolCommonFields(symbol, project),
    };
  }

  return null;
};

function generateMarkdownFromProperties(
  properties: ParsedProperty[],
  documentedTypes: DocumentedTypes,
) {
  const hasDefaultValue = properties.some((property) => {
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

  properties.forEach((property) => {
    const defaultValue = property.tags.default?.text?.[0].text;

    const formattedName = property.isOptional
      ? `<span class="prop-name optional">${property.name}<sup><abbr title="optional">?</abbr></sup></span>`
      : `<span class="prop-name">${property.name}</span>`;

    const formattedType = `<span class="prop-type">${escapeCell(
      linkifyCode(property.typeStr, documentedTypes, 'markdown'),
    )}</span>`;

    const formattedDefaultValue =
      defaultValue == null ? '' : `<span class="prop-default">${escapeCell(defaultValue)}</span>`;

    const formattedDescription = escapeCell(
      linkifyComment(property.description, documentedTypes, 'markdown'),
    );

    if (hasDefaultValue) {
      text += `| ${formattedName} | ${formattedType} | ${formattedDefaultValue} | ${formattedDescription} |\n`;
    } else {
      text += `| ${formattedName} | ${formattedType} | ${formattedDescription} |\n`;
    }
  });

  return text;
}

const generateMarkdownFromEnumMembers = (
  enumMembers: ParsedEnumMember[],
  documentedTypes: DocumentedTypes,
) => {
  let text = `
| Name | Description |
| ---- | ----------- |
`;

  enumMembers.forEach((member) => {
    const formattedName = `<span class="prop-name">${member.name}</span>`;

    const formattedDescription = escapeCell(
      linkifyComment(member.description, documentedTypes, 'markdown'),
    );

    text += `| ${formattedName} | ${formattedDescription} |\n`;
  });

  return text;
};

function generateImportStatement(objects: ParsedType[], projects: Projects) {
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
  parsedType: ParsedType,
  projects: Projects,
  documentedTypes: DocumentedTypes,
) {
  const description = linkifyComment(parsedType.description, documentedTypes, 'html');
  const imports = generateImportStatement([parsedType], projects);

  let text = `# ${parsedType.name} Interface\n`;
  text += `<p class="description">${description}</p>\n\n`;
  text += '## Import\n\n';
  text += `${imports}\n\n`;

  if (parsedType.kind === 'interface') {
    text += '## Properties\n\n';
    text += generateMarkdownFromProperties(parsedType.properties, documentedTypes);
  } else if (parsedType.kind === 'enum') {
    text += '## Members \n\n';
    text += generateMarkdownFromEnumMembers(parsedType.members, documentedTypes);
  }

  return text;
}

interface BuildInterfacesDocumentationOptions {
  projects: Projects;
  outputDirectory: string;
  workspaceRoot: string;
}

export default function buildInterfacesDocumentation(options: BuildInterfacesDocumentationOptions) {
  const { projects, outputDirectory, workspaceRoot } = options;

  const documentedTypes: DocumentedTypes = new Map();
  projects.forEach((project, projectName) => {
    Object.entries(project.exports).forEach(([exportName, exportSymbol]) => {
      if (documentedTypes.has(exportName)) {
        documentedTypes.get(exportName)!.projects.push(projectName);
      } else {
        if (exportName.endsWith('Props')) {
          // The prop interfaces are documented on the component page
          return;
        }

        const declaration = exportSymbol.declarations?.[0];
        if (!declaration) {
          return;
        }

        if (getSymbolJSDocTags(exportSymbol).ignore) {
          return;
        }

        // Documented in special pages
        if (['GridEvents', 'GridClasses', 'GridPanelClasses'].includes(exportName)) {
          return;
        }

        const parsedType = parseTypeSymbol(exportSymbol, project);
        if (!parsedType) {
          return;
        }

        documentedTypes.set(exportName, { parsedType, projects: [projectName] });
      }
    });
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

  const interfacePages: { pathname: string }[] = [];

  documentedTypes.forEach((documentedType) => {
    const { parsedType, projects: packagesWithThisInterface } = documentedType;
    const project = projects.get(packagesWithThisInterface[0])!;
    const slug = kebabCase(parsedType.name);

    if (parsedType.kind === 'interface' && gridApiExtendsFrom.includes(parsedType.name)) {
      const json = {
        name: parsedType.name,
        description: linkifyComment(parsedType.description, documentedTypes, 'html'),
        properties: parsedType.properties.map((property) => ({
          name: property.name,
          description: renderMarkdownInline(
            linkifyComment(property.description, documentedTypes, 'html'),
          ),
          type: linkifyCode(property.typeStr, documentedTypes, 'html'),
        })),
      };
      writePrettifiedFile(
        path.resolve(outputDirectory, `${slug}.json`),
        JSON.stringify(json),
        project,
      );
      // eslint-disable-next-line no-console
      console.log('Built JSON file for', parsedType.name);
    } else {
      const markdown = generateMarkdown(parsedType, projects, documentedTypes);
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

      // TODO: Stop hard-coding
      interfacePages.push({ pathname: `/api-docs/data-grid/${slug}` });

      // eslint-disable-next-line no-console
      console.log('Built API docs for', parsedType.name);
    }
  });

  // TODO: Stop hard-coding the project
  writePrettifiedFile(
    path.resolve(workspaceRoot, 'docs/src/pagesApi.json'),
    JSON.stringify(interfacePages.sort((a, b) => a.pathname.localeCompare(b.pathname))),
    projects.get('x-data-grid-pro')!,
  );

  return documentedTypes;
}
