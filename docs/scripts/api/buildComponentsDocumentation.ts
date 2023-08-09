import * as ttp from '@mui/monorepo/packages/typescript-to-proptypes/src/index';
import * as fse from 'fs-extra';
import fs from 'fs';
import path from 'path';
import parseStyles from '@mui/monorepo/packages/api-docs-builder/utils/parseStyles';
import fromPairs from 'lodash/fromPairs';
import createDescribeableProp, {
  DescribeablePropDescriptor,
} from '@mui/monorepo/packages/api-docs-builder/utils/createDescribeableProp';
import generatePropDescription from '@mui/monorepo/packages/api-docs-builder/utils/generatePropDescription';
import { parse as parseDoctrine } from 'doctrine';
import generatePropTypeDescription, {
  getChained,
} from '@mui/monorepo/packages/api-docs-builder/utils/generatePropTypeDescription';
import parseTest from '@mui/monorepo/packages/api-docs-builder/utils/parseTest';
import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';
import { LANGUAGES } from 'docs/config';
import findPagesMarkdownNew from '@mui/monorepo/packages/api-docs-builder/utils/findPagesMarkdown';
import { defaultHandlers, parse as docgenParse } from 'react-docgen';
import {
  renderInline as renderMarkdownInline,
  getHeaders,
  getTitle,
} from '@mui/monorepo/packages/markdown';
import { getLineFeed } from '@mui/monorepo/packages/docs-utilities';
import { unstable_generateUtilityClass as generateUtilityClass } from '@mui/utils';
import type { ReactApi as CoreReactApi } from '@mui/monorepo/packages/api-docs-builder/ApiBuilders/ComponentApiBuilder';
import {
  DocumentedInterfaces,
  getJsdocDefaultValue,
  linkify,
  getSymbolJSDocTags,
  writePrettifiedFile,
} from './utils';
import { Project, Projects } from '../getTypeScriptProjects';
import saveApiDocPages, { ApiPageType, getPlan } from './saveApiDocPages';

type CoreReactApiProps = CoreReactApi['propsTable'][string];

