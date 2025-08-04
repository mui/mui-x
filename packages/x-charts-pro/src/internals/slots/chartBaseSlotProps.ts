import type * as React from 'react';
import { ChartBaseCommonProps } from '@mui/x-charts/models';

export type ChartBaseTooltipProps = ChartBaseCommonProps & {
  children: React.ReactElement<any, any>;
  enterDelay?: number;
  title: React.ReactNode;
  disableInteractive?: boolean;
};

type BasePlacement = 'top' | 'bottom' | 'left' | 'right';
type VariationPlacement =
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'right-start'
  | 'right-end'
  | 'left-start'
  | 'left-end';
type AutoPlacement = 'auto' | 'auto-start' | 'auto-end';
export type Placement = AutoPlacement | BasePlacement | VariationPlacement;

type ClickAwayMouseEventHandler =
  | 'onClick'
  | 'onMouseDown'
  | 'onMouseUp'
  | 'onPointerDown'
  | 'onPointerUp';
type ClickAwayTouchEventHandler = 'onTouchStart' | 'onTouchEnd';

export type ChartBasePopperProps = ChartBaseCommonProps & {
  ref?: React.Ref<HTMLDivElement>;
  open: boolean;
  children?: React.ReactNode;
  clickAwayTouchEvent?: false | ClickAwayTouchEventHandler;
  clickAwayMouseEvent?: false | ClickAwayMouseEventHandler;
  flip?: boolean;
  focusTrap?: boolean;
  onExited?: (node: HTMLElement | null) => void;
  onClickAway?: (event: MouseEvent | TouchEvent) => void;
  onDidShow?: () => void;
  onDidHide?: () => void;
  id?: string;
  target?: Element | null;
  transition?: boolean;
  /** @default 'bottom' */
  placement?: Placement;
};

export type ChartBaseMenuListProps = ChartBaseCommonProps & {
  ref?: React.Ref<HTMLUListElement>;
  id?: string;
  children?: React.ReactNode;
  autoFocus?: boolean;
  autoFocusItem?: boolean;
};

export type ChartBaseMenuItemProps = ChartBaseCommonProps & {
  autoFocus?: boolean;
  children?: React.ReactNode;
  /** For items that aren't interactive themselves (but may contain an interactive widget) */
  inert?: boolean;
  dense?: boolean;
  disabled?: boolean;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  selected?: boolean;
  value?: number | string | readonly string[];
  style?: React.CSSProperties;
};

export type ChartBaseDividerProps = ChartBaseCommonProps & {
  ref?: React.Ref<HTMLHRElement>;
  orientation?: 'horizontal' | 'vertical';
};
