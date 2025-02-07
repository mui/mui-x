import { RefObject } from '@mui/x-internals/types';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';

export const gridColumnMenuSelector = (apiRef: RefObject<GridApiCommunity>) =>
  apiRef.current.state.columnMenu;
