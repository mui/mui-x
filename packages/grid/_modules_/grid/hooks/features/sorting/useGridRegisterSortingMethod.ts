import * as React from 'react';
import { GridSortingMethod, GridSortingMethodCollection } from './gridSortingState';
import { GridPreProcessingGroup, useGridRegisterPreProcessor } from '../../core/preProcessing';
import { GridApiRef } from '../../../models';

export const useGridRegisterSortingMethod = (
  apiRef: GridApiRef,
  groupingName: string,
  filteringMethod: GridSortingMethod,
) => {
  const updateRegistration = React.useCallback(
    (sortingMethodCollection: GridSortingMethodCollection) => {
      sortingMethodCollection[groupingName] = filteringMethod;
      return sortingMethodCollection;
    },
    [groupingName, filteringMethod],
  );

  useGridRegisterPreProcessor(apiRef, GridPreProcessingGroup.sortingMethod, updateRegistration);
};
