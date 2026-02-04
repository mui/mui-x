import type { RefObject } from '@mui/x-internals/types';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import type {
  GridColumnSpanningApi,
  GridColumnSpanningPrivateApi,
} from '../../../models/api/gridColumnSpanning';
import { useGridEvent } from '../../utils/useGridEvent';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';

/**
 * @requires useGridColumns (method, event)
 * @requires useGridParamsApi (method)
 */
export const useGridColumnSpanning = (apiRef: RefObject<GridPrivateApiCommunity>) => {
  const resetColSpan: GridColumnSpanningPrivateApi['resetColSpan'] = () => {
    return apiRef.current.virtualizer.api.resetColSpan();
  };
  const getCellColSpanInfo: GridColumnSpanningApi['unstable_getCellColSpanInfo'] = (...params) => {
    return apiRef.current.virtualizer.api.getCellColSpanInfo(...params);
  };
  const calculateColSpan: GridColumnSpanningPrivateApi['calculateColSpan'] = (...params) => {
    apiRef.current.virtualizer.api.calculateColSpan(...params);
  };

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
