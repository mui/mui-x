import type * as React from 'react';

type CommonProps<T = HTMLElement> = React.DOMAttributes<T> & {
  className?: string;
  style?: React.CSSProperties;
  [k: `aria-${string}`]: any;
  [k: `data-${string}`]: any;
};

export type IconProps = CommonProps<SVGSVGElement> & {
  titleAccess?: string;
};

export type TooltipProps = CommonProps & {
  children: React.ReactElement<any, any>;
  enterDelay?: number;
  title: React.ReactNode;
};

export type IconButtonProps = CommonProps & {
  ref?: React.Ref<HTMLButtonElement>;
};
