import { RefObject } from '@mui/x-internals/types';
import { GridApiPremium } from '../../../models/gridApiPremium';

export const gridCellSelectionStateSelector = (apiRef: RefObject<GridApiPremium>) =>
  apiRef.current.state.cellSelection;
