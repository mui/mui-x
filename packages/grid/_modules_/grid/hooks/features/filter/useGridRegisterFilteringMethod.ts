import * as React from 'react';
import { GridFilteringMethod, GridFilteringMethodCollection } from './gridFilterState';
import { GridPreProcessingGroup, useGridRegisterPreProcessor } from '../../core/preProcessing';
import { GridApiRef } from '../../../models';

export const useGridRegisterFilteringMethod = (
  apiRef: GridApiRef,
  groupingName: string,
  filteringMethod: GridFilteringMethod,
) => {
  const updateRegistration = React.useCallback(
    (filteringMethodCollection: GridFilteringMethodCollection) => {
      filteringMethodCollection[groupingName] = filteringMethod;
      return filteringMethodCollection;
    },
    [groupingName, filteringMethod],
  );

  useGridRegisterPreProcessor(apiRef, GridPreProcessingGroup.filteringMethod, updateRegistration);
};
