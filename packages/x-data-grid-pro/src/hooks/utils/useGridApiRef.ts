import type { RefObject } from '@mui/x-internals/types';
import { useGridApiRef as useCommunityGridApiRef } from '@mui/x-data-grid';
import type { GridApiPro } from '../../models/gridApiPro';

export const useGridApiRef = useCommunityGridApiRef as () => RefObject<GridApiPro | null>;
