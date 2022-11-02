import * as React from 'react';
import PropTypes from 'prop-types';
import { GridColumnMenuValue } from '../../../../hooks/features/columnMenu';
import { GridColumnMenuContainer } from './GridColumnMenuContainer';
import { GridColumnMenu } from '../GridColumnMenu';
import { GridColumnMenuProps } from '../GridColumnMenuProps';
import { GridColumnsMenuItem } from './GridColumnsMenuItem';
import { GridFilterMenuItem } from './GridFilterMenuItem';
import { HideGridColMenuItem } from './HideGridColMenuItem';
import { SortGridMenuItems } from './SortGridMenuItems';

export interface GridColumnMenuDefaultProps
  extends Pick<
    GridColumnMenuProps,
    'hideMenu' | 'currentColumn' | 'open' | 'filterColumnMenuItems'
  > {}

const GridColumnMenuDefault = React.forwardRef<HTMLDivElement, GridColumnMenuDefaultProps>(
  function GridColumnMenuDefault(props: GridColumnMenuDefaultProps, ref) {
    const { hideMenu, currentColumn } = props;

    const menuItems: GridColumnMenuValue = [
      {
        slot: 'sorting',
        displayName: 'SortGridMenuItems',
        component: <SortGridMenuItems onClick={hideMenu} column={currentColumn!} />,
        addDivider: true,
      },
      {
        slot: 'filter',
        displayName: 'GridFilterMenuItem',
        component: <GridFilterMenuItem onClick={hideMenu} column={currentColumn!} />,
        addDivider: true,
      },
      {
        slot: 'hideColumn',
        displayName: 'HideGridColMenuItem',
        component: <HideGridColMenuItem onClick={hideMenu} column={currentColumn!} />,
        addDivider: true,
      },
      {
        slot: 'manageColumns',
        displayName: 'GridColumnsMenuItem',
        component: <GridColumnsMenuItem onClick={hideMenu} column={currentColumn!} />,
      },
    ];

    return (
      <GridColumnMenuContainer ref={ref} {...props}>
        <GridColumnMenu menuItems={menuItems} {...props} />
      </GridColumnMenuContainer>
    );
  },
);

GridColumnMenuDefault.propTypes = {
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

export { GridColumnMenuDefault };
