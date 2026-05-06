// ======= input options =======

interface RadioConfig {
  type: 'radio';
  values: string[];
  default: string;
}

interface NumberConfig {
  type: 'number';
  min: number;
  max: number;
  default: number;
  step?: number;
  input?: 'text' | 'slider';
}

// ======= structure organization =======

type ConfigValue = RadioConfig | NumberConfig;

interface ConfigProperty<Props extends Record<string, unknown>> {
  /**
   * Displayed title
   */
  title: string;
  /**
   * A unique key to store the value
   */
  key: string | ((state: Record<string, unknown>) => string);
  /**
   * A function to update the props based on the value and state
   * @param {Props} props  The props before applying this value
   * @param {unknown} value The value from the form
   * @param {Record<string, unknown>} state The form state, useful to compute the new props based on other values
   * @returns {Props} The updated props
   */
  setProperty?: (props: Props, value: unknown, state: Record<string, unknown>) => Props;
  value: ConfigValue | ((state: Record<string, unknown>) => ConfigValue);
  disabled?: (state: Record<string, unknown>) => boolean;
}

export interface ConfigSection<Props extends Record<string, unknown>> {
  title: string;
  properties: ConfigProperty<Props>[];
}
