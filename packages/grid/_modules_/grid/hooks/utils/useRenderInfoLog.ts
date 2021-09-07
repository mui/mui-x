import { GridApiRef } from '../../models/api/gridApiRef';
import { useGridLogger } from './useGridLogger';
import { useGridSelector } from '../features';
import { gridRenderingSelector } from '../features/virtualization/renderingStateSelector';

/**
 * @requires useGridVirtualization (state)
 * @requires useGridNoVirtualization (state)
 */
export function useRenderInfoLog(apiRef: GridApiRef) {
  const logger = useGridLogger(apiRef, 'useRenderInfoLog');

  const rendering = useGridSelector(apiRef, gridRenderingSelector);

  if (rendering.renderContext != null) {
    const { page, firstColIdx, lastColIdx, firstRowIdx, lastRowIdx } = rendering.renderContext!;
    logger.info(
      `Rendering, page: ${page}, col: ${firstColIdx}-${lastColIdx}, row: ${firstRowIdx}-${lastRowIdx}`,
    );
  }
}
