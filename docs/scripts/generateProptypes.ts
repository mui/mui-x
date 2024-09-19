import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as path from 'path';
import * as fse from 'fs-extra';
import * as prettier from 'prettier';
import {
  getPropTypesFromFile,
  injectPropTypesInFile,
} from '@mui/internal-scripts/typescript-to-proptypes';
import { fixBabelGeneratorIssues, fixLineEndings } from '@mui/internal-docs-utils';
import { createXTypeScriptProjects, XTypeScriptProject } from './createXTypeScriptProjects';

const COMPONENTS_WITHOUT_PROPTYPES = ['ChartsAxisTooltipContent', 'ChartsItemTooltipContent'];

async function generateProptypes(project: XTypeScriptProject, sourceFile: string) {
  const isTDate = (name: string) => {
    if (['x-date-pickers', 'x-date-pickers-pro'].includes(project.name)) {
      const T_DATE_PROPS = [
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

      if (T_DATE_PROPS.includes(name)) {
        return true;
      }
    }

    return false;
  };

  const components = getPropTypesFromFile({
    filePath: sourceFile,
    project,
    checkDeclarations: true,
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
        'unstableFieldRef',
        'unstableStartFieldRef',
        'unstableEndFieldRef',
        'series',
        'axis',
        'bottomAxis',
        'topAxis',
        'leftAxis',
        'rightAxis',
        'plugins',
      ];
      if (propsToNotResolve.includes(name)) {
        return false;
      }

      if (isTDate(name)) {
        return false;
      }

      return undefined;
    },
    shouldUseObjectForDate: ({ name }) => isTDate(name),
  });

  if (components.length === 0) {
    return;
  }

  const sourceContent = await fse.readFile(sourceFile, 'utf8');

  const result = injectPropTypesInFile({
    components,
    target: sourceContent,
    options: {
      disablePropTypesTypeChecking: true,
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
        let shouldExclude = false;

        if (prop.propType.type === 'InterfaceNode') {
          if (prop.propType.types.some((type) => type[0] === '_lastToId')) {
            // Try to catch proptypes from react-spring.
            // Better solution should be to simplify the proptype instead of ignoring it.
            return false;
          }
        }

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

  const prettierConfig = await prettier.resolveConfig(process.cwd(), {
    config: path.join(__dirname, '../../prettier.config.js'),
  });

  const prettified = await prettier.format(result, { ...prettierConfig, filepath: sourceFile });
  const formatted = fixBabelGeneratorIssues(prettified);
  const correctedLineEndings = fixLineEndings(sourceContent, formatted);

  await fse.writeFile(sourceFile, correctedLineEndings);
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
