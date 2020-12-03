import { FilterItem } from '../../../models/filterItem';

export interface FilterInputValueProps {
  item: FilterItem;
  applyValue: (value: FilterItem) => void;
}
