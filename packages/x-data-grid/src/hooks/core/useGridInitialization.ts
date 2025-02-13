import { RefObject } from '@mui/x-internals/types';
import type { GridApiCommon, GridPrivateApiCommon } from '../../models/api/gridApiCommon';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { useGridRefs } from './useGridRefs';
import { useGridIsRtl } from './useGridIsRtl';
import { useGridLoggerFactory } from './useGridLoggerFactory';
import { useGridApiInitialization } from './useGridApiInitialization';
import { useGridLocaleText } from './useGridLocaleText';
import { useGridPipeProcessing } from './pipeProcessing';
import { useGridStrategyProcessing } from './strategyProcessing';
import { useGridStateInitialization } from './useGridStateInitialization';
import { useGridProps } from './useGridProps';

/**
 * Initialize the technical pieces of the DataGrid (logger, state, ...) that any DataGrid implementation needs
 */
export const useGridInitialization = <
  PrivateApi extends GridPrivateApiCommon,
  Api extends GridApiCommon,
>(
  inputApiRef: RefObject<Api | null> | undefined,
  props: DataGridProcessedProps,
) => {
  const privateApiRef = useGridApiInitialization<PrivateApi, Api>(inputApiRef, props);

  useGridRefs(privateApiRef);
  useGridProps(privateApiRef, props);
  useGridIsRtl(privateApiRef);
  useGridLoggerFactory(privateApiRef, props);
  useGridStateInitialization(privateApiRef);
  useGridPipeProcessing(privateApiRef);
  useGridStrategyProcessing(privateApiRef);
  useGridLocaleText(privateApiRef, props);

  privateApiRef.current.register('private', { rootProps: props });

  return privateApiRef;
};
