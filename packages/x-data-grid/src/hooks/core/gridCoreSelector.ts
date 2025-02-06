import { RefObject } from '@mui/x-internals/types';
import { GridApiCommunity } from '../../models/api/gridApiCommunity';

/**
 * Get the theme state
 * @category Core
 */
export const gridIsRtlSelector = (apiRef: RefObject<GridApiCommunity>) =>
  apiRef.current.state.isRtl;
