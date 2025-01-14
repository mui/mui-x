import { GridApiCommunity } from '../../../models/api/gridApiCommunity';

export const gridRowsMetaSelector = (apiRef: React.RefObject<GridApiCommunity>) =>
  apiRef.current.state.rowsMeta;
