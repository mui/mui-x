// Types/Interfaces are copied from the x-data-grid-premium to make the configuration compatible without depending on the grid package
import * as React from 'react';

type Axis<T> = { id: string; label: string; data: T[] }[];

type GridChartsConfiguration = Record<string, string | number | boolean | null>;

type ConfigurationCallback<R> = (context: {
  configuration: GridChartsConfiguration;
  categories: Axis<string | number | null>;
  series: Axis<number | null>;
}) => R;

type GridChartsConfigurationControl =
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

export interface GridChartsConfigurationOptions {
  [key: string]: {
    label: string;
    icon: any; // TODO: fix type
    maxCategories?: number;
    maxSeries?: number;
    customization: GridChartsConfigurationSection[];
  };
}
