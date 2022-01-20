import * as React from 'react';
import { GridFilteringMethod } from './gridFilterState';
import {
  GridPreProcessingGroup,
  GridPreProcessor,
  useGridRegisterPreProcessor,
} from '../../core/preProcessing';
import { GridApiRef } from '../../../models';

export const useGridRegisterFilteringMethod = (
  apiRef: GridApiRef,
  groupingName: string,
  filteringMethod: GridFilteringMethod,
) => {
  const updateRegistration = React.useCallback<
    GridPreProcessor<GridPreProcessingGroup.filteringMethod>
  >(
    (filteringMethodCollection) => {
      filteringMethodCollection[groupingName] = filteringMethod;
      return filteringMethodCollection;
    },
    [groupingName, filteringMethod],
  );

  useGridRegisterPreProcessor(apiRef, GridPreProcessingGroup.filteringMethod, updateRegistration);
};
