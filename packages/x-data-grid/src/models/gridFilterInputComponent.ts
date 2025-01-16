import * as React from 'react';
import { TextFieldProps } from './gridBaseSlots';
import { GridFilterItem } from './gridFilterItem';
import type { GridApiCommon } from './api/gridApiCommon';
import type { GridApiCommunity } from './api/gridApiCommunity';

export type GridFilterInputValueProps<Api extends GridApiCommon = GridApiCommunity> = {
  item: GridFilterItem;
  applyValue: (value: GridFilterItem) => void;
  // Is any because if typed as GridApiRef a dep cycle occurs. Same happens if ApiContext is used.
  apiRef: React.RefObject<Api>;
  inputRef?: React.Ref<any>;
  focusElementRef?: React.Ref<any>;
  clearButton?: React.ReactNode | null;
  /**
   * It is `true` if the filter either has a value or an operator with no value
   * required is selected (for example `isEmpty`)
   */
  isFilterActive?: boolean;
  onFocus?: React.FocusEventHandler;
  onBlur?: React.FocusEventHandler;
} & Pick<
  TextFieldProps,
  | 'color'
  | 'error'
  | 'helperText'
  | 'size'
  | 'variant'
  | 'disabled'
  | 'label'
  | 'placeholder'
  | 'tabIndex'
>;
