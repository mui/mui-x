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
  currentColumn: PropTypes.object.isRequired,
  hideMenu: PropTypes.func.isRequired,
  id: PropTypes.string,
  labelledby: PropTypes.string,
  open: PropTypes.bool.isRequired,
} as any;

export { GridColumnMenu };
