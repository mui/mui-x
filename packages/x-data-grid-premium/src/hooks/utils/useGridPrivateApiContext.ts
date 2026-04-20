import { useGridPrivateApiContext as useCommunityGridPrivateApiContext } from '@mui/x-data-grid/internals';
import type { GridPrivateApiPremium } from '../../models/gridApiPremium';

export const useGridPrivateApiContext = useCommunityGridPrivateApiContext<GridPrivateApiPremium>;
