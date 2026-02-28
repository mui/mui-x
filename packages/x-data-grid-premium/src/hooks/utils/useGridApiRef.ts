import type { RefObject } from '@mui/x-internals/types';
import { useGridApiRef as useCommunityGridApiRef } from '@mui/x-data-grid';
import type { GridApiPremium } from '../../models/gridApiPremium';

export const useGridApiRef = useCommunityGridApiRef as () => RefObject<GridApiPremium | null>;
