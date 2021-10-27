import * as yargs from 'yargs';
import * as TypeDoc from 'typedoc';
import * as fse from 'fs-extra';
import path from 'path';
import kebabCase from 'lodash/kebabCase';
import fromPairs from 'lodash/fromPairs';
import { parse as parseDoctrine, Annotation } from 'doctrine';
import { defaultHandlers, parse as docgenParse, ReactDocgenApi } from 'react-docgen';
import * as prettier from 'prettier';
import { findPagesMarkdown } from 'docs/src/modules/utils/find';
import { LANGUAGES } from 'docs/src/modules/constants';
import * as ttp from '@material-ui/monorepo/packages/typescript-to-proptypes/src';
import createGenerateClassName from '@mui/styles/createGenerateClassName';
import createDescribeableProp, {
  DescribeablePropDescriptor,
} from '@material-ui/monorepo/docs/src/modules/utils/createDescribeableProp';
import generatePropDescription from '@material-ui/monorepo/docs/src/modules/utils/generatePropDescription';
import generatePropTypeDescription, {
  getChained,
} from '@material-ui/monorepo/docs/src/modules/utils/generatePropTypeDescription';
import parseStyles, { Styles } from '@material-ui/monorepo/docs/src/modules/utils/parseStyles';
import { getLineFeed } from '@material-ui/monorepo/docs/scripts/helpers';
import {
  renderInline as renderMarkdownInline,
  getHeaders,
} from '@material-ui/monorepo/docs/packages/markdown';

const generateClassName = createGenerateClassName();

const apiDocsTranslationsDirectory = path.resolve('docs', 'translations', 'api-docs', 'data-grid');

interface Api {
  name: string;
  description?: string;
  properties: TypeDoc.DeclarationReflection[];
}

interface ReactApi extends ReactDocgenApi {
  /**
   * list of page pathnames
   * @example ['/components/Accordion']
   */
  demos: [string, string][];
  EOL: string;
  filename: string;
  forwardsRefTo: string | undefined;
  inheritance: { component: string; pathname: string } | null;
  name: string;
  spread: boolean | undefined;
  src: string;
  styles: Styles;
  displayName: string;
  slots: Record<string, { default: string | undefined; type: { name: string | undefined } }>;
}

const isUnionType = (type: TypeDoc.Type): type is TypeDoc.UnionType => type.type === 'union';

const isIntrinsicType = (type: TypeDoc.Type): type is TypeDoc.IntrinsicType =>
  type.type === 'intrinsic';

const isLiteralType = (type: TypeDoc.Type): type is TypeDoc.LiteralType => type.type === 'literal';

const isArrayType = (type: TypeDoc.Type): type is TypeDoc.ArrayType => type.type === 'array';

const isReflectionType = (type: TypeDoc.Type): type is TypeDoc.ReflectionType =>
  type.type === 'reflection';

const isReferenceType = (type: TypeDoc.Type): type is TypeDoc.ReferenceType =>
  type.type === 'reference';

const isIndexedAccessType = (type: TypeDoc.Type): type is TypeDoc.IndexedAccessType =>
  type.type === 'indexedAccess';

const isTypeOperatorType = (type: TypeDoc.Type): type is TypeDoc.TypeOperatorType =>
  type.type === 'typeOperator';

