// Types/Interfaces are copied from the x-data-grid-premium to make the configuration compatible without depending on the grid package

type Axis<T> = { id: string; label: string; data: T[] }[];

type GridChartsConfiguration = Record<string, string | number | boolean | null>;

type ConfigurationCallback<R> = (context: {
  configuration: GridChartsConfiguration;
  categories: Axis<string | number | null>;
  series: Axis<number | null>;
}) => R;

interface GridChartsConfigurationSection {
  id: string;
  label: string;
  controls: {
    [key: string]: {
      label: string;
      description?: string;
      type: string;
      options?: { label: string; value: string }[];
      default: boolean | string | number | null;
      isDisabled?: ConfigurationCallback<boolean>;
      isHidden?: ConfigurationCallback<boolean>;
      htmlAttributes?: {
        [key: string]: string;
      };
    };
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
