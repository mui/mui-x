import type * as React from 'react';

export type ChartBaseCommonProps<T = HTMLElement> = React.DOMAttributes<T> & {
  className?: string;
  style?: React.CSSProperties;
  [k: `aria-${string}`]: any;
  [k: `data-${string}`]: any;
};

export type ChartBaseIconProps = ChartBaseCommonProps<SVGSVGElement> & {
  titleAccess?: string;
  fontSize?: 'small' | 'medium' | 'large' | 'inherit';
};

export type ChartBaseButtonProps = ChartBaseCommonProps & {
  ref?: React.Ref<HTMLButtonElement>;
  id?: string;
  disabled?: boolean;
  tabIndex?: number;
  size?: 'small' | 'medium' | 'large';
};

export type ChartBaseIconButtonProps = ChartBaseCommonProps & {
  ref?: React.Ref<HTMLButtonElement>;
  id?: string;
  disabled?: boolean;
  tabIndex?: number;
  size?: 'small' | 'medium' | 'large';
};

export type ChartBaseToggleButtonProps = ChartBaseCommonProps & {
  ref?: React.Ref<HTMLButtonElement>;
  id?: string;
  disabled?: boolean;
  tabIndex?: number;
  size?: 'small' | 'medium' | 'large';
  selected?: boolean;
  value: unknown;
};

export type ChartBaseToggleButtonGroupProps = ChartBaseCommonProps<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
  value?: unknown;
  exclusive?: boolean;
  size?: 'small' | 'medium' | 'large';
  onChange?: (event: React.MouseEvent<HTMLElement>, value: unknown) => void;
};
