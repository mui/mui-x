import * as React from 'react';
import {
  GRID_STRING_COL_DEF,
  GridColDef,
  GridComparatorFn,
  GridRenderCellParams,
  GridGroupingColDefOverride,
  GridGroupNode,
  GridTreeNodeWithRender,
  GridValueFormatter,
} from '@mui/x-data-grid-pro';
import { GridColumnRawLookup, isSingleSelectColDef } from '@mui/x-data-grid-pro/internals';
import { GridApiPremium } from '../../../models/gridApiPremium';
import { GridGroupingColumnFooterCell } from '../../../components/GridGroupingColumnFooterCell';
import { GridGroupingCriteriaCell } from '../../../components/GridGroupingCriteriaCell';
import { GridDataSourceGroupingCriteriaCell } from '../../../components/GridDataSourceGroupingCriteriaCell';
import { GridGroupingColumnLeafCell } from '../../../components/GridGroupingColumnLeafCell';
import {
  getRowGroupingFieldFromGroupingCriteria,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  RowGroupingStrategy,
} from './gridRowGroupingUtils';
import { gridRowGroupingSanitizedModelSelector } from './gridRowGroupingSelector';

const GROUPING_COL_DEF_DEFAULT_PROPERTIES: Omit<GridColDef, 'field'> = {
  ...GRID_STRING_COL_DEF,
  type: 'custom',
  disableReorder: true,
};

const GROUPING_COL_DEF_FORCED_PROPERTIES_DEFAULT: Pick<
  GridColDef,
  'type' | 'editable' | 'groupable'
> = {
  editable: false,
  groupable: false,
};

const GROUPING_COL_DEF_FORCED_PROPERTIES_DATA_SOURCE: Pick<
  GridColDef,
  'type' | 'editable' | 'groupable' | 'filterable' | 'sortable' | 'aggregable'
