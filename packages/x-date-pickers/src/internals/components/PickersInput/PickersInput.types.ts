import { BoxProps } from '@mui/material/Box';

export interface PickersInputElement {
  container: React.HTMLAttributes<HTMLSpanElement>;
  content: React.HTMLAttributes<HTMLSpanElement>;
  before: React.HTMLAttributes<HTMLSpanElement>;
  after: React.HTMLAttributes<HTMLSpanElement>;
}

export interface PickersInputPropsUsedByField {
  /**
   * The elements to render.
   * Each element contains the prop to edit a section of the value.
   */
  elements: PickersInputElement[];
  /**
   * Is `true` if the current values equals the empty value.
   * For a single item value, it means that `value === null`
   * For a range value, it means that `value === [null, null]`
   */
  areAllSectionsEmpty: boolean;

  onClick: React.MouseEventHandler<HTMLDivElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLDivElement>;
  onInput: React.FormEventHandler<HTMLDivElement>;
  onPaste: React.ClipboardEventHandler<HTMLDivElement>;

  endAdornment?: React.ReactNode;
  startAdornment?: React.ReactNode;

  tabIndex: number | undefined;
  contentEditable: boolean;

  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;

  label?: React.ReactNode;
  id?: string;
  fullWidth?: boolean;
  readOnly?: boolean;

  inputProps?: React.HTMLAttributes<HTMLInputElement> & { ref?: React.Ref<HTMLInputElement> };
  inputRef?: React.Ref<HTMLInputElement>;

  sectionsContainerRef?: React.Ref<HTMLDivElement>;
}

export interface PickersInputProps
  extends Omit<BoxProps, keyof PickersInputPropsUsedByField>,
    PickersInputPropsUsedByField {
  ownerState?: any;
  margin?: 'dense' | 'none' | 'normal';
  renderSuffix?: (state: {
    disabled?: boolean;
    error?: boolean;
    filled?: boolean;
    focused?: boolean;
    margin?: 'dense' | 'none' | 'normal';
    required?: boolean;
    adornedStart?: boolean;
  }) => React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  /**
   * The components used for each slot inside.
   *
   * This prop is an alias for the `components` prop, which will be deprecated in the future.
   *
   * @default {}
   */
  slots?: {
    root?: React.ElementType;
    input?: React.ElementType;
  };
}

export interface PickersOutlinedInputProps extends PickersInputProps {
  notched?: boolean;
}
export interface PickersStandardInputProps extends PickersInputProps {
  disableUnderline?: boolean;
}
export interface PickersFilledInputProps extends PickersInputProps {
  disableUnderline?: boolean;
  hiddenLabel?: boolean;
}
