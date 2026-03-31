import { jsx as _jsx } from "react/jsx-runtime";
import { GRID_STRING_COL_DEF, gridRowIdSelector, gridRowNodeSelector, } from '@mui/x-data-grid-pro';
import { isSingleSelectColDef, RowGroupingStrategy, } from '@mui/x-data-grid-pro/internals';
import { GridGroupingColumnFooterCell } from '../../../components/GridGroupingColumnFooterCell';
import { GridGroupingCriteriaCell } from '../../../components/GridGroupingCriteriaCell';
import { GridDataSourceGroupingCriteriaCell } from '../../../components/GridDataSourceGroupingCriteriaCell';
import { GridGroupingColumnLeafCell } from '../../../components/GridGroupingColumnLeafCell';
import { getRowGroupingFieldFromGroupingCriteria, GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, } from './gridRowGroupingUtils';
import { gridRowGroupingSanitizedModelSelector } from './gridRowGroupingSelector';
const GROUPING_COL_DEF_DEFAULT_PROPERTIES = {
    ...GRID_STRING_COL_DEF,
    type: 'custom',
    disableReorder: true,
    chartable: false,
    aggregable: false,
};
const GROUPING_COL_DEF_FORCED_PROPERTIES_DEFAULT = {
    editable: false,
    groupable: false,
};
const GROUPING_COL_DEF_FORCED_PROPERTIES_DATA_SOURCE = {
    ...GROUPING_COL_DEF_FORCED_PROPERTIES_DEFAULT,
    // TODO: Support these features on the grouping column(s)
    filterable: false,
    sortable: false,
};
/**
 * When sorting two cells with different grouping criteria, we consider that the cell with the grouping criteria coming first in the model should be displayed below.
 * This can occur when some rows don't have all the fields. In which case we want the rows with the missing field to be displayed above.
 * TODO: Make this index comparator depth invariant, the logic should not be inverted when sorting in the "desc" direction (but the current return format of `sortComparator` does not support this behavior).
 */
const groupingFieldIndexComparator = (v1, v2, cellParams1, cellParams2) => {
    const model = gridRowGroupingSanitizedModelSelector({ current: cellParams1.api });
    const groupingField1 = cellParams1.rowNode.groupingField ?? null;
    const groupingField2 = cellParams2.rowNode.groupingField ?? null;
    if (groupingField1 === groupingField2) {
        return 0;
    }
    if (groupingField1 == null) {
        return -1;
    }
    if (groupingField2 == null) {
        return 1;
    }
    if (model.indexOf(groupingField1) < model.indexOf(groupingField2)) {
        return -1;
    }
    return 1;
};
const getLeafProperties = (leafColDef) => ({
    headerName: leafColDef.headerName ?? leafColDef.field,
    sortable: leafColDef.sortable,
    filterable: leafColDef.filterable,
    valueOptions: isSingleSelectColDef(leafColDef) ? leafColDef.valueOptions : undefined,
    filterOperators: leafColDef.filterOperators,
    sortComparator: (v1, v2, cellParams1, cellParams2) => {
        // We only want to sort the leaves
        if (cellParams1.rowNode.type === 'leaf' && cellParams2.rowNode.type === 'leaf') {
            return leafColDef.sortComparator(v1, v2, cellParams1, cellParams2);
        }
        return groupingFieldIndexComparator(v1, v2, cellParams1, cellParams2);
    },
});
const groupedByColValueFormatter = (groupedByColDef) => (value, row, _, apiRef) => {
    const rowId = gridRowIdSelector(apiRef, row);
    const rowNode = gridRowNodeSelector(apiRef, rowId);
    if (rowNode.type === 'group' && rowNode.groupingField === groupedByColDef.field) {
        return groupedByColDef.valueFormatter(value, row, groupedByColDef, apiRef);
    }
    return value;
};
function getGroupingCriteriaProperties(groupedByColDef, rowGroupingColumnMode, rowGroupingModel = [], columnsLookup = {}) {
    let valueFormatter;
    if (rowGroupingColumnMode === 'single' && rowGroupingModel.length > 1) {
        // In single column grouping mode, the `valueFormatter` of the grouping column uses
        // value formatters from original columns for each of the grouping criteria
        valueFormatter = (value, row, column, apiRef) => {
            const rowId = gridRowIdSelector(apiRef, row);
            const rowNode = gridRowNodeSelector(apiRef, rowId);
            if (rowNode?.type === 'group') {
                const originalColDef = rowNode.groupingField ? columnsLookup[rowNode.groupingField] : null;
                if (originalColDef?.type === 'singleSelect') {
                    // the default valueFormatter of a singleSelect colDef won't work with the grouping column values
                    return value;
                }
                const columnValueFormatter = originalColDef?.valueFormatter;
                if (typeof columnValueFormatter === 'function') {
                    return columnValueFormatter(value, row, column, apiRef);
                }
            }
            return value;
        };
    }
    else {
        valueFormatter = groupedByColDef.valueFormatter
            ? groupedByColValueFormatter(groupedByColDef)
            : undefined;
    }
    const properties = {
        sortable: groupedByColDef.sortable,
        filterable: groupedByColDef.filterable,
        valueFormatter,
        valueOptions: isSingleSelectColDef(groupedByColDef) ? groupedByColDef.valueOptions : undefined,
        sortComparator: (v1, v2, cellParams1, cellParams2) => {
            // We only want to sort the groups of the current grouping criteria
            if (cellParams1.rowNode.type === 'group' &&
                cellParams2.rowNode.type === 'group' &&
                cellParams1.rowNode.groupingField === cellParams2.rowNode.groupingField) {
                const colDef = cellParams1.api.getColumn(cellParams1.rowNode.groupingField);
                return colDef.sortComparator(v1, v2, cellParams1, cellParams2);
            }
            return groupingFieldIndexComparator(v1, v2, cellParams1, cellParams2);
        },
        filterOperators: groupedByColDef.filterOperators,
    };
    const applyHeaderName = !(rowGroupingColumnMode === 'single' && rowGroupingModel.length > 1);
    if (applyHeaderName) {
        properties.headerName = groupedByColDef.headerName ?? groupedByColDef.field;
    }
    return properties;
}
/**
 * Creates the `GridColDef` for a grouping column that only takes care of a single grouping criteria
 */
