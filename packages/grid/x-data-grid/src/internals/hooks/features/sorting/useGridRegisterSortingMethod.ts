import * as React from 'react';
import { GridSortingMethod } from './gridSortingState';
import { GridPreProcessor, useGridRegisterPreProcessor } from '../../core/preProcessing';
import { GridApiCommon } from '../../../models';

export const useGridRegisterSortingMethod = <Api extends GridApiCommon>(
  apiRef: React.MutableRefObject<Api>,
  groupingName: string,
  filteringMethod: GridSortingMethod,
) => {
  const updateRegistration = React.useCallback<GridPreProcessor<'sortingMethod'>>(
    (sortingMethodCollection) => {
      sortingMethodCollection[groupingName] = filteringMethod;
      return sortingMethodCollection;
    },
    [groupingName, filteringMethod],
  );

  useGridRegisterPreProcessor(apiRef, 'sortingMethod', updateRegistration);
};
