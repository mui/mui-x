import type * as React from 'react';

export type ChartBaseCommonProps<T = HTMLElement> = React.DOMAttributes<T> & {
  className?: string;
  style?: React.CSSProperties;
  [k: `aria-${string}`]: any;
  [k: `data-${string}`]: any;
};

export type ChartBaseIconProps = ChartBaseCommonProps<SVGSVGElement> & {
  /**
   * The accessible title of the icon.
   */
  titleAccess?: string;
  /**
   * The size of the icon.
   */
  fontSize?: 'small' | 'medium' | 'large' | 'inherit';
};

export type ChartBaseButtonProps = ChartBaseCommonProps & {
  ref?: React.Ref<HTMLButtonElement>;
  /**
   * The id of the button element.
   */
  id?: string;
  /**
   * If `true`, the button is disabled.
   */
  disabled?: boolean;
  /**
   * The `tabIndex` of the button element.
   */
  tabIndex?: number;
  /**
   * The size of the button.
   */
  size?: 'small' | 'medium' | 'large';
};

export type ChartBaseIconButtonProps = ChartBaseCommonProps & {
  ref?: React.Ref<HTMLButtonElement>;
  /**
   * The id of the button element.
   */
  id?: string;
  /**
   * If `true`, the button is disabled.
   */
  disabled?: boolean;
  /**
   * The `tabIndex` of the button element.
   */
  tabIndex?: number;
  /**
   * The size of the button.
   */
  size?: 'small' | 'medium' | 'large';
};

export type ChartBaseToggleButtonProps = ChartBaseCommonProps & {
  ref?: React.Ref<HTMLButtonElement>;
  /**
   * The id of the button element.
   */
  id?: string;
  /**
   * If `true`, the button is disabled.
   */
  disabled?: boolean;
  /**
   * The `tabIndex` of the button element.
   */
  tabIndex?: number;
  /**
   * The size of the button.
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * If `true`, the button is selected.
   */
  selected?: boolean;
  /**
   * The value associated with the button.
   */
  value: unknown;
};

export type ChartBaseToggleButtonGroupProps = ChartBaseCommonProps<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
  /**
   * The value associated with the button.
   */
  value?: unknown;
  /**
   * If `true`, only one button can be selected at a time.
   */
  exclusive?: boolean;
  /**
   * The size of the button.
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Callback fired when the selected value changes.
   * @param {React.MouseEvent<HTMLElement>} event The event source of the callback.
   * @param {unknown} value The new value.
   */
  onChange?: (event: React.MouseEvent<HTMLElement>, value: unknown) => void;
};
