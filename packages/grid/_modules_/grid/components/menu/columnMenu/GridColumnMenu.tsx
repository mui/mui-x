import * as React from 'react';
import PropTypes from 'prop-types';
import { GridColumnMenuContainer } from './GridColumnMenuContainer';
import { GridColumnMenuProps } from './GridColumnMenuProps';
import { GridColumnsMenuItem } from './GridColumnsMenuItem';
import { GridFilterMenuItem } from './GridFilterMenuItem';
import { HideGridColMenuItem } from './HideGridColMenuItem';
import { SortGridMenuItems } from './SortGridMenuItems';

const GridColumnMenu = React.forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridColumnMenu(props: GridColumnMenuProps, ref) {
    const { hideMenu, currentColumn } = props;

    return (
      <GridColumnMenuContainer ref={ref} {...props}>
        <SortGridMenuItems onClick={hideMenu} column={currentColumn!} />
        <GridFilterMenuItem onClick={hideMenu} column={currentColumn!} />
        <HideGridColMenuItem onClick={hideMenu} column={currentColumn!} />
        <GridColumnsMenuItem onClick={hideMenu} column={currentColumn!} />
      </GridColumnMenuContainer>
    );
  },
);

GridColumnMenu.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  currentColumn: PropTypes.shape({
    align: PropTypes.oneOf(['center', 'left', 'right']),
    cellClassName: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    description: PropTypes.string,
    disableColumnMenu: PropTypes.bool,
    disableExport: PropTypes.bool,
    disableReorder: PropTypes.bool,
    editable: PropTypes.bool,
    field: PropTypes.string.isRequired,
    filterable: PropTypes.bool,
    filterOperators: PropTypes.arrayOf(
      PropTypes.shape({
        getApplyFilterFn: PropTypes.func.isRequired,
        InputComponent: PropTypes.elementType,
        InputComponentProps: PropTypes.object,
        label: PropTypes.string,
        value: PropTypes.string.isRequired,
      }),
    ),
    flex: PropTypes.number,
    headerAlign: PropTypes.oneOf(['center', 'left', 'right']),
    headerClassName: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    headerName: PropTypes.string,
    hide: PropTypes.bool,
    hideSortIcons: PropTypes.bool,
    minWidth: PropTypes.number,
    renderCell: PropTypes.func,
    renderEditCell: PropTypes.func,
    renderHeader: PropTypes.func,
    resizable: PropTypes.bool,
    sortable: PropTypes.bool,
    sortComparator: PropTypes.func,
    type: PropTypes.string,
    valueFormatter: PropTypes.func,
    valueGetter: PropTypes.func,
    valueOptions: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.any.isRequired,
        }),
        PropTypes.string,
      ]).isRequired,
    ),
    valueParser: PropTypes.func,
    width: PropTypes.number,
  }).isRequired,
  hideMenu: PropTypes.func.isRequired,
  id: PropTypes.string,
  labelledby: PropTypes.string,
  open: PropTypes.bool.isRequired,
} as any;

export { GridColumnMenu };
