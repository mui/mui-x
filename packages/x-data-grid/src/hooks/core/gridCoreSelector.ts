import { GridApiCommunity } from '../../models/api/gridApiCommunity';

/**
 * Get the theme state
 * @category Core
 */
export const gridIsRtlSelector = (apiRef: React.RefObject<GridApiCommunity>) =>
  apiRef.current.state.isRtl;
