import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import {
  useGridSelector,
  gridFilteredDescendantCountLookupSelector,
  getDataGridUtilityClass,
  GridEvents,
} from '@mui/x-data-grid';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { DataGridProProcessedProps } from '../models/dataGridProProps';
import { GridRenderCellParams } from '../models/gridCellParams';

type OwnerState = { classes: DataGridProProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['groupingCriteriaCell'],
    toggle: ['groupingCriteriaCellToggle'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

interface GridGroupingCriteriaCellProps extends GridRenderCellParams {
  hideDescendantCount?: boolean;
}

const GridGroupingCriteriaCell = (props: GridGroupingCriteriaCellProps) => {
  const { id, field, rowNode, hideDescendantCount } = props;

  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const ownerState: OwnerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);
  const filteredDescendantCountLookup = useGridSelector(
    apiRef,
    gridFilteredDescendantCountLookupSelector,
  );
  const filteredDescendantCount = filteredDescendantCountLookup[rowNode.id] ?? 0;

  const Icon = rowNode.childrenExpanded
    ? rootProps.components.GroupingCriteriaCollapseIcon
    : rootProps.components.GroupingCriteriaExpandIcon;

  const handleKeyDown = (event) => {
    if (event.key === ' ') {
      event.stopPropagation();
    }
    apiRef.current.publishEvent(GridEvents.cellKeyDown, props, event);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
    apiRef.current.setCellFocus(id, field);
    event.stopPropagation();
  };

  const marginLeft = rootProps.rowGroupingColumnMode === 'multiple' ? 0 : rowNode.depth * 2;

  return (
    <Box className={classes.root} sx={{ ml: marginLeft }}>
      <div className={classes.toggle}>
        {filteredDescendantCount > 0 && (
          <IconButton
            size="small"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
            aria-label={
              rowNode.childrenExpanded
                ? apiRef.current.getLocaleText('treeDataCollapse')
                : apiRef.current.getLocaleText('treeDataExpand')
            }
          >
            <Icon fontSize="inherit" />
          </IconButton>
        )}
      </div>
      <span>
        {rowNode.groupingKey}
        {!hideDescendantCount && filteredDescendantCount > 0 ? ` (${filteredDescendantCount})` : ''}
      </span>
    </Box>
  );
};

GridGroupingCriteriaCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * GridApi that let you manipulate the grid.
   */
  api: PropTypes.any.isRequired,
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
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.number,
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
  ]),
  /**
   * Get the cell value of a row and field.
   * @param {GridRowId} id The row id.
   * @param {string} field The field.
   * @returns {GridCellValue} The cell value.
   */
  getValue: PropTypes.func.isRequired,
  /**
   * If true, the cell is the active element.
   */
  hasFocus: PropTypes.bool.isRequired,
  /**
   * The grid row id.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * If true, the cell is editable.
   */
  isEditable: PropTypes.bool,
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: PropTypes.object.isRequired,
  /**
   * the tabIndex value.
   */
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
  /**
   * The cell value, but if the column has valueGetter, use getValue.
   */
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.number,
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
  ]),
} as any;

export { GridGroupingCriteriaCell };
