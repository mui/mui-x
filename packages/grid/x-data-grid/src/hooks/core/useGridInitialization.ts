import * as React from 'react';
import type { GridApiCommon } from '../../models/api/gridApiCommon';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

import { useGridLoggerFactory } from './useGridLoggerFactory';
import { useGridApiInitialization } from './useGridApiInitialization';
import { useGridErrorHandler } from './useGridErrorHandler';
import { useGridLocaleText } from './useGridLocaleText';
import { useGridPreProcessing } from './preProcessing';
import { useGridRowGroupsPreProcessing } from './rowGroupsPreProcessing';
import { useGridStateInitialization } from './useGridStateInitialization';

/**
 * Initialize the technical pieces of the DataGrid (logger, state, ...) that any DataGrid implementation needs
 */
export const useGridInitialization = <Api extends GridApiCommon>(
  inputApiRef: React.MutableRefObject<Api> | undefined,
  props: Pick<DataGridProcessedProps, 'signature' | 'logger' | 'logLevel' | 'error' | 'localeText'>,
) => {
  const apiRef = useGridApiInitialization(inputApiRef, props);
  useGridLoggerFactory(apiRef, props);
  useGridErrorHandler(apiRef, props);
  useGridStateInitialization(apiRef, props);
  useGridPreProcessing(apiRef);
  useGridRowGroupsPreProcessing(apiRef);
  useGridLocaleText(apiRef, props);

  return apiRef;
};
