import { useGridRootProps as useCommunityGridRootProps } from '@mui/x-data-grid/internals';
import { DataGridProProcessedProps } from '../../models/dataGridProProps';

export const useGridRootProps = useCommunityGridRootProps as () => DataGridProProcessedProps;
