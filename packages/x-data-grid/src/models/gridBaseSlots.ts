type Ref<T = HTMLElement> = React.RefCallback<T | null> | React.RefObject<T | null> | null;

export type BadgeProps = {
  badgeContent?: React.ReactNode;
  children: React.ReactNode;
  color?: 'primary' | 'default' | 'error';
  invisible?: boolean;
  overlap?: 'circular';
  variant?: 'dot';
  style?: React.CSSProperties;
};

export type ButtonProps = {
  ref?: Ref;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  id?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
  role?: string;
  size?: 'small' | 'medium' | 'large';
  startIcon?: React.ReactNode;
  style?: React.CSSProperties;
  tabIndex?: number;
  title?: string;
  touchRippleRef?: any; // FIXME(v8:romgrk): find a way to remove
};

export type IconButtonProps = Omit<ButtonProps, 'startIcon'> & {
  label?: string;
  color?: 'default' | 'inherit' | 'primary';
  edge?: 'start' | 'end' | false;
};

export type DividerProps = {};

export type MenuListProps = {
  ref?: Ref<HTMLUListElement>;
  id?: string;
  className?: string;
  children?: React.ReactNode;
  autoFocus?: boolean;
  autoFocusItem?: boolean;
  onKeyDown?: React.KeyboardEventHandler;
};

export type MenuItemProps = {
  autoFocus?: boolean;
  children?: React.ReactNode;
  /** For items that aren't interactive themselves (but may contain an interactive widget) */
  inert?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  selected?: boolean;
  value?: number | string | readonly string[];
  style?: React.CSSProperties;
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
type Placement = AutoPlacement | BasePlacement | VariationPlacement;

type ClickAwayMouseEventHandler =
  | 'onClick'
  | 'onMouseDown'
  | 'onMouseUp'
  | 'onPointerDown'
  | 'onPointerUp';
type ClickAwayTouchEventHandler = 'onTouchStart' | 'onTouchEnd';

export type PopperProps = {
  open: boolean;
  children?: React.ReactNode;
  className?: string;
  clickAwayTouchEvent?: false | ClickAwayTouchEventHandler;
  clickAwayMouseEvent?: false | ClickAwayMouseEventHandler;
  flip?: boolean;
  focusTrap?: boolean;
  focusTrapEnabled?: boolean;
  onExited?: (node: HTMLElement | null) => void;
  onClickAway?: (event: MouseEvent | TouchEvent) => void;
  onDidShow?: () => void;
  onDidHide?: () => void;
  id?: string;
  ref?: Ref;
  target?: Element | null;
  transition?: boolean;
  /** @default 'bottom' */
  placement?: Placement;
};

export type CircularProgressProps = {
  /**
   * Pixels or CSS value.
   * @default 40
   */
  size?: number | string;
  /** @default 'primary' */
  color?: 'inherit' | 'primary';
};

export type LinearProgressProps = {};

export type SelectProps = {
  ref?: Ref;
  id?: string;
  value?: any;
  open?: boolean;
  error?: boolean;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler;
  onFocus?: React.FocusEventHandler;
  onBlur?: React.FocusEventHandler;
  onKeyDown?: React.KeyboardEventHandler;
  onOpen?: (event: React.SyntheticEvent) => void;
  onClose?: (
    event: React.KeyboardEvent,
    reason: 'backdropClick' | 'escapeKeyDown' | 'tabKeyDown',
  ) => void;
  label?: React.ReactNode;
  labelId?: string;
  native?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  slotProps?: {
    htmlInput?: { ref?: Ref } & React.InputHTMLAttributes<HTMLInputElement>;
  };
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export type SelectOptionProps = {
  native: boolean;
  value: any;
  children?: React.ReactNode;
};

export type SkeletonProps = {
  variant?: 'circular' | 'text';
  width?: number | string;
  height?: number | string;
};

export type TextFieldProps = {
  autoComplete?: string;
  className?: string;
  color?: 'primary' | 'error';
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  helperText?: string | null;
  id?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  label?: React.ReactNode;
  onChange?: React.ChangeEventHandler;
  onKeyDown?: React.KeyboardEventHandler;
  placeholder?: string;
  size?: 'small' | 'medium';
  slotProps?: {
    input?: {
      disabled?: boolean;
      endAdornment?: React.ReactNode;
      startAdornment?: React.ReactNode;
    };
    inputLabel?: {};
    htmlInput?: React.InputHTMLAttributes<HTMLInputElement>;
  };
  style?: React.CSSProperties;
  tabIndex?: number;
  type?: React.HTMLInputTypeAttribute;
  value?: string;
};

export type TooltipProps = {
  children: React.ReactElement<any, any>;
  enterDelay?: number;
  title: React.ReactNode;
};
