import * as React from 'react';
import { TextFieldProps } from '@mui/material/TextField';
import { GridFilterItem } from '../../../models/gridFilterItem';

export type GridFilterInputValueProps<T> = {
  item: GridFilterItem;
  applyValue: (value: GridFilterItem) => void;
  // Is any because if typed as GridApiRef a dep cycle occurs. Same happens if ApiContext is used.
  apiRef: React.MutableRefObject<T>;
  focusElementRef?: React.Ref<any>;
} & Pick<TextFieldProps, 'color' | 'error' | 'helperText' | 'size' | 'variant'> &
  any;
