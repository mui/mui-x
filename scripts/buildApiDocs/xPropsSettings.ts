import type { ProjectSettings } from '@mui/internal-api-docs-builder';

type PropsSettings = NonNullable<ProjectSettings['propsSettings']>;

const PROPS_TO_NOT_RESOLVE = [
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

export function createXPropsSettings(
  options: { dateObjects?: boolean; propsWithoutDefaultVerification?: string[] } = {},
): PropsSettings {
  const isDateObject = (name: string) => !!options.dateObjects && DATE_OBJECT_PROPS.includes(name);

  return {
    propsWithoutDefaultVerification: options.propsWithoutDefaultVerification ?? [],
    shouldResolveObject: ({ name }) => {
      if (PROPS_TO_NOT_RESOLVE.includes(name) || isDateObject(name)) {
        return false;
      }
      return undefined;
    },
    shouldUseObjectForDate: ({ name }) => isDateObject(name),
    shouldIncludeProp: ({ componentName, prop }) => {
      if (prop.name === 'material') {
        return false;
      }
      if (['children', 'state'].includes(prop.name) && componentName.startsWith('DataGrid')) {
        return false;
      }
      if (['plugins', 'seriesConfig'].includes(prop.name) && componentName.includes('Chart')) {
        return false;
      }
      if (prop.filenames.size === 0) {
        return false;
      }
      const excluded = Array.from(prop.filenames).some((filename) => {
        if (!/node_modules/.test(filename)) {
          return false;
        }
        if (componentName.includes('Grid')) {
          return true;
        }
        // Keep props of internal components, except inherited `children`, `classes` and `theme`.
        return (
          !/node_modules\/@mui/.test(filename) ||
          ['children', 'classes', 'theme'].includes(prop.name)
        );
      });
      return !excluded;
    },
  };
}
