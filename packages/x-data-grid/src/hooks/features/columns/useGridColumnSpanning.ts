import { RefObject } from '@mui/x-internals/types';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import {
  GridColumnSpanningApi,
  GridColumnSpanningPrivateApi,
} from '../../../models/api/gridColumnSpanning';
import { useGridEvent } from '../../utils/useGridEvent';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';

/**
 * @requires useGridColumns (method, event)
 * @requires useGridParamsApi (method)
 */
export const useGridColumnSpanning = (apiRef: RefObject<GridPrivateApiCommunity>) => {
  const virtualizer = apiRef.current.virtualizer;

  const resetColSpan: GridColumnSpanningPrivateApi['resetColSpan'] =
    virtualizer.colspan.resetColSpan;
  const getCellColSpanInfo: GridColumnSpanningApi['unstable_getCellColSpanInfo'] =
    virtualizer.colspan.getCellColSpanInfo;
  const calculateColSpan = virtualizer.colspan.calculateColSpan;

  const columnSpanningPublicApi: GridColumnSpanningApi = {
    unstable_getCellColSpanInfo: getCellColSpanInfo,
  };

  const columnSpanningPrivateApi: GridColumnSpanningPrivateApi = {
    resetColSpan,
    calculateColSpan,
  };

  useGridApiMethod(apiRef, columnSpanningPublicApi, 'public');
  useGridApiMethod(apiRef, columnSpanningPrivateApi, 'private');

  useGridEvent(apiRef, 'columnOrderChange', resetColSpan);
};
