import { useGridRootProps as useCommunityGridRootProps } from '@mui/x-data-grid-pro';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';

export const useGridRootProps = useCommunityGridRootProps as () => DataGridPremiumProcessedProps;