export const createGroupingColDefForOneGroupingCriteria = ({ columnsLookup, groupedByColDef, groupingCriteria, colDefOverride, strategy = RowGroupingStrategy.Default, }) => {
    const { leafField, mainGroupingCriteria, hideDescendantCount, ...colDefOverrideProperties } = colDefOverride ?? {};
    const leafColDef = leafField ? columnsLookup[leafField] : null;
    const CriteriaCell = strategy === RowGroupingStrategy.Default
        ? GridGroupingCriteriaCell
        : GridDataSourceGroupingCriteriaCell;
    // The properties that do not depend on the presence of a `leafColDef` and that can be overridden by `colDefOverride`
    const commonProperties = {
        width: Math.max((groupedByColDef.width ?? GRID_STRING_COL_DEF.width) + 40, leafColDef?.width ?? 0),
        renderCell: (params) => {
            // Render footer
            if (params.rowNode.type === 'footer' || params.rowNode.type === 'pinnedRow') {
                return _jsx(GridGroupingColumnFooterCell, { ...params });
            }
            // Render leaves
            if (params.rowNode.type === 'leaf') {
                if (leafColDef) {
                    const leafParams = {
                        ...params.api.getCellParams(params.id, leafField),
                        api: params.api,
                        hasFocus: params.hasFocus,
                    };
                    if (leafColDef.renderCell) {
                        return leafColDef.renderCell(leafParams);
                    }
                    return _jsx(GridGroupingColumnLeafCell, { ...leafParams });
                }
                return '';
            }
            // Render current grouping criteria groups
            if (params.rowNode.groupingField === groupingCriteria) {
                return (_jsx(CriteriaCell, { ...params, hideDescendantCount: hideDescendantCount }));
            }
            return '';
        },
        valueGetter: (value, row, column, apiRef) => {
            const rowId = gridRowIdSelector(apiRef, row);
            const rowNode = gridRowNodeSelector(apiRef, rowId);
            if (!rowNode || rowNode.type === 'footer' || rowNode.type === 'pinnedRow') {
                return undefined;
            }
            if (rowNode.type === 'leaf') {
                if (leafColDef) {
                    return apiRef.current.getCellValue(rowId, leafField);
                }
                return undefined;
            }
            if (rowNode.groupingField === groupingCriteria) {
                return rowNode.groupingKey;
            }
            return undefined;
        },
    };
    // If we have a `mainGroupingCriteria` defined and matching the `groupingCriteria`
    // Then we apply the sorting / filtering on the groups of this column's grouping criteria based on the properties of `groupedByColDef`.
    // It can be useful to define a `leafField` for leaves rendering but still use the grouping criteria for the sorting / filtering
    //
    // If we have a `leafField` defined and matching an existing column
    // Then we apply the sorting / filtering on the leaves based on the properties of `leavesColDef`
    //
    // By default, we apply the sorting / filtering on the groups of this column's grouping criteria based on the properties of `groupedColDef`.
    let sourceProperties;
    if (mainGroupingCriteria && mainGroupingCriteria === groupingCriteria) {
        sourceProperties = getGroupingCriteriaProperties(groupedByColDef, 'multiple');
    }
    else if (leafColDef) {
        sourceProperties = getLeafProperties(leafColDef);
    }
    else {
        sourceProperties = getGroupingCriteriaProperties(groupedByColDef, 'multiple');
    }
    // The properties that can't be overridden with `colDefOverride`
    const forcedProperties = {
        field: getRowGroupingFieldFromGroupingCriteria(groupingCriteria),
        ...GROUPING_COL_DEF_FORCED_PROPERTIES_DEFAULT,
    };
    return {
        ...GROUPING_COL_DEF_DEFAULT_PROPERTIES,
        ...commonProperties,
        ...sourceProperties,
        ...colDefOverrideProperties,
        ...forcedProperties,
    };
};
/**
 * Creates the `GridColDef` for a grouping column that takes care of all the grouping criteria
 */