// Based on https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/type.hbs
function generateTypeStr(type: TypeDoc.Type, needsParenthesis = false): string {
  if (isUnionType(type)) {
    let text = needsParenthesis ? '(' : '';
    text += type.types.map((childType) => generateTypeStr(childType, true)).join(' | ');
    return needsParenthesis ? `${text})` : text;
  }
  if (isIntrinsicType(type)) {
    return type.name;
  }
  if (isLiteralType(type)) {
    return `${type.value}`;
  }
  if (isArrayType(type)) {
    return `${generateTypeStr(type.elementType, true)}[]`;
  }
  if (isReflectionType(type)) {
    if (type.declaration.signatures && type.declaration.signatures.length === 1) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return generateSignatureStr(type.declaration.signatures[0], needsParenthesis);
    }
    if (type.declaration.children) {
      let text = '{ ';
      text += type.declaration.children
        .map((child) => {
          let memberText = child.name;
          if (child.flags.isOptional) {
            memberText += '?';
          }
          return `${memberText}: ${child.type ? generateTypeStr(child.type) : 'any'}`;
        })
        .join('; ');
      text += ' }';
      return text;
    }

    const param = type.declaration.indexSignature?.parameters?.[0];
    const indexSignatureType = type.declaration.indexSignature?.type;

    if (param) {
      const paramName = param.name;
      const paramType = param.type ? generateTypeStr(param.type) : 'any';
      const valueType = indexSignatureType ? generateTypeStr(indexSignatureType) : 'any';
      return `{ [${paramName}: ${paramType}]: ${valueType} }`;
    }

    return '';
  }
  if (isReferenceType(type)) {
    let text = type.name;
    if (type.typeArguments) {
      text += `<`;
      text += type.typeArguments.map((arg) => generateTypeStr(arg)).join(', ');
      text += `>`;
    }
    return text;
  }
  if (isIndexedAccessType(type)) {
    return `${generateTypeStr(type.objectType)}[${generateTypeStr(type.indexType)}]`;
  }
  if (isTypeOperatorType(type)) {
    return `${type.operator} ${generateTypeStr(type.target)}`;
  }

  return '';
}

function generateSignatureStr(signature: TypeDoc.SignatureReflection, needsParenthesis = false) {
  let text = needsParenthesis ? '(' : '';
  if (signature.typeParameters?.length) {
    // Handle function generic parameters
    text += '<';
    text += signature.typeParameters
      .map((generic) => {
        let genericLine = generic.name;
        if (generic.type) {
          genericLine += ` extends ${generateTypeStr(generic.type)}`;
        }
        if (generic.default) {
          genericLine += ` = ${generateTypeStr(generic.default)}`;
        }
        return genericLine;
      })
      .join(', ');
    text += '>';
  }
  text += '(';
  text += signature
    .parameters!.map((param) => {
      let paramText = param.flags.isRest ? `...${param.name}` : param.name;
      if (param.flags.isOptional) {
        paramText += '?';
      }
      if (param.defaultValue) {
        paramText += '?';
      }
      if (param.type) {
        paramText += `: ${generateTypeStr(param.type)}`;
      } else {
        paramText += ': any';
      }

      return paramText;
    })
    .join(', ');
  text += ')';
  if (signature.type) {
    text += ` => ${generateTypeStr(signature.type)}`;
  }
  return needsParenthesis ? `${text})` : text;
}

function escapeCell(value: string) {
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, '<br />');
}

function linkify(text: string | undefined, apisToGenerate: string[], format: 'markdown' | 'html') {
  if (text == null) {
    return '';
  }

  const bracketsRegexp = /\[\[([^\]]+)\]\]/g;
  return text.replace(bracketsRegexp, (match: string, content: string) => {
    if (!apisToGenerate.includes(content)) {
      return content;
    }
    const url = `/api/data-grid/${kebabCase(content)}/`;
    return format === 'markdown' ? `[${content}](${url})` : `<a href="${url}">${content}</a>`;
  });
}

