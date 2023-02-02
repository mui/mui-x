import * as ttp from '@mui/monorepo/packages/typescript-to-proptypes/src/index';
import * as fse from 'fs-extra';
import fs from 'fs';
import path from 'path';
import parseStyles, { Styles } from '@mui/monorepo/packages/api-docs-builder/utils/parseStyles';
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
import { LANGUAGES } from 'docs/config';
import findPagesMarkdownNew from '@mui/monorepo/packages/api-docs-builder/utils/findPagesMarkdown';
import { defaultHandlers, parse as docgenParse, ReactDocgenApi } from 'react-docgen';
import {
  renderInline as renderMarkdownInline,
  getHeaders,
  getTitle,
} from '@mui/monorepo/packages/markdown';
import { getLineFeed } from '@mui/monorepo/packages/docs-utilities';
import { unstable_generateUtilityClass as generateUtilityClass } from '@mui/utils';
import {
  DocumentedInterfaces,
  getJsdocDefaultValue,
  linkify,
  getSymbolJSDocTags,
  writePrettifiedFile,
} from './utils';
import { Project, Projects } from '../getTypeScriptProjects';

interface ReactApi extends ReactDocgenApi {
  /**
   * list of page pathnames
   * @example ['/components/Accordion']
   */
  demos: Array<{ name: string; demoPathname: string }>;
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

    slots[name] = {
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

function findXDemos(
  componentName: string,
  pagesMarkdown: ReadonlyArray<PageMarkdown>,
): ReactApi['demos'] {
  if (componentName.startsWith('Grid') || componentName.startsWith('DataGrid')) {
    const demos: ReactApi['demos'] = [];
    if (componentName === 'DataGrid' || componentName.startsWith('Grid')) {
      demos.push({ name: 'DataGrid', demoPathname: '/x/react-data-grid/#mit-version' });
    }
    if (componentName === 'DataGridPro' || componentName.startsWith('Grid')) {
      demos.push({ name: 'DataGridPro', demoPathname: '/x/react-data-grid/#commercial-version' });
    }
    if (componentName === 'DataGridPremium' || componentName.startsWith('Grid')) {
      demos.push({
        name: 'DataGridPremium',
        demoPathname: '/x/react-data-grid/#commercial-version',
      });
    }

    return demos;
  }

  return pagesMarkdown
    .filter((page) => page.components.includes(componentName))
    .map((page) => {
      let name = /^Date and Time Pickers - (.*)$/.exec(page.title)?.[1] ?? page.title;
      name = name.replace(/\[(.*)]\((.*)\)/g, '');

      const pathnameMatches = /\/date-pickers\/([^/]+)\/([^/]+)/.exec(page.pathname);

      return {
        name,
        demoPathname: `/x/react-date-pickers/${pathnameMatches![1]}/`,
      };
    });
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
  reactApi.EOL = getLineFeed(src);
  reactApi.slots = {};

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
      } else if (propName === 'sx') {
        description +=
          ' See the <a href="/system/getting-started/the-sx-prop/">`sx` page</a> for more details.';
      }
      componentApi.propDescriptions[propName] = linkify(description, documentedInterfaces, 'html');

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
      componentApi.slotDescriptions[slot] = descriptor.description;
      reactApi.slots[slot] = { default: descriptor.default, type: { name: descriptor.type } };
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
    forwardsRefTo: reactApi.forwardsRefTo,
    filename: toGithubPath(reactApi.filename, project.workspaceRoot),
    inheritance: reactApi.inheritance,
    demos: `<ul>${reactApi.demos
      .map((item) => `<li><a href="${item.demoPathname}">${item.name}</a></li>`)
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
import ApiPage from 'docsx/src/modules/components/ApiPage';
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
    return componentsWithApiDoc.map<Promise<void>>(async (filename) => {
      try {
        return await buildComponentDocumentation({
          filename,
          project,
          projects,
          apiPagesFolder,
          pagesMarkdown,
          documentedInterfaces,
        });
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
}

interface PageMarkdown {
  pathname: string;
  title: string;
  components: readonly string[];
}
