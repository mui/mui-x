import { useGridRootProps as useCommunityGridRootProps } from '@mui/x-data-grid';
import { DataGridProProcessedProps } from '../../models/dataGridProProps';

export const useGridRootProps = useCommunityGridRootProps as () => DataGridProProcessedProps;
