import * as React from 'react';
import { GridFilteringMethod } from './gridFilterState';
import { GridPreProcessor, useGridRegisterPreProcessor } from '../../core/preProcessing';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';

export const useGridRegisterFilteringMethod = (
  apiRef: React.MutableRefObject<GridApiCommunity>,
  groupingName: string,
  filteringMethod: GridFilteringMethod,
) => {
  const updateRegistration = React.useCallback<GridPreProcessor<'filteringMethod'>>(
    (filteringMethodCollection) => {
      filteringMethodCollection[groupingName] = filteringMethod;
      return filteringMethodCollection;
    },
    [groupingName, filteringMethod],
  );

  useGridRegisterPreProcessor(apiRef, 'filteringMethod', updateRegistration);
};
