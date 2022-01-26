import {
  GridApiCommon,
  GridApiRef,
  useGridApiContext as useCommunityGridApiContext,
} from '@mui/x-data-grid';
import { GridApiPro } from '../../models';

export const useGridApiContext = useCommunityGridApiContext as <
  GridApi extends GridApiCommon = GridApiPro,
>() => GridApiRef<GridApi>;
