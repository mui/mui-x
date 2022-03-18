import { useGridRootProps as useCommunityGridRootProps } from '@mui/x-data-grid';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';

export const useGridRootProps = useCommunityGridRootProps as () => DataGridPremiumProcessedProps;
