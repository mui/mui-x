import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { GridFilterItem } from './gridFilterItem';
import type { GridApiCommon } from './api/gridApiCommon';
import type { GridApiCommunity } from './api/gridApiCommunity';

export type GridFilterInputSlotProps = {
  size?: 'small' | 'medium';
  label?: React.ReactNode;
  placeholder?: string;
};

export type GridFilterInputValueProps<
  T extends GridFilterInputSlotProps = GridFilterInputSlotProps,
  Api extends GridApiCommon = GridApiCommunity,
> = {
  item: GridFilterItem;
  applyValue: (value: GridFilterItem) => void;
  // Is any because if typed as GridApiRef a dep cycle occurs. Same happens if ApiContext is used.
  apiRef: RefObject<Api>;
  inputRef?: React.Ref<HTMLElement | null>;
  focusElementRef?: React.Ref<any>;
  headerFilterMenu?: React.ReactNode;
  clearButton?: React.ReactNode | null;
  /**
   * It is `true` if the filter either has a value or an operator with no value
   * required is selected (for example `isEmpty`)
   */
  isFilterActive?: boolean;
  onFocus?: React.FocusEventHandler;
  onBlur?: React.FocusEventHandler;

  tabIndex?: number;
  disabled?: boolean;
  className?: string;

  slotProps?: {
    root: T;
  };
};
