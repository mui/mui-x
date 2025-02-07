import { RefObject } from '@mui/x-internals/types';
import { GridStatePremium } from '../../../models/gridStatePremium';

export const gridCellSelectionStateSelector = (apiRef: RefObject<{ state: GridStatePremium }>) =>
  apiRef.current.state.cellSelection;
