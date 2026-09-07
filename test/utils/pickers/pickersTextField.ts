import type { PickersTextFieldProps } from '@mui/x-date-pickers/PickersTextField';

/**
 * The props `PickersTextField` requires from the field hook rendering it.
 */
export type PickersTextFieldPropsFromField = Pick<
  PickersTextFieldProps,
  | 'areAllSectionsEmpty'
  | 'contentEditable'
  | 'elements'
  | 'sectionListRef'
  | 'value'
  | 'onChange'
  | 'onClick'
  | 'onMouseDown'
  | 'onKeyDown'
  | 'onInput'
  | 'onPaste'
  | 'onFocus'
  | 'onBlur'
  | 'disabled'
  | 'error'
>;

/**
 * Stub for the props `PickersTextField` requires from its field, so that tests rendering it
 * standalone stay type-checked instead of opting out with `as any`.
 */
export const PICKERS_TEXT_FIELD_STUB_PROPS: PickersTextFieldPropsFromField = {
  areAllSectionsEmpty: true,
  contentEditable: false,
  elements: [
    {
      after: { children: null },
      before: { children: null },
      container: { children: null },
      content: { children: null, 'data-range-position': 'start' },
    },
  ],
  sectionListRef: null,
  value: '',
  onChange: () => {},
  onClick: () => {},
  onMouseDown: () => {},
  onKeyDown: () => {},
  onInput: () => {},
  onPaste: () => {},
  onFocus: () => {},
  onBlur: () => {},
  disabled: false,
  error: false,
};
