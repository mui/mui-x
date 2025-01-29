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
   * @param {Value} option
   * @returns {string}
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
   * @returns {boolean}
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

  label?: string;
  placeholder?: string;

  slotProps?: {
    textField: TextFieldProps;
  };
};

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