function generateProperties(api: Api, apisToGenerate: string[]) {
  const hasDefaultValue = api.properties.reduce((acc, propertyReflection) => {
    return acc || !!propertyReflection.comment?.hasTag('default');
  }, false);

  const headers = hasDefaultValue
    ? `
| Name | Type | Default | Description |
|:-----|:-----|:--------|:------------|`
    : `
| Name | Type | Description |
|:-----|:-----|:------------|`;

  let text = `## Properties\n\n${headers}\n`;

  api.properties.forEach((propertyReflection) => {
    let name = propertyReflection.name;
    const type = propertyReflection!.type;
    const signature = propertyReflection.signatures ? propertyReflection.signatures[0] : null;
    const comment = signature?.comment || propertyReflection.comment;
    const description = linkify(comment?.shortText, apisToGenerate, 'markdown');

    if (propertyReflection.flags.isOptional) {
      name = `<span class="prop-name optional">${name}<sup><abbr title="optional">?</abbr></sup></span>`;
    } else {
      name = `<span class="prop-name">${name}</span>`;
    }

    let defaultValue = '';
    const defaultTag = comment && comment.getTag('default');
    if (defaultTag) {
      defaultValue = `<span class="prop-default">${escapeCell(defaultTag.text)}</span>`;
    }

    let typeFormatted = '<span class="prop-type">';
    if (signature) {
      typeFormatted += escapeCell(generateSignatureStr(signature));
    } else if (type) {
      typeFormatted += escapeCell(generateTypeStr(type));
    }
    typeFormatted += '</span>';

    if (hasDefaultValue) {
      text += `| ${name} | ${typeFormatted} | ${defaultValue} | ${escapeCell(description)} |\n`;
    } else {
      text += `| ${name} | ${typeFormatted} | ${escapeCell(description)} |\n`;
    }
  });

  return text;
}

function generateImportStatement(api: Api) {
  // TODO: Check if interface was exported
  if (api.name === 'GridApi') {
    return `\`\`\`js
import { ${api.name} } from '@mui/x-data-grid-pro';
\`\`\``;
  }

  return `\`\`\`js
import { ${api.name} } from '@mui/x-data-grid-pro';
// or
import { ${api.name} } from '@mui/x-data-grid';
\`\`\``;
}

function generateMarkdown(api: Api, apisToGenerate: string[]) {
  return [
    `# ${api.name} Interface`,
    '',
    `<p class="description">${linkify(api.description, apisToGenerate, 'html')}</p>`,
    '',
    '## Import',
    '',
    generateImportStatement(api),
    '',
    generateProperties(api, apisToGenerate),
  ].join('\n');
}

function writePrettifiedFile(filename: string, data: string, prettierConfigPath: string) {
  const prettierConfig = prettier.resolveConfig.sync(filename, {
    config: prettierConfigPath,
  });
  if (prettierConfig === null) {
    throw new Error(
      `Could not resolve config for '${filename}' using prettier config path '${prettierConfigPath}'.`,
    );
  }

  fse.writeFileSync(filename, prettier.format(data, { ...prettierConfig, filepath: filename }), {
    encoding: 'utf8',
  });
}

function findProperties(reflection: TypeDoc.DeclarationReflection) {
  const properties = reflection.children!.filter((child) =>
    child.kindOf([TypeDoc.ReflectionKind.Property, TypeDoc.ReflectionKind.Method]),
  );
  return properties.sort((a, b) => a.name.localeCompare(b.name));
}

