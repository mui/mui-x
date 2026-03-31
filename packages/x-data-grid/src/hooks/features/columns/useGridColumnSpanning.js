import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridEvent } from '../../utils/useGridEvent';
/**
 * @requires useGridColumns (method, event)
 * @requires useGridParamsApi (method)
 */
export const useGridColumnSpanning = (apiRef) => {
    const resetColSpan = () => {
        return apiRef.current.virtualizer.api.resetColSpan();
    };
    const getCellColSpanInfo = (...params) => {
        return apiRef.current.virtualizer.api.getCellColSpanInfo(...params);
    };
    const calculateColSpan = (...params) => {
        apiRef.current.virtualizer.api.calculateColSpan(...params);
    };
    const columnSpanningPublicApi = {
        unstable_getCellColSpanInfo: getCellColSpanInfo,
    };
    const columnSpanningPrivateApi = {
        resetColSpan,
        calculateColSpan,
    };
    useGridApiMethod(apiRef, columnSpanningPublicApi, 'public');
    useGridApiMethod(apiRef, columnSpanningPrivateApi, 'private');
    useGridEvent(apiRef, 'columnOrderChange', resetColSpan);
};
