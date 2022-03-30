import * as React from 'react';
import type { GridApiCommon } from '../../models/api/gridApiCommon';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

import { useGridLoggerFactory } from './useGridLoggerFactory';
import { useGridApiInitialization } from './useGridApiInitialization';
import { useGridErrorHandler } from './useGridErrorHandler';
import { useGridLocaleText } from './useGridLocaleText';
import { useGridPipeProcessing } from './pipeProcessing';
import { useGridStrategyProcessing } from './strategyProcessing';
import { useGridStateInitialization } from './useGridStateInitialization';

/**
 * Initialize the technical pieces of the DataGrid (logger, state, ...) that any DataGrid implementation needs
 */
export const useGridInitialization = <Api extends GridApiCommon>(
  inputApiRef: React.MutableRefObject<Api> | undefined,
  props: Pick<DataGridProcessedProps, 'signature' | 'logger' | 'logLevel' | 'error' | 'localeText'>,
) => {
  const { publicApiRef, internalApiRef } = useGridApiInitialization(inputApiRef, props);
  useGridLoggerFactory(internalApiRef, props);
  useGridErrorHandler(internalApiRef, props);
  useGridStateInitialization(internalApiRef, props);
  useGridPipeProcessing(internalApiRef);
  useGridStrategyProcessing(internalApiRef);
  useGridLocaleText(internalApiRef, props);

  return { publicApiRef, internalApiRef };
};
