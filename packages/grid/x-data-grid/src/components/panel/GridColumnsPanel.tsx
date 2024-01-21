import * as React from 'react';
import PropTypes from 'prop-types';
import { GridPanelWrapper, GridPanelWrapperProps } from './GridPanelWrapper';
import { GridColumnsManagement } from '../columnsManagement';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export interface GridColumnsPanelProps extends GridPanelWrapperProps {}

function GridColumnsPanel(props: GridColumnsPanelProps) {
  const rootProps = useGridRootProps();
  return (
    <GridPanelWrapper {...props}>
      <GridColumnsManagement {...rootProps.slotProps?.columnsManagement} />
    </GridPanelWrapper>
  );
}

GridColumnsPanel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * If `true`, the column search field will be focused automatically.
   * If `false`, the first column switch input will be focused automatically.
   * This helps to avoid input keyboard panel to popup automatically on touch devices.
   * @default true
   */
  autoFocusSearchField: PropTypes.bool,
  /**
   * If `true`, the `Hide all` button will not be displayed.
   * @default false
   */
  disableHideAllButton: PropTypes.bool,
  /**
   * If `true`, the `Show all` button will be disabled
   * @default false
   */
  disableShowAllButton: PropTypes.bool,
  /**
   * Returns the list of togglable columns.
   * If used, only those columns will be displayed in the panel
   * which are passed as the return value of the function.
   * @param {GridColDef[]} columns The `ColDef` list of all columns.
   * @returns {GridColDef['field'][]} The list of togglable columns' field names.
   */
  getTogglableColumns: PropTypes.func,
  searchPredicate: PropTypes.func,
  slotProps: PropTypes.object,
  sort: PropTypes.oneOf(['asc', 'desc']),
} as any;

export { GridColumnsPanel };
