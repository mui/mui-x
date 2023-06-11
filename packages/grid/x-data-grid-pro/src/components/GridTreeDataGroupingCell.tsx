import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import Box from '@mui/material/Box';
import {
  useGridSelector,
  gridFilteredDescendantCountLookupSelector,
  getDataGridUtilityClass,
  GridRenderCellParams,
  GridGroupNode,
  GridServerSideGroupNode,
  gridFilterModelSelector,
  gridSortModelSelector,
} from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { DataGridProProcessedProps } from '../models/dataGridProProps';
import { getLazyLoadingHelpers } from '../hooks/features/treeData/useGridTreeDataLazyLoading';

type OwnerState = { classes: DataGridProProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['treeDataGroupingCell'],
    toggle: ['treeDataGroupingCellToggle'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

interface GridTreeDataGroupingCellProps
  extends GridRenderCellParams<any, any, any, GridGroupNode | GridServerSideGroupNode> {
  hideDescendantCount?: boolean;
  /**
   * The cell offset multiplier used for calculating cell offset (`rowNode.depth * offsetMultiplier` px).
   * @default 2
   */
  offsetMultiplier?: number;
}

interface GridTreeDataGroupingCellIconProps
  extends Pick<GridTreeDataGroupingCellProps, 'id' | 'field' | 'rowNode' | 'row'> {
  descendantCount: number;
}

function GridTreeDataGroupingCellIcon(props: GridTreeDataGroupingCellIconProps) {
  const { rowNode, row, id, field, descendantCount } = props;
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const filterModel = gridFilterModelSelector(apiRef);
  const sortModel = gridSortModelSelector(apiRef);

  const isServerSideNode = (rowNode as GridServerSideGroupNode).isServerSide;
  const isDataLoading = (rowNode as GridServerSideGroupNode).isLoading;
  const areChildrenFetched = (rowNode as GridServerSideGroupNode).childrenFetched;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isServerSideNode && !rowNode.childrenExpanded && !areChildrenFetched) {
      const helpers = getLazyLoadingHelpers(apiRef, rowNode as GridServerSideGroupNode);
      apiRef.current.setRowLoadingStatus(rowNode.id, true);
      apiRef.current.publishEvent('fetchRowChildren', { row, helpers, filterModel, sortModel });
    } else {
      apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
    }
    apiRef.current.setCellFocus(id, field);
    event.stopPropagation(); // TODO remove event.stopPropagation
  };

  const Icon = rowNode.childrenExpanded
    ? rootProps.slots.treeDataCollapseIcon
    : rootProps.slots.treeDataExpandIcon;

  if (isDataLoading) {
    return <CircularProgress size="1rem" color="inherit" />;
  }
  return descendantCount > 0 || isServerSideNode ? (
    <rootProps.slots.baseIconButton
      size="small"
      onClick={handleClick}
      tabIndex={-1}
      aria-label={
        rowNode.childrenExpanded
          ? apiRef.current.getLocaleText('treeDataCollapse')
          : apiRef.current.getLocaleText('treeDataExpand')
      }
      {...rootProps?.slotProps?.baseIconButton}
    >
      <Icon fontSize="inherit" />
    </rootProps.slots.baseIconButton>
  ) : null;
}

function GridTreeDataGroupingCell(props: GridTreeDataGroupingCellProps) {
  const { formattedValue, rowNode, hideDescendantCount, offsetMultiplier = 2, id, field } = props;

  const rootProps = useGridRootProps();
  const apiRef = useGridPrivateApiContext();
  const row = apiRef.current.getRow(rowNode.id);
  const isServerSideNode = (rowNode as GridServerSideGroupNode).isServerSide;
  const ownerState: OwnerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);
  const filteredDescendantCountLookup = useGridSelector(
    apiRef,
    gridFilteredDescendantCountLookupSelector,
  );

  const filteredDescendantCount = filteredDescendantCountLookup[rowNode.id] ?? 0;

  const descendantCount =
    isServerSideNode && rootProps.getDescendantCount
      ? rootProps.getDescendantCount(row)
      : filteredDescendantCount;

  return (
    <Box className={classes.root} sx={{ ml: rowNode.depth * offsetMultiplier }}>
      <div className={classes.toggle}>
        <GridTreeDataGroupingCellIcon
          id={id}
          field={field}
          rowNode={rowNode}
          row={row}
          descendantCount={descendantCount}
        />
      </div>
      <span>
        {formattedValue === undefined ? rowNode.groupingKey : formattedValue}
        {!hideDescendantCount && descendantCount > 0 ? ` (${descendantCount})` : ''}
      </span>
    </Box>
  );
}

GridTreeDataGroupingCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * GridApi that let you manipulate the grid.
   */
  api: PropTypes.object.isRequired,
  /**
   * The mode of the cell.
   */
  cellMode: PropTypes.oneOf(['edit', 'view']).isRequired,
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.object.isRequired,
  /**
   * The column field of the cell that triggered the event.
   */
  field: PropTypes.string.isRequired,
  /**
   * A ref allowing to set imperative focus.
   * It can be passed to the element that should receive focus.
   * @ignore - do not document.
   */
  focusElementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.shape({
        focus: PropTypes.func.isRequired,
      }),
    }),
  ]),
  /**
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue: PropTypes.any,
  /**
   * If true, the cell is the active element.
   */
  hasFocus: PropTypes.bool.isRequired,
  hideDescendantCount: PropTypes.bool,
  /**
   * The grid row id.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * If true, the cell is editable.
   */
  isEditable: PropTypes.bool,
  /**
   * The cell offset multiplier used for calculating cell offset (`rowNode.depth * offsetMultiplier` px).
   * @default 2
   */
  offsetMultiplier: PropTypes.number,
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: PropTypes.any.isRequired,
  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: PropTypes.object.isRequired,
  /**
   * the tabIndex value.
   */
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
  /**
   * The cell value.
   * If the column has `valueGetter`, use `params.row` to directly access the fields.
   */
  value: PropTypes.any,
} as any;

export { GridTreeDataGroupingCell };
