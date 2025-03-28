type Ref<T = HTMLElement> = React.RefCallback<T | null> | React.RefObject<T | null> | null;

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

export type BadgeProps = {
  badgeContent?: React.ReactNode;
  children?: React.ReactNode;
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

export type CheckboxProps = {
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
  onClick?: React.MouseEventHandler;
  onChange?: React.ChangeEventHandler;
  onKeyDown?: React.KeyboardEventHandler;
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

export type PaginationProps = {
  count: number;
  page: number;
  rowsPerPage: number;
  rowsPerPageOptions?: readonly (number | { value: number; label: string })[];
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;

  disabled?: boolean;
};

export type PopperProps = {
  open: boolean;
  children?: React.ReactNode;
  className?: string;
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

export type InputProps = {
  ref?: React.Ref<HTMLElement>;
  inputRef?: React.Ref<HTMLInputElement>;
  className?: string;
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

export type SwitchProps = {
  checked?: boolean;
  onChange?: React.ChangeEventHandler;
  size?: 'small' | 'medium';
  label?: React.ReactNode;
  className?: string;
};

export type TextFieldProps = {
  role?: string;
  autoComplete?: string;
  autoFocus?: boolean;
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
    input?: Omit<Partial<InputProps>, 'slotProps'>;
    inputLabel?: {};
    htmlInput?: React.InputHTMLAttributes<HTMLInputElement>;
  };
  style?: React.CSSProperties;
  tabIndex?: number;
  type?: React.HTMLInputTypeAttribute;
  value?: string;
  ref?: Ref<HTMLInputElement>;
};

export type TooltipProps = {
  children: React.ReactElement<any, any>;
  enterDelay?: number;
  title: React.ReactNode;
};

export type ChipProps = {
  label: string;
  size?: 'small' | 'medium';
};
