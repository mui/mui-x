import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as fs from 'node:fs/promises';
import * as prettier from 'prettier';
import {
  getPropTypesFromFile,
  injectPropTypesInFile,
} from '@mui/internal-scripts/typescript-to-proptypes';
import { fixBabelGeneratorIssues, fixLineEndings } from '@mui/internal-docs-utils';
import { createXTypeScriptProjects, XTypeScriptProject } from './createXTypeScriptProjects';
import { resolvePrettierConfigPath } from './utils';

const COMPONENTS_WITHOUT_PROPTYPES = [
  'AnimatedBarElement',
  /* RadarDataProvider is disabled because many `any` were being generated. More info: https://github.com/mui/mui-x/pull/17968 */
  'RadarDataProvider',
  /* The compact views are internal for now: exported only for experiments, no public propTypes yet. */
  '/StandaloneCompactDayView.tsx',
  '/StandaloneCompactThreeDayView.tsx',
  '/StandaloneCompactWeekView.tsx',
  '/StandaloneCompactDayViewPremium.tsx',
  '/StandaloneCompactThreeDayViewPremium.tsx',
  '/StandaloneCompactWeekViewPremium.tsx',
];

/**
 * Canonical, structure-only key for a parsed propType node. Independent of the
 * order TypeScript happened to enumerate union members (which is sensitive to
 * the module/import graph), so it can be used to sort them deterministically.
 */
function getPropTypeSortKey(propType: any): string {
  if (propType == null) {
    return '';
  }
  switch (propType.type) {
    case 'LiteralNode':
      return `Literal(${String(propType.value)})`;
    case 'InstanceOfNode':
      return `InstanceOf(${propType.instance})`;
    case 'ElementNode':
      return `Element(${propType.elementType})`;
    case 'array':
      return `array(${getPropTypeSortKey(propType.arrayType)})`;
    case 'InterfaceNode': {
      const entries: ReadonlyArray<[string, any]> = propType.types ?? [];
      const members = entries
        .map(([name, value]) => `${name}:${getPropTypeSortKey(value)}`)
        .sort()
        .join('|');
      return `Interface(${members})`;
    }
    case 'UnionNode': {
      const members: any[] = propType.types ?? [];
      return `Union(${members.map(getPropTypeSortKey).sort().join('|')})`;
    }
    default:
      return propType.type;
  }
}

/**
 * Recursively sorts the members of every `UnionNode` so the generated
 * `PropTypes.oneOfType([...])` order is stable regardless of import order.
 * Post-order: children are normalized before a parent union is sorted.
 */
function sortPropTypeUnions(propType: any): void {
  if (propType == null) {
    return;
  }
  if (propType.type === 'array') {
    sortPropTypeUnions(propType.arrayType);
    return;
  }
  if (propType.type === 'InterfaceNode') {
    (propType.types ?? []).forEach(([, value]: [string, any]) => sortPropTypeUnions(value));
    return;
  }
  if (propType.type === 'UnionNode') {
    const members: any[] = propType.types ?? [];
    members.forEach(sortPropTypeUnions);
    members.sort((a, b) => getPropTypeSortKey(a).localeCompare(getPropTypeSortKey(b)));
  }
}

/**
 * Normalizes the order of union members across every component prop so that
 * the generated propTypes do not churn when the TypeScript module graph
 * changes (e.g. switching a barrel import to a deep import).
 */
function makePropTypesDeterministic(components: any[]): void {
  components.forEach((component) => {
    component.types?.forEach((definition: any) => sortPropTypeUnions(definition.propType));
  });
}

