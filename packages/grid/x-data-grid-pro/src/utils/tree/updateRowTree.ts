import {GridRowId, GridRowTreeConfig} from "@mui/x-data-grid";
import {GridRowTreeCreationParams, GridRowsPartialUpdates} from "@mui/x-data-grid/internals";
import { RowTreeBuilderGroupingCriteria, TempGridGroupNode } from './models'

interface UpdateRowTreeParams extends Omit<GridRowTreeCreationParams, 'previousTree' | 'partialUpdates'> {
    previousTree: GridRowTreeConfig
    partialUpdates: GridRowsPartialUpdates
    rows: { id: GridRowId; path: RowTreeBuilderGroupingCriteria[] }[];
    defaultGroupingExpansionDepth: number;
    isGroupExpandedByDefault?: (node: TempGridGroupNode) => boolean;
    groupingName: string;
    onDuplicatePath?: (
        firstId: GridRowId,
        secondId: GridRowId,
        path: RowTreeBuilderGroupingCriteria[],
    ) => void;
}

export const updateRowTree = (params: UpdateRowTreeParams) => {
    const tree = { ...params.previousTree }

    const treeDepth = 1;
    const ids = [...params.ids];
    const idRowsLookup = { ...params.idRowsLookup };
    const idToIdLookup = { ...params.idToIdLookup };

    return {
        tree,
        treeDepth,
        ids,
        idRowsLookup,
        idToIdLookup,
        groupingName: params.groupingName,
    }
}