function extractEvents(eventsObject: TypeDoc.DeclarationReflection, apisToGenerate) {
  const events: { name: string; description: string }[] = [];
  const allEvents = eventsObject.children!;

  allEvents.forEach((event) => {
    const description = linkify(event.comment?.shortText, apisToGenerate, 'html');

    events.push({
      name: event.escapedName!,
      description: renderMarkdownInline(description),
    });
  });

  return events.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Substitute CSS class description conditions with placeholder
 */
function extractClassConditions(descriptions: any) {
  const classConditions: {
    [key: string]: { description: string; conditions?: string; nodeName?: string };
  } = {};
  const stylesRegex =
    /((Styles|State class|Class name) applied to )(.*?)(( if | unless | when |, ){1}(.*))?\./;

  Object.entries(descriptions).forEach(([className, description]: any) => {
    if (className) {
      const conditions = description.match(stylesRegex);

      if (conditions && conditions[6]) {
        classConditions[className] = {
          description: description.replace(stylesRegex, '$1{{nodeName}}$5{{conditions}}.'),
          nodeName: conditions[3],
          conditions: conditions[6].replace(/`(.*?)`/g, '<code>$1</code>'),
        };
      } else if (conditions && conditions[3] && conditions[3] !== 'the root element') {
        classConditions[className] = {
          description: description.replace(stylesRegex, '$1{{nodeName}}$5.'),
          nodeName: conditions[3],
        };
      } else {
        classConditions[className] = { description };
      }
    }
  });
  return classConditions;
}

/**
 * Generate list of component demos
 */
function generateDemoList(demos: [string, string][]): string {
  return `<ul>${demos
    .map(([demoPathname, demoName]) => `<li><a href="${demoPathname}">${demoName}</a></li>`)
    .join('\n')}</ul>`;
}

/**
 * @param filepath - absolute path
 * @example toGithubPath('/home/user/material-ui/packages/Accordion') === '/packages/Accordion'
 * @example toGithubPath('C:\\Development\material-ui\packages\Accordion') === '/packages/Accordion'
 */
function toGithubPath(filepath: string, workspaceRoot: string): string {
  return `/${path.relative(workspaceRoot, filepath).replace(/\\/g, '/')}`;
}

function parseComponentSource(src: string, componentObject: { filename: string }): ReactApi {
  const reactAPI: ReactApi = docgenParse(src, null, defaultHandlers, {
    filename: componentObject.filename,
  });

  const fullDescription = reactAPI.description;
  // Ignore what we might have generated in `annotateComponentDefinition`
  const annotatedDescriptionMatch = fullDescription.match(/(Demos|API):\r?\n\r?\n/);
  if (annotatedDescriptionMatch !== null) {
    reactAPI.description = fullDescription.slice(0, annotatedDescriptionMatch.index).trim();
  }

  return reactAPI;
}

function getJsdocDefaultValue(jsdoc: Annotation) {
  const defaultTag = jsdoc.tags.find((tag) => tag.title === 'default');
  if (defaultTag === undefined) {
    return undefined;
  }
  return defaultTag.description || '';
}

function extractSlots(options: {
  filename: string;
  name: string;
  displayName: string;
  program: ttp.Program;
}) {
  const { filename, name: componentName, displayName, program } = options;
  const slots: Record<string, { type: string; default?: string; description: string }> = {};

  const proptypes = ttp.parseFromProgram(filename, program, {
    shouldResolveObject: ({ name }) => {
      return name === 'components';
    },
    shouldInclude: ({ name, depth }) => {
      // The keys allowed in the `components` prop have depth=2
      return name === 'components' || depth === 2;
    },
  });

  const props = proptypes.body.find((prop) => prop.name === displayName);
  if (!props) {
    throw new Error(`No proptypes found for \`${displayName}\``);
  }

  const componentsProps = props.types.find((type) => type.name === 'components')!;
  if (!componentsProps) {
    return slots;
  }

  const propType = componentsProps.propType as ttp.UnionType;
  const propInterface = propType.types.find((type) => type.type === 'InterfaceNode');
  if (!propInterface) {
    throw new Error(`The \`components\` prop in \`${componentName}\` is not an interface.`);
  }

  const types = (propInterface as ttp.InterfaceType).types;
  types.forEach(([name, prop]) => {
    const parsed = parseDoctrine(prop.jsDoc || '', { sloppy: true });
    const description = renderMarkdownInline(parsed.description);
    const defaultValue = getJsdocDefaultValue(parsed);

    let type: string | undefined;
    if (prop.type === 'ElementNode') {
      // React.JSXElementConstructor<any>
      type = prop.elementType;
    } else if (prop.type === 'UnionNode') {
      // React.JSXElementConstructor<any> | null
      const doesAcceptNull = prop.types.find((t) => (t as any).value === 'null');
      // The value must be hardcoded because it loses React.JSXElementConstructor
      type = doesAcceptNull ? 'elementType | null' : 'elementType';
    }

    if (!type) {
      return;
    }

    slots[name] = {
      type,
      description,
      default: defaultValue,
    };
  });

  return slots;
}

async function buildDocs(options: {
  filename: string;
  program: ttp.ts.Program;
  outputDirectory: string;
  prettierConfigPath: string;
  workspaceRoot: string;
  apisToGenerate: string[];
  pagesMarkdown: ReadonlyArray<{
    components: readonly string[];
    filename: string;
    pathname: string;
  }>;
}) {
  const { filename, program, outputDirectory, prettierConfigPath, workspaceRoot, apisToGenerate } =
    options;

  const src = fse.readFileSync(filename, 'utf8');
  const reactApi = parseComponentSource(src, { filename });
  reactApi.filename = filename; // Some components don't have props
  reactApi.name = path.parse(filename).name;
  reactApi.EOL = getLineFeed(src);
  reactApi.slots = {};

  const demos: ReactApi['demos'] = [];
  if (reactApi.name === 'DataGrid' || reactApi.name.startsWith('Grid')) {
    demos.push(['/components/data-grid#mit-version', 'DataGrid']);
  }
  if (reactApi.name === 'DataGridPro' || reactApi.name.startsWith('Grid')) {
    demos.push(['/components/data-grid#commercial-version', 'DataGridPro']);
  }
  reactApi.demos = demos;

  reactApi.styles = await parseStyles(reactApi, program);
  reactApi.styles.name = 'MuiDataGrid'; // TODO it should not be hardcoded
  reactApi.styles.classes.forEach((key) => {
    reactApi.styles.globalClasses[key] = generateClassName(
      // @ts-expect-error
      { key },
      { options: { name: reactApi.styles.name, theme: {} } },
    );
  });

  const componentApi: {
    componentDescription: string;
    propDescriptions: { [key: string]: string | undefined };
    classDescriptions: { [key: string]: { description: string; conditions?: string } };
    slotDescriptions: { [key: string]: string | undefined };
  } = {
    componentDescription: reactApi.description,
    propDescriptions: {},
    classDescriptions: {},
    slotDescriptions: {},
  };

  const propErrors: Array<[propName: string, error: Error]> = [];
  const componentProps = fromPairs<{
    default: string | undefined;
    required: boolean | undefined;
    type: { name: string | undefined; description: string | undefined };
  }>(
    Object.entries(reactApi.props || []).map(([propName, propDescriptor]) => {
      // TODO remove `pagination` from DataGrid's allowed props
      if (propName === 'pagination' && reactApi.name === 'DataGrid') {
        return [] as any;
      }

      let prop: DescribeablePropDescriptor | null;
      try {
        prop = createDescribeableProp(propDescriptor, propName);
      } catch (error: any) {
        propErrors.push([propName, error]);
        prop = null;
      }
      if (prop === null) {
        // have to delete `componentProps.undefined` later
        return [] as any;
      }

      let description = generatePropDescription(prop, propName);
      description = renderMarkdownInline(description);

      if (propName === 'classes') {
        description += ' See <a href="#css">CSS API</a> below for more details.';
      }
      componentApi.propDescriptions[propName] = linkify(description, apisToGenerate, 'html');

      const jsdocDefaultValue = getJsdocDefaultValue(
        parseDoctrine(propDescriptor.description || '', {
          sloppy: true,
        }),
      );

      // Only keep `default` for bool props if it isn't 'false'.
      let defaultValue: string | undefined;
      if (propDescriptor.type.name !== 'bool' || jsdocDefaultValue !== 'false') {
        defaultValue = jsdocDefaultValue;
      }

      if (prop.type.raw) {
        // Recast doesn't parse TypeScript
        prop.type.raw = prop.type.raw.replace(/\(props: any\)/, '(props)');
      }

      const propTypeDescription = generatePropTypeDescription(propDescriptor.type);
      const chainedPropType = getChained(prop.type);

      const requiredProp =
        prop.required ||
        /\.isRequired/.test(prop.type.raw) ||
        (chainedPropType !== false && chainedPropType.required);

      return [
        propName,
        {
          type: {
            name: propDescriptor.type.name,
            description:
              propTypeDescription !== propDescriptor.type.name ? propTypeDescription : undefined,
          },
          default: defaultValue,
          // undefined values are not serialized => saving some bytes
          required: requiredProp || undefined,
        },
      ];
    }),
  );
  if (propErrors.length > 0) {
    throw new Error(
      `There were errors creating prop descriptions:\n${propErrors
        .map(([propName, error]) => {
          return `  - ${propName}: ${error}`;
        })
        .join('\n')}`,
    );
  }

  // created by returning the `[]` entry
  delete componentProps.undefined;

  /**
   * CSS class descriptions.
   */
  componentApi.classDescriptions = extractClassConditions(reactApi.styles.descriptions);

  /**
   * Slot descriptions.
   */
  if (componentApi.propDescriptions.components) {
    const slots = extractSlots({
      filename,
      name: reactApi.name, // e.g. DataGrid
      displayName: reactApi.displayName, // e.g. DataGridRaw
      program,
    });

    Object.entries(slots).forEach(([slot, descriptor]) => {
      componentApi.slotDescriptions[slot] = descriptor.description;
      reactApi.slots[slot] = { default: descriptor.default, type: { name: descriptor.type } };
    });
  }

  fse.mkdirSync(apiDocsTranslationsDirectory, {
    mode: 0o777,
    recursive: true,
  });

  writePrettifiedFile(
    path.join(apiDocsTranslationsDirectory, `${kebabCase(reactApi.name)}.json`),
    JSON.stringify(componentApi),
    prettierConfigPath,
  );

  LANGUAGES.forEach((language) => {
    if (language !== 'en') {
      try {
        writePrettifiedFile(
          path.join(apiDocsTranslationsDirectory, `${kebabCase(reactApi.name)}-${language}.json`),
          JSON.stringify(componentApi),
          prettierConfigPath,
        );
      } catch (error) {
        // File exists
      }
    }
  });

  /**
   * Gather the metadata needed for the component's API page.
   */
  const pageContent = {
    // Sorted by required DESC, name ASC
    props: fromPairs(
      Object.entries(componentProps).sort(([aName, aData], [bName, bData]) => {
        if ((aData.required && bData.required) || (!aData.required && !bData.required)) {
          return aName.localeCompare(bName);
        }
        if (aData.required) {
          return -1;
        }
        return 1;
      }),
    ),
    slots: fromPairs(
      Object.entries(reactApi.slots).sort(([aName], [bName]) => {
        return aName.localeCompare(bName);
      }),
    ),
    name: reactApi.name,
    styles: {
      classes: reactApi.styles.classes,
      globalClasses: fromPairs(
        Object.entries(reactApi.styles.globalClasses).filter(([className, globalClassName]) => {
          // Only keep "non-standard" global classnames
          return globalClassName !== `${reactApi.styles.name}-${className}`;
        }),
      ),
      name: reactApi.styles.name,
    },
    spread: reactApi.spread,
    forwardsRefTo: 'GridRoot', // TODO read from tests once we add describeConformanceV5
    filename: toGithubPath(reactApi.filename, workspaceRoot),
    inheritance: reactApi.inheritance,
    demos: generateDemoList(reactApi.demos),
  };

  // docs/pages/component-name.json
  writePrettifiedFile(
    path.resolve(outputDirectory, `${kebabCase(reactApi.name)}.json`),
    JSON.stringify(pageContent),
    prettierConfigPath,
  );

  // docs/pages/component-name.js
  writePrettifiedFile(
    path.resolve(outputDirectory, `${kebabCase(reactApi.name)}.js`),
    `import * as React from 'react';
import ApiPage from 'docsx/src/modules/components/ApiPage';
import mapApiPageTranslations from 'docs/src/modules/utils/mapApiPageTranslations';
import jsonPageContent from './${kebabCase(reactApi.name)}.json';

export default function Page(props) {
  const { descriptions, pageContent } = props;
  return <ApiPage descriptions={descriptions} pageContent={pageContent} />;
}

Page.getInitialProps = () => {
  const req = require.context(
    'docsx/translations/api-docs/data-grid', 
    false,
    /${kebabCase(reactApi.name)}.*.json$/,
  );
  const descriptions = mapApiPageTranslations(req);

  return {
    descriptions,
    pageContent: jsonPageContent,
  };
};
  `.replace(/\r?\n/g, reactApi.EOL),
    prettierConfigPath,
  );

  // eslint-disable-next-line no-console
  console.log('Built API docs for', reactApi.name);
}

async function run(argv: { outputDirectory?: string }) {
  const outputDirectory = path.resolve(argv.outputDirectory!);
  fse.mkdirSync(outputDirectory, { mode: 0o777, recursive: true });

  const pagesMarkdown = findPagesMarkdown()
    .map((markdown) => {
      const markdownSource = fse.readFileSync(markdown.filename, 'utf8');
      return {
        ...markdown,
        components: getHeaders(markdownSource).components,
      };
    })
    .filter((markdown) => markdown.components.length > 0);

  const workspaceRoot = path.resolve(__dirname, '../../');
  const prettierConfigPath = path.join(workspaceRoot, 'prettier.config.js');
  const tsconfig = ttp.loadConfig(path.resolve(__dirname, '../../tsconfig.json'));

  const componentsToGenerateDocs = [
    path.resolve(__dirname, '../../packages/grid/data-grid/src/DataGrid.tsx'),
    path.resolve(__dirname, '../../packages/grid/x-grid/src/DataGridPro.tsx'),
  ];

  const indexPath = path.resolve(__dirname, '../../packages/grid/_modules_/index.ts');
  const program = ttp.createTSProgram([...componentsToGenerateDocs, indexPath], tsconfig);

  // Uncomment below to generate documentation for all exported components
  // const checker = program.getTypeChecker();
  // const indexFile = program.getSourceFile(indexPath)!;
  // const symbol = checker.getSymbolAtLocation(indexFile);
  // const exports = checker.getExportsOfModule(symbol!);
  // const componentsFolder = path.resolve(__dirname, '../../packages/grid/_modules_/grid/components');
  // const components = findComponents(componentsFolder);
  // components.forEach((component) => {
  //   const componentName = path.basename(component.filename).replace('.tsx', '');
  //   const isExported = exports.find((e) => e.name === componentName);
  //   if (isExported) {
  //     componentsToGenerateDocs.push(component.filename);
  //   }
  // })!;

  const apisToGenerate = [
    'GridApi',
    'GridColDef',
    'GridCellParams',
    'GridRowParams',
    'GridSelectionApi',
    'GridFilterApi',
    'GridCsvExportApi',
    'GridCsvExportOptions',
    'GridPrintExportApi',
    'GridDisableVirtualizationApi',
    'GridPrintExportOptions',
    'GridScrollApi',
    'GridEditRowApi',
    'GridEvents',
  ];

  const componentBuilds = componentsToGenerateDocs.map(async (filename) => {
    try {
      return await buildDocs({
        filename,
        program,
        outputDirectory,
        prettierConfigPath,
        workspaceRoot,
        pagesMarkdown,
        apisToGenerate,
      });
    } catch (error: any) {
      error.message = `${path.relative(process.cwd(), filename)}: ${error.message}`;
      throw error;
    }
  });

  const builds = await Promise.allSettled(componentBuilds);

  const fails = builds.filter(
    (promise): promise is PromiseRejectedResult => promise.status === 'rejected',
  );

  fails.forEach((build) => {
    console.error(build.reason);
  });
  if (fails.length > 0) {
    process.exit(1);
  }

  const app = new TypeDoc.Application();
  app.options.addReader(new TypeDoc.TSConfigReader());
  app.options.addReader(new TypeDoc.TypeDocReader());
  app.bootstrap({
    entryPoints: ['packages/grid/data-grid/src/index.ts'],
    exclude: ['**/*.test.ts'],
    tsconfig: 'packages/grid/data-grid/tsconfig.json',
  });
  const project = app.convert()!;

  const exports = (project.children ?? []).map((child) => ({
    name: child.name,
    kind: child?.kindString,
  }));

  writePrettifiedFile(
    path.resolve(workspaceRoot, 'scripts/exportsSnapshot.json'),
    JSON.stringify(exports),
    prettierConfigPath,
  );

  apisToGenerate.forEach((apiName) => {
    const reflection = project.findReflectionByName(apiName);
    if (!reflection || !(reflection instanceof TypeDoc.DeclarationReflection)) {
      throw new Error(`Could not find reflection for "${apiName}".`);
    }

    const api: Api = {
      name: reflection.name,
      description: reflection.comment?.shortText,
      properties: findProperties(reflection),
    };

    const slug = kebabCase(reflection!.name);
    const markdown = generateMarkdown(api, apisToGenerate);

    if (reflection.extendedBy && reflection.extendedBy[0].name === 'GridApi') {
      const json = {
        name: reflection.name,
        description: linkify(reflection.comment?.shortText, apisToGenerate, 'html'),
        properties: api.properties.map((propertyReflection) => {
          const signature = propertyReflection.signatures ? propertyReflection.signatures[0] : null;
          const comment = signature?.comment || propertyReflection.comment;
          const description = linkify(comment?.shortText, apisToGenerate, 'html');

          let typeStr: string = '';
          if (signature) {
            typeStr = generateSignatureStr(signature);
          } else if (propertyReflection.type) {
            typeStr = generateTypeStr(propertyReflection.type);
          }

          return {
            name: propertyReflection.name,
            description: renderMarkdownInline(description),
            type: typeStr,
          };
        }),
      };
      writePrettifiedFile(
        path.resolve(outputDirectory, `${slug}.json`),
        JSON.stringify(json),
        prettierConfigPath,
      );
      // eslint-disable-next-line no-console
      console.log('Built JSON file for', api.name);
    } else if (reflection.name === 'GridEvents') {
      const events = extractEvents(reflection, apisToGenerate);

      writePrettifiedFile(
        path.resolve(workspaceRoot, 'docs/src/pages/components/data-grid/events/events.json'),
        JSON.stringify(events),
        prettierConfigPath,
      );

      // eslint-disable-next-line no-console
      console.log('Built events file');
    } else {
      writePrettifiedFile(
        path.resolve(outputDirectory, `${slug}.md`),
        markdown,
        prettierConfigPath,
      );

      writePrettifiedFile(
        path.resolve(outputDirectory, `${slug}.js`),
        `import * as React from 'react';
import MarkdownDocs from '@material-ui/monorepo/docs/src/modules/components/MarkdownDocs';
import { demos, docs, demoComponents } from './${slug}.md?@mui/markdown';

export default function Page() {
  return <MarkdownDocs demos={demos} docs={docs} demoComponents={demoComponents} />;
}        
    `,
        prettierConfigPath,
      );

      // eslint-disable-next-line no-console
      console.log('Built API docs for', api.name);
    }
  });
}

yargs
  .command({
    command: '$0 <outputDirectory>',
    describe: 'generates API docs',
    builder: (command) => {
      return command.positional('outputDirectory', {
        description: 'directory where the markdown is written to',
        type: 'string',
      });
    },
    handler: run,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
