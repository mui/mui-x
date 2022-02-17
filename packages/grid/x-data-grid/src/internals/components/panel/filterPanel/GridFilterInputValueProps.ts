import * as React from 'react';
import { GridFilterItem } from '../../../models/gridFilterItem';

export interface GridFilterInputValueProps {
  item: GridFilterItem;
  applyValue: (value: GridFilterItem) => void;
  // Is any because if typed as GridApiRef a dep cycle occurs. Same happens if ApiContext is used.
  apiRef: any;
  focusElementRef?: React.Ref<any>;
}
