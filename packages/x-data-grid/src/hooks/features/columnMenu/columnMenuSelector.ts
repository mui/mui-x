import { GridApiCommunity } from '../../../models/api/gridApiCommunity';

export const gridColumnMenuSelector = (apiRef: React.RefObject<GridApiCommunity>) =>
  apiRef.current.state.columnMenu;