> = {
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
const groupingFieldIndexComparator: GridComparatorFn = (v1, v2, cellParams1, cellParams2) => {
  const model = gridRowGroupingSanitizedModelSelector({ current: cellParams1.api });

  const groupingField1 = (cellParams1.rowNode as GridGroupNode).groupingField ?? null;
  const groupingField2 = (cellParams2.rowNode as GridGroupNode).groupingField ?? null;

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

const getLeafProperties = (leafColDef: GridColDef): Partial<GridColDef> => ({
  headerName: leafColDef.headerName ?? leafColDef.field,
  sortable: leafColDef.sortable,
  filterable: leafColDef.filterable,
  valueOptions: isSingleSelectColDef(leafColDef) ? leafColDef.valueOptions : undefined,
  filterOperators: leafColDef.filterOperators,
  sortComparator: (v1, v2, cellParams1, cellParams2) => {
    // We only want to sort the leaves
    if (cellParams1.rowNode.type === 'leaf' && cellParams2.rowNode.type === 'leaf') {
      return leafColDef.sortComparator!(v1, v2, cellParams1, cellParams2);
    }

    return groupingFieldIndexComparator(v1, v2, cellParams1, cellParams2);
  },
});

const groupedByColValueFormatter: (
  groupedByColDef: GridColDef,
) => GridValueFormatter<any, any, any, never> =
  (groupedByColDef: GridColDef) => (value, row, _, apiRef) =>
    groupedByColDef.valueFormatter!(value, row, groupedByColDef, apiRef);

const getGroupingCriteriaProperties = (groupedByColDef: GridColDef, applyHeaderName: boolean) => {
  const properties: Partial<GridColDef> = {
    sortable: groupedByColDef.sortable,
    filterable: groupedByColDef.filterable,
    valueFormatter: groupedByColDef.valueFormatter
      ? groupedByColValueFormatter(groupedByColDef)
      : undefined,
    valueOptions: isSingleSelectColDef(groupedByColDef) ? groupedByColDef.valueOptions : undefined,
    sortComparator: (v1, v2, cellParams1, cellParams2) => {
      // We only want to sort the groups of the current grouping criteria
      if (
        cellParams1.rowNode.type === 'group' &&
        cellParams2.rowNode.type === 'group' &&
        cellParams1.rowNode.groupingField === cellParams2.rowNode.groupingField
      ) {
        const colDef = cellParams1.api.getColumn(cellParams1.rowNode.groupingField);
        return colDef.sortComparator(v1, v2, cellParams1, cellParams2);
      }

      return groupingFieldIndexComparator(v1, v2, cellParams1, cellParams2);
    },
    filterOperators: groupedByColDef.filterOperators,
  };

  if (applyHeaderName) {
    properties.headerName = groupedByColDef.headerName ?? groupedByColDef.field;
  }

  return properties;
};

interface CreateGroupingColDefMonoCriteriaParams {
  columnsLookup: GridColumnRawLookup;
  /**
   * The field from which we are grouping the rows.
   */
  groupingCriteria: string;
  /**
   * The col def from which we are grouping the rows.
   */
  groupedByColDef: GridColDef;
  /**
   * The col def properties the user wants to override.
   * This value comes `prop.groupingColDef`.
   */
  colDefOverride: GridGroupingColDefOverride | null | undefined;
  strategy?: RowGroupingStrategy;
}

/**
 * Creates the `GridColDef` for a grouping column that only takes care of a single grouping criteria
 */
export const createGroupingColDefForOneGroupingCriteria = ({
  columnsLookup,
  groupedByColDef,
  groupingCriteria,
  colDefOverride,
  strategy = RowGroupingStrategy.Default,
}: CreateGroupingColDefMonoCriteriaParams): GridColDef => {
  const { leafField, mainGroupingCriteria, hideDescendantCount, ...colDefOverrideProperties } =
    colDefOverride ?? {};
  const leafColDef = leafField ? columnsLookup[leafField] : null;

  const CriteriaCell =
    strategy === RowGroupingStrategy.Default
      ? GridGroupingCriteriaCell
      : GridDataSourceGroupingCriteriaCell;

  // The properties that do not depend on the presence of a `leafColDef` and that can be overridden by `colDefOverride`
  const commonProperties: Partial<GridColDef> = {
    width: Math.max(
      (groupedByColDef.width ?? GRID_STRING_COL_DEF.width!) + 40,
      leafColDef?.width ?? 0,
    ),
    renderCell: (params) => {
      // Render footer
      if (params.rowNode.type === 'footer' || params.rowNode.type === 'pinnedRow') {
        return <GridGroupingColumnFooterCell {...params} />;
      }

      // Render leaves
      if (params.rowNode.type === 'leaf') {
        if (leafColDef) {
          const leafParams: GridRenderCellParams = {
            ...params.api.getCellParams(params.id, leafField!),
            api: params.api,
            hasFocus: params.hasFocus,
          };
          if (leafColDef.renderCell) {
            return leafColDef.renderCell(leafParams);
          }

          return <GridGroupingColumnLeafCell {...leafParams} />;
        }

        return '';
      }

      // Render current grouping criteria groups
      if (params.rowNode.groupingField === groupingCriteria) {
        return (
          <CriteriaCell
            {...(params as GridRenderCellParams<any, any, any, GridGroupNode>)}
            hideDescendantCount={hideDescendantCount}
          />
        );
      }

      return '';
    },
    valueGetter: (value, row, column, apiRef) => {
      const rowId = apiRef.current.getRowId(row);
      const rowNode = apiRef.current.getRowNode<GridTreeNodeWithRender>(rowId);
      if (!rowNode || rowNode.type === 'footer' || rowNode.type === 'pinnedRow') {
        return undefined;
      }

      if (rowNode.type === 'leaf') {
        if (leafColDef) {
          return apiRef.current.getCellValue(rowId, leafField!);
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
  let sourceProperties: Partial<GridColDef>;
  if (mainGroupingCriteria && mainGroupingCriteria === groupingCriteria) {
    sourceProperties = getGroupingCriteriaProperties(groupedByColDef, true);
  } else if (leafColDef) {
    sourceProperties = getLeafProperties(leafColDef);
  } else {
    sourceProperties = getGroupingCriteriaProperties(groupedByColDef, true);
  }

  // The properties that can't be overridden with `colDefOverride`
  const forcedProperties: Pick<GridColDef, 'field' | 'editable'> = {
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

interface CreateGroupingColDefSeveralCriteriaParams {
  apiRef: React.MutableRefObject<GridApiPremium>;
  columnsLookup: GridColumnRawLookup;
  /**
   * The fields from which we are grouping the rows.
   */
  rowGroupingModel: string[];
  /**
   * The col def properties the user wants to override.
   * This value comes `prop.groupingColDef`.
   */
  colDefOverride: GridGroupingColDefOverride | null | undefined;
  strategy?: RowGroupingStrategy;
}

/**
 * Creates the `GridColDef` for a grouping column that takes care of all the grouping criteria
 */
export const createGroupingColDefForAllGroupingCriteria = ({
  apiRef,
  columnsLookup,
  rowGroupingModel,
  colDefOverride,
  strategy = RowGroupingStrategy.Default,
}: CreateGroupingColDefSeveralCriteriaParams): GridColDef => {
  const { leafField, mainGroupingCriteria, hideDescendantCount, ...colDefOverrideProperties } =
    colDefOverride ?? {};
  const leafColDef = leafField ? columnsLookup[leafField] : null;

  const CriteriaCell =
    strategy === RowGroupingStrategy.Default
      ? GridGroupingCriteriaCell
      : GridDataSourceGroupingCriteriaCell;

  // The properties that do not depend on the presence of a `leafColDef` and that can be overridden by `colDefOverride`
  const commonProperties: Partial<GridColDef> = {
    headerName: apiRef.current.getLocaleText('groupingColumnHeaderName'),
    width: Math.max(
      ...rowGroupingModel.map(
        (field) => (columnsLookup[field].width ?? GRID_STRING_COL_DEF.width!) + 40,
      ),
      leafColDef?.width ?? 0,
    ),
    renderCell: (params) => {
      // Render footer
      if (params.rowNode.type === 'footer' || params.rowNode.type === 'pinnedRow') {
        return <GridGroupingColumnFooterCell {...params} />;
      }

      // Render the leaves
      if (params.rowNode.type === 'leaf') {
        if (leafColDef) {
          const leafParams: GridRenderCellParams = {
            ...params.api.getCellParams(params.id, leafField!),
            api: params.api,
            hasFocus: params.hasFocus,
          };
          if (leafColDef.renderCell) {
            return leafColDef.renderCell(leafParams);
          }

          return <GridGroupingColumnLeafCell {...leafParams} />;
        }

        return '';
      }

      // Render the groups
      return (
        <CriteriaCell
          {...(params as GridRenderCellParams<any, any, any, GridGroupNode>)}
          hideDescendantCount={hideDescendantCount}
        />
      );
    },
    valueGetter: (value, row) => {
      const rowId = apiRef.current.getRowId(row);
      const rowNode = apiRef.current.getRowNode<GridTreeNodeWithRender>(rowId);
      if (!rowNode || rowNode.type === 'footer' || rowNode.type === 'pinnedRow') {
        return undefined;
      }

      if (rowNode.type === 'leaf') {
        if (leafColDef) {
          return apiRef.current.getCellValue(rowId, leafField!);
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
  let sourceProperties: Partial<GridColDef>;
  if (mainGroupingCriteria && rowGroupingModel.includes(mainGroupingCriteria)) {
    sourceProperties = getGroupingCriteriaProperties(columnsLookup[mainGroupingCriteria], true);
  } else if (leafColDef) {
    sourceProperties = getLeafProperties(leafColDef);
  } else {
    sourceProperties = getGroupingCriteriaProperties(
      columnsLookup[rowGroupingModel[0]],
      rowGroupingModel.length === 1,
    );
  }

  // The properties that can't be overridden with `colDefOverride`
  const forcedProperties: Pick<GridColDef, 'field' | 'editable'> = {
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