export const createGroupingColDefForAllGroupingCriteria = ({ apiRef, columnsLookup, rowGroupingModel, colDefOverride, strategy = RowGroupingStrategy.Default, }) => {
    const { leafField, mainGroupingCriteria, hideDescendantCount, ...colDefOverrideProperties } = colDefOverride ?? {};
    const leafColDef = leafField ? columnsLookup[leafField] : null;
    const CriteriaCell = strategy === RowGroupingStrategy.Default
        ? GridGroupingCriteriaCell
        : GridDataSourceGroupingCriteriaCell;
    // The properties that do not depend on the presence of a `leafColDef` and that can be overridden by `colDefOverride`
    const commonProperties = {
        headerName: apiRef.current.getLocaleText('groupingColumnHeaderName'),
        width: Math.max(...rowGroupingModel.map((field) => (columnsLookup[field].width ?? GRID_STRING_COL_DEF.width) + 40), leafColDef?.width ?? 0),
        renderCell: (params) => {
            // Render footer
            if (params.rowNode.type === 'footer' || params.rowNode.type === 'pinnedRow') {
                return _jsx(GridGroupingColumnFooterCell, { ...params });
            }
            // Render the leaves
            if (params.rowNode.type === 'leaf') {
                if (leafColDef) {
                    const leafParams = {
                        ...params.api.getCellParams(params.id, leafField),
                        api: params.api,
                        hasFocus: params.hasFocus,
                    };
                    if (leafColDef.renderCell) {
                        return leafColDef.renderCell(leafParams);
                    }
                    return _jsx(GridGroupingColumnLeafCell, { ...leafParams });
                }
                return '';
            }
            // Render the groups
            return (_jsx(CriteriaCell, { ...params, hideDescendantCount: hideDescendantCount }));
        },
        valueGetter: (value, row) => {
            const rowId = gridRowIdSelector(apiRef, row);
            const rowNode = gridRowNodeSelector(apiRef, rowId);
            if (!rowNode || rowNode.type === 'footer' || rowNode.type === 'pinnedRow') {
                return undefined;
            }
            if (rowNode.type === 'leaf') {
                if (leafColDef) {
                    return apiRef.current.getCellValue(rowId, leafField);
                }
                return undefined;
            }
            return rowNode.groupingKey;
        },
    };
    // If we have a `mainGroupingCriteria` defined and matching one of the `orderedGroupedByFields`
    // Then we apply the sorting / filtering on the groups of this column's grouping criteria based on the properties of `columnsLookup[mainGroupingCriteria]`.
    // It can be useful to use another grouping criteria than the top level one for the sorting / filtering
    //
    // If we have a `leafField` defined and matching an existing column
    // Then we apply the sorting / filtering on the leaves based on the properties of `leavesColDef`
    //
    // By default, we apply the sorting / filtering on the groups of the top level grouping criteria based on the properties of `columnsLookup[orderedGroupedByFields[0]]`.
    let sourceProperties;
    if (mainGroupingCriteria && rowGroupingModel.includes(mainGroupingCriteria)) {
        sourceProperties = getGroupingCriteriaProperties(columnsLookup[mainGroupingCriteria], 'single', rowGroupingModel, columnsLookup);
    }
    else if (leafColDef) {
        sourceProperties = getLeafProperties(leafColDef);
    }
    else {
        sourceProperties = getGroupingCriteriaProperties(columnsLookup[rowGroupingModel[0]], 'single', rowGroupingModel, columnsLookup);
    }
    // The properties that can't be overridden with `colDefOverride`
    const forcedProperties = {
        field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
        ...(strategy === RowGroupingStrategy.Default
            ? GROUPING_COL_DEF_FORCED_PROPERTIES_DEFAULT
            : GROUPING_COL_DEF_FORCED_PROPERTIES_DATA_SOURCE),
    };
    return {
        ...GROUPING_COL_DEF_DEFAULT_PROPERTIES,
        ...commonProperties,
        ...sourceProperties,
        ...colDefOverrideProperties,
        ...forcedProperties,
    };
};
