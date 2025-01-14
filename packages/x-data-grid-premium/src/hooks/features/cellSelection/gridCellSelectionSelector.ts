import { GridApiPremium } from '../../../models/gridApiPremium';

export const gridCellSelectionStateSelector = (apiRef: React.RefObject<GridApiPremium>) =>
  apiRef.current.state.cellSelection;
