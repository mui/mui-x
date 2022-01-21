import {GridPinnedColumns, GridRowGroupingModel} from "../../_modules_";
import {
    GridCanBeReorderedPreProcessingContext
} from "../../_modules_/grid/hooks/features/columnReorder/columnReorderInterfaces";

export interface GridControlledStateEventLookupPro {
    rowGroupingModelChange: { params: GridRowGroupingModel };
    pinnedColumnsChange: { params: GridPinnedColumns };
}

export interface GridPreProcessingGroupLookupPro {
    canBeReordered: {
        value: boolean;
        context: GridCanBeReorderedPreProcessingContext;
    };
}

// TODO bundle split: Declare from `@mui/x-data-grid`
declare module '@mui/x-data-grid-pro' {
    interface GridControlledStateEventLookup extends GridControlledStateEventLookupPro {}

    interface GridPreProcessingGroupLookup extends GridPreProcessingGroupLookupPro {}
}
