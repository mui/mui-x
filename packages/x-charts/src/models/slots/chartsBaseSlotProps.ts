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
};

export type ChartBaseIconButtonProps = ChartBaseCommonProps & {
  ref?: React.Ref<HTMLButtonElement>;
  id?: string;
  disabled?: boolean;
  tabIndex?: number;
};

export type ChartBaseDividerProps = ChartBaseCommonProps & {
  ref?: React.Ref<HTMLHRElement>;
  orientation?: 'horizontal' | 'vertical';
};