export interface ReactApi extends Omit<CoreReactApi, 'propsTable' | 'translations' | 'classes'> {
  displayName: string;
  packages: { packageName: string; componentName: string }[];
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

function extractSlots(options: {
  filename: string;
  name: string;
  displayName: string;
  project: Project;
}) {
  const { filename, name: componentName, displayName, project } = options;
  const slots: Record<string, { type: string; default?: string; description: string }> = {};

  const proptypes = ttp.parseFromProgram(filename, project.program, {
    checkDeclarations: true,
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

  const types = [...(propInterface as ttp.InterfaceType).types].sort((a, b) =>
    a[0] > b[0] ? 1 : -1,
  );

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

    // Workaround to generate correct (camelCase) keys for slots in v6 `API Reference` documentation
    // TODO v7: Remove camelCase once `Grid(Pro|Premium)SlotsComponent` type is refactored to have `camelCase` names
    // Shifting to `slots` prop instead of `components` prop strips off the `default` property due to deduced type `UncapitalizedGridSlotsComponent`
    const slotName = camelCase(name);

    slots[slotName] = {
      type,
      description,
      default: defaultValue,
    };
  });

  return slots;
}

/**
 * @param filepath - absolute path
 * @example toGithubPath('/home/user/material-ui/packages/Accordion') === '/packages/Accordion'
 * @example toGithubPath('C:\\Development\material-ui\packages\Accordion') === '/packages/Accordion'
 */
function toGithubPath(filepath: string): string {
  return `/${path.relative(process.cwd(), filepath).replace(/\\/g, '/')}`;
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

function findXDemos(
  componentName: string,
  pagesMarkdown: ReadonlyArray<PageMarkdown>,
): ReactApi['demos'] {
  if (componentName.startsWith('Grid') || componentName.startsWith('DataGrid')) {
    const demos: ReactApi['demos'] = [];
    if (componentName === 'DataGrid' || componentName.startsWith('Grid')) {
      demos.push({ demoPageTitle: 'DataGrid', demoPathname: '/x/react-data-grid/#mit-version' });
    }
    if (componentName === 'DataGridPro' || componentName.startsWith('Grid')) {
      demos.push({
        demoPageTitle: 'DataGridPro',
        demoPathname: '/x/react-data-grid/#commercial-version',
      });
    }
    if (componentName === 'DataGridPremium' || componentName.startsWith('Grid')) {
      demos.push({
        demoPageTitle: 'DataGridPremium',
        demoPathname: '/x/react-data-grid/#commercial-version',
      });
    }

    return demos;
  }

  return pagesMarkdown
    .filter((page) => page.components.includes(componentName))
    .map((page) => {
      if (page.pathname.includes('date-pickers')) {
        let demoPageTitle = /^Date and Time Pickers - (.*)$/.exec(page.title)?.[1] ?? page.title;
        demoPageTitle = demoPageTitle.replace(/\[(.*)]\((.*)\)/g, '');

        const pathnameMatches = /\/date-pickers\/([^/]+)\/([^/]+)/.exec(page.pathname);

        return {
          demoPageTitle,
          demoPathname: `/x/react-date-pickers/${pathnameMatches![1]}/`,
        };
      }

      if (page.pathname.includes('tree-view')) {
        const pathnameMatches = /\/tree-view\/([^/]+)\/([^/]+)/.exec(page.pathname);
        const pageId = pathnameMatches![1] === 'overview' ? '' : `${pathnameMatches![1]}/`;

        return {
          demoPageTitle: page.title,
          demoPathname: `/x/react-tree-view/${pageId}`,
        };
      }

      throw new Error('Invalid page');
    });
}

/**
 * Helper to get the import options
 * @param name The name of the component
 * @param filename The filename where its defined (to infer the package)
 * @returns an array of import command
 */
function getComponentImports(name: string, filename: string): string[] {
  const githubPath = toGithubPath(filename);

  const rootImportPath = githubPath.replace(
    /\/packages\/(grid\/|)(.+?)?\/src\/.*/,
    (match, dash, pkg) => `@mui/${pkg}`,
  );

  const subdirectoryImportPath = githubPath.replace(
    /\/packages\/(grid\/|)(.+?)?\/src\/([^\\/]+)\/.*/,
    (match, dash, pkg, directory) => `@mui/${pkg}/${directory}`,
  );

  const reExportPackage = [rootImportPath];

  // Data Grid
  if (rootImportPath === '@mui/x-data-grid-pro') {
    reExportPackage.push('@mui/x-data-grid-premium');
  }
  if (rootImportPath === '@mui/x-data-grid') {
    reExportPackage.push('@mui/x-data-grid-pro');
    reExportPackage.push('@mui/x-data-grid-premium');
  }

  // Pickers
  if (rootImportPath === '@mui/x-date-pickers') {
    reExportPackage.push('@mui/x-date-pickers-pro');
  }

  // Charts
  // if (rootImportPath === '@mui/x-charts') {
  //   reExportPackage.push('@mui/x-charts-pro');
  // }

  // Tree View
  // if (rootImportPath === '@mui/x-tree-view') {
  //   reExportPackage.push('@mui/x-tree-view-pro');
  // }

  const imports = [
    `import { ${name} } from '${subdirectoryImportPath}';`,
    ...reExportPackage.map((importPath) => `import { ${name} } from '${importPath}';`),
  ];

  return imports;
}

const buildComponentDocumentation = async (options: {
  filename: string;
  project: Project;
  projects: Projects;
  apiPagesFolder: string;
  documentedInterfaces: DocumentedInterfaces;
  pagesMarkdown: ReadonlyArray<PageMarkdown>;
}) => {
  const { filename, project, apiPagesFolder, documentedInterfaces, projects, pagesMarkdown } =
    options;

  const src = fse.readFileSync(filename, 'utf8');
  const reactApi = parseComponentSource(src, { filename });
  reactApi.filename = filename; // Some components don't have props
  reactApi.name = path.parse(filename).name;
  reactApi.imports = getComponentImports(reactApi.name, filename);
  reactApi.EOL = getLineFeed(src);
  reactApi.slots = [];

  try {
    const testInfo = await parseTest(reactApi.filename);
    // no Object.assign to visually check for collisions
    reactApi.forwardsRefTo = testInfo.forwardsRefTo;
    reactApi.spread = testInfo.spread;
    reactApi.inheritance = null; // TODO: Support inheritance
  } catch (e) {
    if (project.name.includes('grid')) {
      // TODO: Use `describeConformance` for the DataGrid components
      reactApi.forwardsRefTo = 'GridRoot';
    }
  }

  reactApi.demos = findXDemos(reactApi.name, pagesMarkdown);

  reactApi.styles = await parseStyles({ project, componentName: reactApi.name });
  reactApi.styles.name = reactApi.name.startsWith('Grid')
    ? 'MuiDataGrid' // TODO: Read from @slot annotation
    : `Mui${reactApi.name.replace(/(Pro|Premium)$/, '')}`;
  reactApi.styles.classes.forEach((key) => {
    const globalClass = generateUtilityClass(reactApi.styles.name!, key);
    reactApi.styles.globalClasses[key] = globalClass;
  });

  reactApi.packages = Array.from(projects.keys())
    .map((projectName) => {
      const currentProject = projects.get(projectName) as Project;

      const symbol =
        currentProject.exports[reactApi.name] ||
        currentProject.exports[`Unstable_${reactApi.name}`];

      if (symbol) {
        const jsDoc = getSymbolJSDocTags(symbol);

        // Do not show imports if the module is deprecated
        if (jsDoc.deprecated) {
          return null;
        }

        return {
          packageName: `@mui/${projectName}`,
          componentName: symbol.escapedName.toString(),
        };
      }

      return null;
    })
    .filter((p): p is ReactApi['packages'][number] => p != null)
    // Display the imports from the pro packages above imports from the community packages
    .sort((a, b) => b.packageName.length - a.packageName.length);

  const componentApi: CoreReactApi['translations'] = {
    componentDescription: reactApi.description,
    propDescriptions: {},
    classDescriptions: {},
    slotDescriptions: {},
  };

  const propErrors: Array<[propName: string, error: Error]> = [];
  type Pair = [string, CoreReactApiProps];
  const componentProps = fromPairs(
    Object.entries(reactApi.props || []).map(([propName, propDescriptor]): Pair => {
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

      const {
        deprecated,
        jsDocText,
        signature: signatureType,
        signatureArgs,
        signatureReturn,
        requiresRef,
      } = generatePropDescription(prop, propName);
      let description = renderMarkdownInline(jsDocText);

      const additionalInfo: CoreReactApiProps['additionalInfo'] = {};
      if (propName === 'classes') {
        additionalInfo.cssApi = true;
      } else if (propName === 'sx') {
        additionalInfo.sx = true;
      }
      // Parse and generate `@see` doc with a {@link}
      const seeTag = prop.annotation.tags.find((tag) => tag.title === 'see');
      if (seeTag && seeTag.description) {
        description += `<br>${seeTag.description.replace(
          /{@link ([^|| ]*)[|| ]([^}]*)}/,
          '<a href="$1">$2</a>',
        )}`;
      }

      const typeDescriptions: { [t: string]: string } = {};
      (signatureArgs || [])
        .concat(signatureReturn || [])
        .forEach(({ name, description: paramDescription }) => {
          typeDescriptions[name] = linkify(
            renderMarkdownInline(paramDescription),
            documentedInterfaces,
            'html',
          );
        });

      componentApi.propDescriptions[propName] = {
        description: linkify(description, documentedInterfaces, 'html'),
        requiresRef,
        deprecated,
        typeDescriptions,
      };

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

      const deprecation = (propDescriptor.description || '').match(/@deprecated(\s+(?<info>.*))?/);

      let signature: CoreReactApiProps['signature'];
      if (signatureType !== undefined) {
        signature = {
          type: signatureType,
          describedArgs: signatureArgs?.map((arg) => arg.name),
          returned: signatureReturn?.name,
        };
      }
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
          deprecated: !!deprecation || undefined,
          deprecationInfo:
            renderMarkdownInline(deprecation?.groups?.info || '').trim() || undefined,
          signature,
          additionalInfo: Object.keys(additionalInfo).length === 0 ? undefined : additionalInfo,
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
      project,
    });

    Object.entries(slots).forEach(([slot, descriptor]) => {
      componentApi.slotDescriptions![slot] = descriptor.description;
      reactApi.slots?.push({
        class: null,
        name: slot,
        description: descriptor.description,
        default: descriptor.default,
      });
    });
  }

  const apiDocsTranslationDirectory = path.resolve(
    project.workspaceRoot,
    'docs',
    'translations',
    'api-docs',
    project.documentationFolderName,
  );

  fse.mkdirSync(apiDocsTranslationDirectory, {
    mode: 0o777,
    recursive: true,
  });

  writePrettifiedFile(
    path.join(apiDocsTranslationDirectory, `${kebabCase(reactApi.name)}.json`),
    JSON.stringify(componentApi),
    project,
  );

  LANGUAGES.forEach((language) => {
    if (language !== 'en') {
      try {
        writePrettifiedFile(
          path.join(apiDocsTranslationDirectory, `${kebabCase(reactApi.name)}-${language}.json`),
          JSON.stringify(componentApi),
          project,
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
    slots: reactApi.slots.sort((slotA, slotB) => (slotA.name > slotB.name ? 1 : -1)),
    name: reactApi.name,
    imports: reactApi.imports,
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
    forwardsRefTo: reactApi.forwardsRefTo,
    filename: toGithubPath(reactApi.filename),
    inheritance: reactApi.inheritance,
    demos: `<ul>${reactApi.demos
      .map((item) => `<li><a href="${item.demoPathname}">${item.demoPageTitle}</a></li>`)
      .join('\n')}</ul>`,
    packages: reactApi.packages,
  };

  // docs/pages/component-name.json
  writePrettifiedFile(
    path.resolve(
      apiPagesFolder,
      project.documentationFolderName,
      `${kebabCase(reactApi.name)}.json`,
    ),
    JSON.stringify(pageContent),
    project,
  );

  // docs/pages/component-name.js
  writePrettifiedFile(
    path.resolve(apiPagesFolder, project.documentationFolderName, `${kebabCase(reactApi.name)}.js`),
    `import * as React from 'react';
import ApiPage from 'docs/src/modules/components/ApiPage';
import mapApiPageTranslations from 'docs/src/modules/utils/mapApiPageTranslations';
import jsonPageContent from './${kebabCase(reactApi.name)}.json';

export default function Page(props) {
  const { descriptions, pageContent } = props;
  return <ApiPage descriptions={descriptions} pageContent={pageContent} />;
}

Page.getInitialProps = () => {
  const req = require.context(
    'docsx/translations/api-docs/${project.documentationFolderName}',
    false,
    /\\.\\/${kebabCase(reactApi.name)}(-[a-z]{2})?\\.json$/,
  );
  const descriptions = mapApiPageTranslations(req);

  return {
    descriptions,
    pageContent: jsonPageContent
  };
};
  `.replace(/\r?\n/g, reactApi.EOL),
    project,
  );

  // eslint-disable-next-line no-console
  console.log('Built API docs for', reactApi.name);

  return {
    name: reactApi.name,
    packages: reactApi.packages,
    folder: project.documentationFolderName,
  };
};

interface BuildComponentsDocumentationOptions {
  projects: Projects;
  apiPagesFolder: string;
  dataFolder: string;
  documentedInterfaces: DocumentedInterfaces;
}

export default async function buildComponentsDocumentation(
  options: BuildComponentsDocumentationOptions,
) {
  const { apiPagesFolder, dataFolder, documentedInterfaces, projects } = options;

  const pagesMarkdown = findPagesMarkdownNew(dataFolder).map((markdown) => {
    const markdownContent = fs.readFileSync(markdown.filename, 'utf8');
    const markdownHeaders = getHeaders(markdownContent) as any;

    return {
      ...markdown,
      title: getTitle(markdownContent),
      components: markdownHeaders.components as string[],
    };
  });

  const promises = Array.from(projects.values()).flatMap((project) => {
    if (!project.getComponentsWithApiDoc) {
      return [];
    }

    const componentsWithApiDoc = project.getComponentsWithApiDoc(project);
    return componentsWithApiDoc.map<Promise<ApiPageType>>(async (filename) => {
      try {
        // Create the api files, and data to create it's link
        const { name, packages, folder } = await buildComponentDocumentation({
          filename,
          project,
          projects,
          apiPagesFolder,
          pagesMarkdown,
          documentedInterfaces,
        });

        return {
          folderName: folder,
          pathname: `/x/api/${folder}/${kebabCase(name)}`,
          title: name,
          plan: getPlan(packages),
        };
      } catch (error: any) {
        error.message = `${path.relative(process.cwd(), filename)}: ${error.message}`;
        throw error;
      }
    });
  });

  const builds = await Promise.allSettled(promises);

  const fails = builds.filter(
    (promise): promise is PromiseRejectedResult => promise.status === 'rejected',
  );

  fails.forEach((build) => {
    console.error(build.reason);
  });
  if (fails.length > 0) {
    process.exit(1);
  }

  // Build charts API page indexes
  const createdPages = builds
    .filter(
      (promise): promise is PromiseFulfilledResult<ApiPageType> => promise.status === 'fulfilled',
    )
    .map((build) => build.value);

  return saveApiDocPages(createdPages, {
    dataFolder,
    identifier: 'component-api',
    project: projects.get(projects.keys().next().value)!, // Use any project since it's only for pretifier
  });
}

interface PageMarkdown {
  pathname: string;
  title: string;
  components: readonly string[];
}
