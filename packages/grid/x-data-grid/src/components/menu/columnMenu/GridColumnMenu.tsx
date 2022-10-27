import * as React from 'react';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import { GridColumnMenuValue } from '../../../hooks/features/columnMenu';
import { GridColumnMenuContainer } from './GridColumnMenuContainer';
import { GridColumnMenuProps } from './GridColumnMenuProps';
import { GridColumnsMenuItem } from './GridColumnsMenuItem';
import { GridFilterMenuItem } from './GridFilterMenuItem';
import { HideGridColMenuItem } from './HideGridColMenuItem';
import { SortGridMenuItems } from './SortGridMenuItems';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';

const GridColumnMenu = React.forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridColumnMenu(props: GridColumnMenuProps, ref) {
    const { hideMenu, currentColumn, condensed } = props;
    const apiRef = useGridApiContext();

    const defaultMenuItems: GridColumnMenuValue = [
      {
        displayName: 'SortGridMenuItems',
        component: <SortGridMenuItems onClick={hideMenu} column={currentColumn!} />,
      },
      // TODO update types to allow `onClick` and `column` to be optional
      {
        displayName: 'GridFilterMenuItem',
        component: <GridFilterMenuItem onClick={hideMenu} column={currentColumn!} />,
      },
      {
        displayName: 'HideGridColMenuItem',
        component: <HideGridColMenuItem onClick={hideMenu} column={currentColumn!} />,
      },
      {
        displayName: 'GridColumnsMenuItem',
        component: <GridColumnsMenuItem onClick={hideMenu} column={currentColumn!} />,
      },
    ];

    const condensedMenuItems: GridColumnMenuValue = [
      {
        displayName: 'SortGridMenuItems',
        component: (
          <SortGridMenuItems onClick={hideMenu} column={currentColumn!} condensed={condensed} />
        ),
      },
      { displayName: 'divider', component: <Divider /> },
      {
        displayName: 'GridFilterMenuItem',
        component: (
          <GridFilterMenuItem onClick={hideMenu} column={currentColumn!} condensed={condensed} />
        ),
      },
      { displayName: 'Divider', component: <Divider /> },
      {
        displayName: 'HideGridColMenuItem',
        component: (
          <HideGridColMenuItem onClick={hideMenu} column={currentColumn!} condensed={condensed} />
        ),
      },
      { displayName: 'Divider', component: <Divider /> },
      {
        displayName: 'GridColumnsMenuItem',
        component: (
          <GridColumnsMenuItem onClick={hideMenu} column={currentColumn!} condensed={condensed} />
        ),
      },
    ];

    const preProcessedValue = apiRef.current.unstable_applyPipeProcessors(
      'columnMenu',
      condensed ? condensedMenuItems : defaultMenuItems,
      currentColumn,
    );

    return (
      <GridColumnMenuContainer ref={ref} {...props}>
        {preProcessedValue.map((item: any, index: number) =>
          React.cloneElement(item.component, {
            key: index,
            onClick: hideMenu,
            column: currentColumn,
          }),
        )}
      </GridColumnMenuContainer>
    );
  },
);

GridColumnMenu.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  condensed: PropTypes.bool,
  currentColumn: PropTypes.object.isRequired,
  hideMenu: PropTypes.func.isRequired,
  id: PropTypes.string,
  labelledby: PropTypes.string,
  open: PropTypes.bool.isRequired,
} as any;

export { GridColumnMenu };
