import * as React from 'react';

export type Dataset<T> = { id: string; label: string; data: T[] }[];

export type GridChartsConfiguration = Record<string, string | number | boolean | null>;

export type ConfigurationCallback<R> = (context: {
  configuration: GridChartsConfiguration;
  dimensions: Dataset<string | number | null>;
  values: Dataset<number | null>;
}) => R;

export type GridChartsConfigurationControl =
  | {
      label: string;
      description?: string;
      type: 'boolean' | 'number' | 'string';
      default: boolean | string | number | null;
      isDisabled?: ConfigurationCallback<boolean>;
      isHidden?: ConfigurationCallback<boolean>;
      htmlAttributes?: {
        [key: string]: string;
      };
    }
  | {
      label: string;
      description?: string;
      type: 'select';
      options: { content: React.ReactNode; value: string }[];
      default: string;
      isDisabled?: ConfigurationCallback<boolean>;
      isHidden?: ConfigurationCallback<boolean>;
      htmlAttributes?: {
        [key: string]: string;
      };
    };

export interface GridChartsConfigurationSection {
  id: string;
  label: string;
  controls: {
    [key: string]: GridChartsConfigurationControl;
  };
}

/**
 * @example
 * const configuration: GridChartsConfigurationOptions = {
 *  'bar': {
 *    'label': 'Bar',
 *    'icon': <BarChartIcon />,
 *    'dimensionsLabel': 'Categories',
 *    'valuesLabel': 'Series',
 *    'maxDimensions': 1,
 *    'customization': [{
 *      'id': 'mainSection',
 *      'label': 'Main Section',
 *      'controls': {
 *        'height': { label: 'Height', type: 'number', default: 350 },
 *        'layout': { label: 'Layout', type: 'select', default: 'vertical', options: [{ content: 'Vertical', value: 'vertical' }, { content: 'Horizontal', value: 'horizontal' }] },
 *        'stacked': { label: 'Stacked', type: 'boolean', default: false, isHidden: (configuration, dimensions, values) => values.length < 2 },
 *        'hideLegend': { label: 'Hide Legend', type: 'boolean', default: false },
 *      },
 *    }]
 *  },
 * };
 */
export interface GridChartsConfigurationOptions {
  [key: string]: {
    label: string;
    icon: (props: any) => React.ReactNode;
    customization: GridChartsConfigurationSection[];
    dimensionsLabel?: string;
    valuesLabel?: string;
    maxDimensions?: number;
    maxValues?: number;
  };
}
