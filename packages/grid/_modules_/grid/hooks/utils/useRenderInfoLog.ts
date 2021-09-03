import { GridApiRef } from '../../models/api/gridApiRef';
import { useLogger } from './useLogger';
import {useGridSelector} from "../features";
import {gridRenderStateSelector} from "../features/virtualization/renderingStateSelector";

/**
 * @requires useGridVirtualization (state)
 * @requires useGridNoVirtualization (state)
 */
export function useRenderInfoLog(apiRef: GridApiRef) {
  const logger = useLogger('useRenderInfoLog');

  const rendering = useGridSelector(apiRef, gridRenderStateSelector)

  if (rendering.renderContext != null) {
    const { page, firstColIdx, lastColIdx, firstRowIdx, lastRowIdx } =
      rendering.renderContext!;
    logger.info(
      `Rendering, page: ${page}, col: ${firstColIdx}-${lastColIdx}, row: ${firstRowIdx}-${lastRowIdx}`,
    );
  }
}
