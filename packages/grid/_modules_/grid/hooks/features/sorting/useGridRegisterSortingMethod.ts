import * as React from 'react';
import { GridSortingMethod } from './gridSortingState';
import {
  GridPreProcessingGroup,
  GridPreProcessor,
  useGridRegisterPreProcessor,
} from '../../core/preProcessing';
import { GridApiRef } from '../../../models';

export const useGridRegisterSortingMethod = (
  apiRef: GridApiRef,
  groupingName: string,
  filteringMethod: GridSortingMethod,
) => {
  const updateRegistration = React.useCallback<
    GridPreProcessor<GridPreProcessingGroup.sortingMethod>
  >(
    (sortingMethodCollection) => {
      sortingMethodCollection[groupingName] = filteringMethod;
      return sortingMethodCollection;
    },
    [groupingName, filteringMethod],
  );

  useGridRegisterPreProcessor(apiRef, GridPreProcessingGroup.sortingMethod, updateRegistration);
};
