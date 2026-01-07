import { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiCommon } from '../../models/api/gridApiCommon';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { useGridRefs } from './useGridRefs';
import { useGridIsRtl } from './useGridIsRtl';
import { useGridLoggerFactory } from './useGridLoggerFactory';
import { useGridLocaleText } from './useGridLocaleText';
import { useGridPipeProcessing } from './pipeProcessing';
import { useGridStrategyProcessing } from './strategyProcessing';
import { useGridStateInitialization } from './useGridStateInitialization';
import { useGridProps } from './useGridProps';

/**
 * Initialize the technical pieces of the DataGrid (logger, state, ...) that any DataGrid implementation needs
 */
export const useGridInitialization = <PrivateApi extends GridPrivateApiCommon>(
  privateApiRef: RefObject<PrivateApi>,
  props: Pick<
    DataGridProcessedProps,
    | 'getRowId'
    | 'listView'
    | 'isCellEditable'
    | 'isRowSelectable'
    | 'logger'
    | 'logLevel'
    | 'localeText'
  >,
) => {
  const { getRowId, listView, isCellEditable, isRowSelectable, logger, logLevel, localeText } =
    props;

  useGridRefs(privateApiRef);
  useGridProps(privateApiRef, { getRowId, listView, isCellEditable, isRowSelectable });
  useGridIsRtl(privateApiRef);
  useGridLoggerFactory(privateApiRef, { logger, logLevel });
  useGridStateInitialization(privateApiRef);
  useGridPipeProcessing(privateApiRef);
  useGridStrategyProcessing(privateApiRef);
  useGridLocaleText(privateApiRef, { localeText });
};
