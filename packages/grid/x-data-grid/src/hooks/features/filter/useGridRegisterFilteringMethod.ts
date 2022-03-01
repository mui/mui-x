import * as React from 'react';
import { GridFilteringMethod } from './gridFilterState';
import { GridPreProcessor, useGridRegisterPreProcessor } from '../../core/preProcessing';
import { GridApiCommon } from '../../../models';

export const useGridRegisterFilteringMethod = <Api extends GridApiCommon>(
  apiRef: React.MutableRefObject<Api>,
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
