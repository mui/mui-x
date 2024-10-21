import { useGridPrivateApiContext as useCommunityGridPrivateApiContext } from '@mui/x-data-grid/internals';
import { GridPrivateApiPremium } from '../../models/gridApiPremium';

export const useGridPrivateApiContext = useCommunityGridPrivateApiContext<GridPrivateApiPremium>;
