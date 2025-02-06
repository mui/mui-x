import { RefObject } from '@mui/x-internals/types';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';

export const gridRowsMetaSelector = (apiRef: RefObject<GridApiCommunity>) =>
  apiRef.current.state.rowsMeta;
