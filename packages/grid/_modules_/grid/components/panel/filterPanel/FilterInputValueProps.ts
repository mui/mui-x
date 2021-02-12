import { FilterItem } from '../../../models/filterItem';

export interface FilterInputValueProps {
  item: FilterItem;
  applyValue: (value: FilterItem) => void;
  // Is any because if typed as ApiRef a dep cycle occurs. Same happens if ApiContext is used.
  apiRef: any;
}
