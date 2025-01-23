import { GridApiCommunity } from '../../../models/api/gridApiCommunity';

export const gridDimensionsSelector = (apiRef: React.RefObject<GridApiCommunity>) =>
  apiRef.current.state.dimensions;
