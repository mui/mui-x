import * as React from 'react';
import {
  useGridAriaAttributes as useGridAriaAttributesPro,
  useGridSelector,
} from '@mui/x-data-grid-pro/internals';
import { useGridPrivateApiContext } from './useGridPrivateApiContext';
import { gridRowGroupingSanitizedModelSelector } from '../features/rowGrouping/gridRowGroupingSelector';

export const useGridAriaAttributes = (): React.HTMLAttributes<HTMLElement> => {
  const ariaAttributesPro = useGridAriaAttributesPro();
  const apiRef = useGridPrivateApiContext();
  const gridRowGroupingModel = useGridSelector(apiRef, gridRowGroupingSanitizedModelSelector);

  const ariaAttributesPremium = gridRowGroupingModel.length > 0 ? { role: 'treegrid' } : {};

  return {
    ...ariaAttributesPro,
    ...ariaAttributesPremium,
  };
};