async function generateProptypes(project: XTypeScriptProject, sourceFile: string) {
  const isDateObject = (name: string) => {
    if (['x-date-pickers', 'x-date-pickers-pro'].includes(project.name)) {
      const DATE_OBJECT_PROPS = [
        'value',
        'defaultValue',
        'minDate',
        'maxDate',
        'minDateTime',
        'maxDateTime',
        'minTime',
        'maxTime',
        'referenceDate',
        'day',
        'currentMonth',
        'month',
      ];

      if (DATE_OBJECT_PROPS.includes(name)) {
        return true;
      }
    }

    return false;
  };

  const components = getPropTypesFromFile({
    filePath: sourceFile,
    project,
    checkDeclarations: true,
    shouldInclude: (type: any) => {
      if (type.name === 'material') {
        return false;
      }
      return true;
    },
    shouldResolveObject: ({ name }) => {
      const propsToNotResolve = [
        'classes',
        'slots',
        'slotProps',
        'columns',
        'currentColumn',
        'colDef',
        'initialState',
        'renderedColumns',
        'scrollBarState',
        'renderState',
        'visibleColumns',
        'cellFocus',
        'cellTabIndex',
        'csvOptions',
        'printOptions',
        'column',
        'groupingColDef',
        'rowNode',
        'pinnedColumns',
        'localeText',
        'columnGroupingModel',
        'fieldRef',
        'startFieldRef',
        'endFieldRef',
        'series',
        'axis',
        'xAxis',
        'yAxis',
        'rotationAxis',
        'radiusAxis',
        'plugins',
        'seriesConfig',
        'manager',
        'eventModelStructure',
        'resourceModelStructure',
        'dateLocale',
      ];
      if (propsToNotResolve.includes(name)) {
        return false;
      }

      if (isDateObject(name)) {
        return false;
      }

      return undefined;
    },
    shouldUseObjectForDate: ({ name }) => isDateObject(name),
  });

  if (components.length === 0) {
    return;
  }

  // Sort union members deterministically so the output does not depend on the
  // order TypeScript enumerated them (which shifts with the import graph).
  makePropTypesDeterministic(components);

  const sourceContent = await fs.readFile(sourceFile, 'utf8');

  const result = injectPropTypesInFile({
    components,
    target: sourceContent,
    options: {
      disablePropTypesTypeChecking: true,
      // Annotate the generated propTypes with `/* remove-proptypes */` so
      // babel-plugin-transform-react-remove-prop-types wraps them in a
      // production guard even for components it cannot detect on its own
      // (components returning portals, arrays, or a render callback result).
      ensureBabelPluginTransformReactRemovePropTypesIntegration: true,
      comment: [
        '----------------------------- Warning --------------------------------',
        '| These PropTypes are generated from the TypeScript type definitions |',
        '| To update them edit the TypeScript types and run "pnpm proptypes"  |',
        '----------------------------------------------------------------------',
      ].join('\n'),
      reconcilePropTypes: (prop, previous, generated) => {
        const usedCustomValidator = previous !== undefined && !previous.startsWith('PropTypes');
        const ignoreGenerated =
          previous !== undefined &&
          previous.startsWith('PropTypes /* @typescript-to-proptypes-ignore */');
        return usedCustomValidator || ignoreGenerated ? previous! : generated;
      },
      shouldInclude: ({ component, prop }) => {
        if (['children', 'state'].includes(prop.name) && component.name.startsWith('DataGrid')) {
          return false;
        }
        if (['plugins', 'seriesConfig'].includes(prop.name) && component.name.includes('Chart')) {
          return false;
        }
        let shouldExclude = false;

        prop.filenames.forEach((filename) => {
          const definedInNodeModule = /node_modules/.test(filename);

          if (definedInNodeModule) {
            // TODO: xGrid team should consider removing this to generate more correct proptypes as well
            if (component.name.includes('Grid')) {
              shouldExclude = true;
            } else {
              const definedInInternalModule = /node_modules\/@mui/.test(filename);
              // we want to include props if they are from our internal components
              // avoid including inherited `children` and `classes` as they (might) need custom implementation to work
              if (
                !definedInInternalModule ||
                (definedInInternalModule && ['children', 'classes', 'theme'].includes(prop.name))
              ) {
                shouldExclude = true;
              }
            }
          }
        });

        // filtering out `prop.filenames.size > 0` removes props from unknown origin
        return prop.filenames.size > 0 && !shouldExclude;
      },
    },
  });

  if (!result) {
    throw new Error('Unable to produce inject propTypes into code.');
  }

  const prettierConfigPath = await resolvePrettierConfigPath();
  const prettierConfig = await prettier.resolveConfig(process.cwd(), {
    config: prettierConfigPath,
  });

  const prettified = await prettier.format(result, { ...prettierConfig, filepath: sourceFile });
  const formatted = fixBabelGeneratorIssues(prettified);
  const correctedLineEndings = fixLineEndings(sourceContent, formatted);

  await fs.writeFile(sourceFile, correctedLineEndings);
}

async function run() {
  const projects = createXTypeScriptProjects();

  const promises = Array.from(projects.values()).flatMap((project) => {
    if (!project.getComponentsWithPropTypes) {
      return [];
    }

    const componentsWithPropTypes = project.getComponentsWithPropTypes(project);
    return componentsWithPropTypes
      .filter((filename) =>
        COMPONENTS_WITHOUT_PROPTYPES.every(
          (ignoredComponent) => !filename.includes(ignoredComponent),
        ),
      )
      .map<Promise<void>>(async (filename) => {
        try {
          await generateProptypes(project, filename);
        } catch (error: any) {
          error.message = `${filename}: ${error.message}`;
          throw error;
        }
      });
  });

  const results = await Promise.allSettled(promises);

  const fails = results.filter((result): result is PromiseRejectedResult => {
    return result.status === 'rejected';
  });

  fails.forEach((result) => {
    console.error(result.reason);
  });
  if (fails.length > 0) {
    process.exit(1);
  }
}

yargs(hideBin(process.argv))
  .command({
    command: '$0',
    describe: 'Generates Component.propTypes from TypeScript declarations',
    handler: run,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
