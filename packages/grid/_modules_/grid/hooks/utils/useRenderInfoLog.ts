import { GridApiRef } from '../../models/api/gridApiRef';
import { useGridState } from '../features/core/useGridState';
import { useLogger } from './useLogger';

/**
 * @requires useGridVirtualRows (state)
 */
export function useRenderInfoLog(apiRef: GridApiRef) {
  const [gridState] = useGridState(apiRef);
  const logger = useLogger('useRenderInfoLog');

  if (gridState.rendering.renderContext != null) {
    const { page, firstColIdx, lastColIdx, firstRowIdx, lastRowIdx } =
      gridState.rendering.renderContext!;
    logger.info(
      `Rendering, page: ${page}, col: ${firstColIdx}-${lastColIdx}, row: ${firstRowIdx}-${lastRowIdx}`,
    );
  }
}
