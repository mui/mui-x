import {
    GridApiCommon,
    GridApiRef,
    useGridApiRef as useCommunityGridApiRef
} from '@mui/x-data-grid';
import {GridApiPro} from "../../models";

export const useGridApiRef = useCommunityGridApiRef as <
    Api extends GridApiCommon = GridApiPro,
    >() => GridApiRef<Api>;
