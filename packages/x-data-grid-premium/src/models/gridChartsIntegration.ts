type Axis<T> = { id: string; label: string; data: T[] }[];

type GridChartsConfiguration = Record<string, string | number | boolean | null>;

type ConfigurationCallback<R> = (context: {
  configuration: GridChartsConfiguration;
  categories: Axis<string | number | null>;
  series: Axis<number | null>;
}) => R;

export interface GridChartsConfigurationSection {
  id: string;
  label: string;
  controls: {
    [key: string]: {
      label: string;
      description?: string;
      type: string;
      options?: string[];
      default:
        | boolean
        | string
        | number
        | null
        | ConfigurationCallback<boolean | string | number | null>;
      isDisabled?: ConfigurationCallback<boolean>;
      isHidden?: ConfigurationCallback<boolean>;
    };
  };
}

/**
 * @example
 * const configuration: GridChartsConfigurationOptions = {
 *  'bar': {
 *    'label': 'Bar',
 *    'icon': <BarChartIcon />,
 *    'maxCategories': 1,
 *    'customization': [{
 *      'id': 'mainSection',
 *      'label': 'Main Section',
 *      'controls': {
 *        'height': { label: 'Height', type: 'number', default: 350 },
 *        'layout': { label: 'Layout', type: 'select', default: 'vertical', options: ['vertical', 'horizontal'] },
 *        'stacked': { label: 'Stacked', type: 'boolean', default: false, isHidden: (configuration, categories, series) => series.length < 2 },
 *        'hideLegend': { label: 'Hide Legend', type: 'boolean', default: false },
 *      },
 *    }]
 *  },
 * };
 */
export interface GridChartsConfigurationOptions {
  [key: string]: {
    label: string;
    icon: any; // TODO: fix type
    maxCategories?: number;
    maxSeries?: number;
    customization: GridChartsConfigurationSection[];
  };
}

export interface GridChartsIntegrationContextValue {
  categories: Axis<string | number | null>;
  series: Axis<number | null>;
  chartType: string;
  configuration: Record<string, string | number | boolean | null>;
  setCategories: (categories: Axis<string | number | null>) => void;
  setSeries: (series: Axis<number | null>) => void;
  setChartType: (type: string) => void;
  setConfiguration: (configuration: Record<string, string | number | boolean | null>) => void;
}
