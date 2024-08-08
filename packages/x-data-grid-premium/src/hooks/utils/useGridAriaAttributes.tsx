import * as React from 'react';
import {
  useGridAriaAttributes as useGridAriaAttributesPro,
  useGridSelector,
} from '@mui/x-data-grid-pro/internals';
import { gridRowGroupingSanitizedModelSelector } from '../features/rowGrouping/gridRowGroupingSelector';
import { useGridPrivateApiContext } from './useGridPrivateApiContext';
import { useGridRootProps } from './useGridRootProps';

export const useGridAriaAttributes = (): React.HTMLAttributes<HTMLElement> => {
  const rootProps = useGridRootProps();
  const ariaAttributesPro = useGridAriaAttributesPro();
  const apiRef = useGridPrivateApiContext();
  const gridRowGroupingModel = useGridSelector(apiRef, gridRowGroupingSanitizedModelSelector);

  const ariaAttributesPremium =
    rootProps.experimentalFeatures?.ariaV8 && gridRowGroupingModel.length > 0
      ? { role: 'treegrid' }
      : {};

  return {
    ...ariaAttributesPro,
    ...ariaAttributesPremium,
  };
};
