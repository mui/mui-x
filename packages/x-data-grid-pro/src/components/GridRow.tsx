import * as React from 'react';
import PropTypes from 'prop-types';
import { GridRow as DataGridRow, GridRowProps } from '@mui/x-data-grid';
import { useGridPrivateApiContext } from '@mui/x-data-grid/internals';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { GridRowPro, GridTreeNodeWithParent } from './GridProRow';

function GridRow(props: GridRowProps) {
  const { rowId } = props;

  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const rowNode = apiRef.current.getRowNode(rowId);

  return rootProps.treeData !== true || rowNode === null || rowNode.parent === null ? (
    <DataGridRow {...props} />
  ) : (
    <GridRowPro {...props} rowNode={rowNode as GridTreeNodeWithParent} />
  );
}

GridRow.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  dimensions: PropTypes.shape({
    bottomContainerHeight: PropTypes.number.isRequired,
    columnsTotalWidth: PropTypes.number.isRequired,
    contentSize: PropTypes.shape({
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
    }).isRequired,
    hasScrollX: PropTypes.bool.isRequired,
    hasScrollY: PropTypes.bool.isRequired,
    headerFilterHeight: PropTypes.number.isRequired,
    headerHeight: PropTypes.number.isRequired,
    headersTotalHeight: PropTypes.number.isRequired,
    isReady: PropTypes.bool.isRequired,
    leftPinnedWidth: PropTypes.number.isRequired,
    minimumSize: PropTypes.shape({
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
    }).isRequired,
    rightPinnedWidth: PropTypes.number.isRequired,
    root: PropTypes.shape({
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
    }).isRequired,
    rowHeight: PropTypes.number.isRequired,
    rowWidth: PropTypes.number.isRequired,
    scrollbarSize: PropTypes.number.isRequired,
    topContainerHeight: PropTypes.number.isRequired,
    viewportInnerSize: PropTypes.shape({
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
    }).isRequired,
    viewportOuterSize: PropTypes.shape({
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  /**
   * Determines which cell has focus.
   * If `null`, no cell in this row has focus.
   */
  focusedColumnIndex: PropTypes.number,
  /**
   * Index of the row in the whole sorted and filtered dataset.
   * If some rows above have expanded children, this index also take those children into account.
   */
  index: PropTypes.number.isRequired,
  isFirstVisible: PropTypes.bool.isRequired,
  isLastVisible: PropTypes.bool.isRequired,
  isNotVisible: PropTypes.bool.isRequired,
  offsetLeft: PropTypes.number.isRequired,
  offsetTop: PropTypes.number,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  pinnedColumns: PropTypes.object.isRequired,
  renderContext: PropTypes.shape({
    firstColumnIndex: PropTypes.number.isRequired,
    firstRowIndex: PropTypes.number.isRequired,
    lastColumnIndex: PropTypes.number.isRequired,
    lastRowIndex: PropTypes.number.isRequired,
  }).isRequired,
  row: PropTypes.object.isRequired,
  rowHeight: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number]).isRequired,
  rowId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  selected: PropTypes.bool.isRequired,
  /**
   * Determines which cell should be tabbable by having tabIndex=0.
   * If `null`, no cell in this row is in the tab sequence.
   */
  tabbableCell: PropTypes.string,
  visibleColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
} as any;

export { GridRow };
