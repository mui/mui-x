import { GridApiRef } from '../../models/api/gridApiRef';
import { useGridState } from '../features/core/useGridState';
import { Logger } from './useLogger';

export function useRenderInfoLog(apiRef: GridApiRef, logger: Logger) {
  const [gridState] = useGridState(apiRef);

  if (gridState.rendering.renderContext != null) {
    const { page, firstColIdx, lastColIdx, firstRowIdx, lastRowIdx } =
      gridState.rendering.renderContext!;
    logger.info(
      `Rendering, page: ${page}, col: ${firstColIdx}-${lastColIdx}, row: ${firstRowIdx}-${lastRowIdx}`,
    );
  }
}
