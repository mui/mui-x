import { useGridRowAriaAttributesPro, useGridSelector } from '@mui/x-data-grid-pro/internals';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';
import { gridRowGroupingSanitizedModelSelector } from '../rowGrouping/gridRowGroupingSelector';

export const useGridRowAriaAttributesPremium = () => {
  const apiRef = useGridPrivateApiContext();
  const gridRowGroupingModel = useGridSelector(apiRef, gridRowGroupingSanitizedModelSelector);
  return useGridRowAriaAttributesPro(gridRowGroupingModel.length > 0);
};
