type Ref<T = HTMLElement> = React.RefCallback<T | null> | React.RefObject<T | null> | null;

type CommonProps<T = HTMLElement> = React.DOMAttributes<T> & {
  className?: string;
  style?: React.CSSProperties;
  [k: `aria-${string}`]: any;
  [k: `data-${string}`]: any;
};

export interface AutocompleteFilterOptionsState<Value> {
  inputValue: string;
  getOptionLabel: (option: Value) => string;
}

type AcValueMap<FreeSolo> = FreeSolo extends true ? string : never;
type AcValue<Value, Multiple, DisableClearable, FreeSolo> = Multiple extends true
  ? Array<Value | AcValueMap<FreeSolo>>
  : DisableClearable extends true
    ? NonNullable<Value | AcValueMap<FreeSolo>>
    : Value | null | AcValueMap<FreeSolo>;

export type AutocompleteProps<
  Value = string,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false,
  FreeSolo extends boolean = false,
> = {
  id?: string;
  /** Allow multiple selection. */
  multiple?: Multiple;
  /** Allow to add new options. */
  freeSolo?: FreeSolo;
  value?: AcValue<Value, Multiple, DisableClearable, FreeSolo>;
  options: ReadonlyArray<Value>;
  /**
   * Used to determine the string value for a given option.
   * It's used to fill the input (and the list box options if `renderOption` is not provided).
   *
   * If used in free solo mode, it must accept both the type of the options and a string.
   *
   * @param {Value} option The option
   * @returns {string} The label
   * @default (option) => option.label ?? option
   */
  getOptionLabel?: (option: Value | AcValueMap<FreeSolo>) => string;
  /**
   * Used to determine if the option represents the given value.
   * Uses strict equality by default.
   * ⚠️ Both arguments need to be handled, an option can only match with one value.
   *
   * @param {Value} option The option to test.
   * @param {Value} value The value to test against.
   * @returns {boolean} true if value matches
   */
  isOptionEqualToValue?: (option: Value, value: Value) => boolean;
  /**
   * Callback fired when the value changes.
   *
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {Value|Value[]} value The new value of the component.
   */
  onChange?: (
    event: React.SyntheticEvent,
    value: AcValue<Value, Multiple, DisableClearable, FreeSolo>,
  ) => void;
  /**
   * Callback fired when the input value changes.
   *
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {string} value The new value of the input.
   */
  onInputChange?: (event: React.SyntheticEvent, value: string) => void;

  /* New props */

  label?: React.ReactNode;
  placeholder?: string;

  slotProps?: {
    textField: TextFieldProps;
  };
};

export type BadgeProps = CommonProps & {
  badgeContent?: React.ReactNode;
  children: React.ReactNode;
  color?: 'primary' | 'default' | 'error';
  invisible?: boolean;
  overlap?: 'circular';
  variant?: 'dot';
  style?: React.CSSProperties;
};

export type ButtonProps = CommonProps & {
  ref?: Ref<HTMLButtonElement>;
  children?: React.ReactNode;
  disabled?: boolean;
  id?: string;
  role?: string;
  size?: 'small' | 'medium' | 'large';
  startIcon?: React.ReactNode;
  tabIndex?: number;
  title?: string;
  touchRippleRef?: any; // FIXME(v8:romgrk): find a way to remove
};

export type CheckboxProps = CommonProps & {
  ref?: Ref<HTMLButtonElement>;
  id?: string;
  autoFocus?: boolean;
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  indeterminate?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  name?: string;
  label?: React.ReactNode;
  onChange?: React.ChangeEventHandler;
  size?: 'small' | 'medium';
  density?: 'standard' | 'compact';
  slotProps?: {
    htmlInput?: React.InputHTMLAttributes<HTMLInputElement>;
  };
  style?: React.CSSProperties;
  tabIndex?: number;
  touchRippleRef?: any; // FIXME(v8:romgrk): find a way to remove
};

export type IconButtonProps = Omit<ButtonProps, 'startIcon'> & {
  label?: string;
  color?: 'default' | 'inherit' | 'primary';
  edge?: 'start' | 'end' | false;
};

export type DividerProps = {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
};

export type MenuListProps = CommonProps & {
  ref?: Ref<HTMLUListElement>;
  id?: string;
  children?: React.ReactNode;
  autoFocus?: boolean;
  autoFocusItem?: boolean;
};

export type MenuItemProps = CommonProps & {
  autoFocus?: boolean;
  children?: React.ReactNode;
  /** For items that aren't interactive themselves (but may contain an interactive widget) */
  inert?: boolean;
  disabled?: boolean;
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

export type PaginationProps = CommonProps & {
  count: number;
  page: number;
  rowsPerPage: number;
  rowsPerPageOptions?: readonly (number | { value: number; label: string })[];
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;

  disabled?: boolean;
};

export type PopperProps = CommonProps & {
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
  ref?: Ref;
  target?: Element | null;
  transition?: boolean;
  /** @default 'bottom' */
  placement?: Placement;
};

export type CircularProgressProps = CommonProps & {
  /**
   * Pixels or CSS value.
   * @default 40
   */
  size?: number | string;
  /** @default 'primary' */
  color?: 'inherit' | 'primary';
};

export type LinearProgressProps = CommonProps & {};

export type InputProps = CommonProps & {
  ref?: React.Ref<HTMLElement>;
  inputRef?: React.Ref<HTMLInputElement>;
  fullWidth?: boolean;
  type?: React.HTMLInputTypeAttribute;
  value?: string;
  onChange: React.ChangeEventHandler;
  disabled?: boolean;
  endAdornment?: React.ReactNode;
  startAdornment?: React.ReactNode;
  slotProps?: {
    htmlInput?: React.InputHTMLAttributes<HTMLInputElement>;
  };
};

export type SelectProps = CommonProps & {
  ref?: Ref;
  id?: string;
  value?: any;
  open?: boolean;
  error?: boolean;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler;
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
  children?: React.ReactNode;
};

export type SelectOptionProps = CommonProps & {
  native: boolean;
  value: any;
  children?: React.ReactNode;
};

export type SkeletonProps = CommonProps & {
  variant?: 'circular' | 'text';
  width?: number | string;
  height?: number | string;
};

export type SwitchProps = CommonProps & {
  checked?: boolean;
  onChange?: React.ChangeEventHandler;
  size?: 'small' | 'medium';
};

export type TextFieldProps = CommonProps & {
  role?: string;
  autoComplete?: string;
  color?: 'primary' | 'error';
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  helperText?: string | null;
  id?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  label?: React.ReactNode;
  onChange?: React.ChangeEventHandler;
  placeholder?: string;
  size?: 'small' | 'medium';
  slotProps?: {
    input?: Omit<Partial<InputProps>, 'slotProps'>;
    inputLabel?: {};
    htmlInput?: React.InputHTMLAttributes<HTMLInputElement>;
  };
  tabIndex?: number;
  type?: React.HTMLInputTypeAttribute;
  value?: string;
  ref?: Ref<HTMLInputElement>;
};

export type TooltipProps = CommonProps & {
  children: React.ReactElement<any, any>;
  enterDelay?: number;
  title: React.ReactNode;
};
