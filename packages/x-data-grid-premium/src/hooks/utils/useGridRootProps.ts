import { useGridRootProps as useCommunityGridRootProps } from '@mui/x-data-grid-pro';
import type { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';

export const useGridRootProps = useCommunityGridRootProps as () => DataGridPremiumProcessedProps;
