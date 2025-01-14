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

export type SkeletonProps = {
  variant?: 'circular' | 'text';
  width?: number | string;
  height?: number | string;
};

// InputComponent
// variant="outlined"
// size="small"
// focusElementRef={valueRef}
// disabled={readOnly}

export type TextFieldProps = {
  autoComplete?: React.HTMLInputAutoCompleteAttribute;
  className?: string;
  color?: 'primary' | 'error';
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  helperText?: string | null;
  id?: string;
  InputProps?: {
    disabled?: boolean;
    endAdornment?: React.ReactNode;
    startAdornment?: React.ReactNode;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  };
  inputRef?: React.Ref<HTMLInputElement>;
  label?: React.ReactNode;
  onChange?: React.ChangeEventHandler;
  onKeyDown?: React.KeyboardEventHandler;
  placeholder?: string;
  size?: 'small' | 'medium';
  style?: React.CSSProperties;
  tabIndex?: number;
  type?: React.HTMLInputTypeAttribute;
  value?: string;
  variant?: 'standard' | 'outlined';
};

export type TooltipProps = {
  children: React.ReactElement<any, any>;
  enterDelay?: number;
  title: React.ReactNode;
};
