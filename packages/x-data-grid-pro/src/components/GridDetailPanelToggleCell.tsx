import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridSelector, GridRenderCellParams, GridRowId } from '@mui/x-data-grid';
import { createSelector } from '@mui/x-data-grid/internals';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import {
  gridDetailPanelExpandedRowIdsSelector,
  gridDetailPanelExpandedRowsContentCacheSelector,
} from '../hooks/features/detailPanel/gridDetailPanelSelector';
import { GridApiPro } from '../models';

const isExpandedSelector = createSelector(
  gridDetailPanelExpandedRowIdsSelector,
  (expandedRowIds, rowId: GridRowId) => {
    return expandedRowIds.has(rowId);
  },
);

function GridDetailPanelToggleCell(props: GridRenderCellParams) {
  const { id, row, api } = props;
  const rowId = api.getRowId(row);
  const isExpanded = useGridSelector({ current: api as GridApiPro }, isExpandedSelector, rowId);

  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  const contentCache = useGridSelector(apiRef, gridDetailPanelExpandedRowsContentCacheSelector);
  const hasContent = React.isValidElement(contentCache[id]);

  return (
    <rootProps.slots.detailPanelsToggle
      hasContent={hasContent}
      isExpanded={isExpanded}
      {...rootProps.slotProps?.detailPanelsToggle}
    />
  );
}

GridDetailPanelToggleCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
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

export { GridDetailPanelToggleCell };
