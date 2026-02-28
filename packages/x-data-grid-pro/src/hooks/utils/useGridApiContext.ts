import type { RefObject } from '@mui/x-internals/types';
import {
  type GridApiCommon,
  useGridApiContext as useCommunityGridApiContext,
} from '@mui/x-data-grid';
import type { GridApiPro } from '../../models/gridApiPro';

export const useGridApiContext: <Api extends GridApiCommon = GridApiPro>() => RefObject<Api> =
  useCommunityGridApiContext;
