import { DistributiveOmit } from '@mui/x-internals/types';

interface CommonProperty<Props, Values, State> {
  /**
   * Displayed title
   */
  title: string;
  /**
   * A unique key to store the value
   */
  key: string;
  /**
   * A function to update the props based on the value and state
   * @param {Props} props  The props before applying this value
   * @param {any} value The value from the form
   * @param {any} state The form state, useful to compute the new props based on other values
   * @returns {Props} The updated props
   */
  setProperty?: (props: Props, value: Values, state: State) => Props;
  disabled?: (state: State) => boolean;
}

// ======= input options =======

interface RadioConfig<Props, Values extends string = string> extends CommonProperty<
  Props,
  Values,
  any
> {
  type: 'radio';
  input?: 'select' | 'buttonGroup';
  values: readonly Values[];
  default: Values;
  extraFields?: {
    [key in Values]?: DistributiveOmit<ConfigProperty<Props, Values>, 'setProperty'>;
  };
}

interface NumberConfig<Props> extends CommonProperty<Props, number, any> {
  type: 'number';
  min: number;
  max: number;
  default: number;
  step?: number;
  input?: 'text' | 'slider';
}

interface BooleanConfig<Props> extends CommonProperty<Props, boolean, any> {
  type: 'boolean';
  default: boolean;
}

// ======= structure organization =======

export type ConfigProperty<Props, Values extends string = string> =
  | RadioConfig<Props, Values>
  | NumberConfig<Props>
  | BooleanConfig<Props>;

export interface ConfigSection<Props> {
  title: string;
  properties: ConfigProperty<Props, any>[];
}

export function defineProperty<Props>() {
  return {
    radio: <const V extends string>(
      property: Omit<RadioConfig<Props, V>, 'type'>,
    ): RadioConfig<Props, V> => ({
      ...property,
      type: 'radio',
    }),
    number: (property: Omit<NumberConfig<Props>, 'type'>): NumberConfig<Props> => ({
      ...property,
      type: 'number',
    }),
    boolean: (property: Omit<BooleanConfig<Props>, 'type'>): BooleanConfig<Props> => ({
      ...property,
      type: 'boolean',
    }),
  };
}
