import * as React from 'react';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import { GridColumnMenuValue, GridColumnMenuLookup } from '../../../../hooks/features/columnMenu';
import { GridColumnMenuContainer } from './GridColumnMenuContainer';
import { GridColumnMenu } from '../GridColumnMenu';
import { GridColumnMenuProps } from '../GridColumnMenuProps';
import { GridColumnsMenuItem } from './GridColumnsMenuItem';
import { GridFilterMenuItem } from './GridFilterMenuItem';
import { HideGridColMenuItem } from './HideGridColMenuItem';
import { SortGridMenuItems } from './SortGridMenuItems';

export interface GridColumnMenuDefaultProps
  extends Pick<GridColumnMenuProps, 'hideMenu' | 'currentColumn' | 'open'> {}

const defaultVisibleSlots: Array<GridColumnMenuLookup['slot']> = [
  'sorting',
  'divider',
  'filter',
  'divider',
  'hideColumn',
  'divider',
  'manageColumns',
];

const GridColumnMenuDefault = React.forwardRef<HTMLDivElement, GridColumnMenuDefaultProps>(
  function GridColumnMenuDefault(props: GridColumnMenuDefaultProps, ref) {
    const defaultMenuItems: GridColumnMenuValue['items'] = [
      {
        slot: 'sorting',
        displayName: 'SortGridMenuItems',
        component: <SortGridMenuItems />,
      },
      {
        slot: 'filter',
        displayName: 'GridFilterMenuItem',
        component: <GridFilterMenuItem />,
      },
      {
        slot: 'hideColumn',
        displayName: 'HideGridColMenuItem',
        component: <HideGridColMenuItem />,
      },
      {
        slot: 'manageColumns',
        displayName: 'GridColumnsMenuItem',
        component: <GridColumnsMenuItem />,
      },
      {
        slot: 'divider',
        component: <Divider />,
      },
    ];

    return (
      <GridColumnMenuContainer ref={ref} {...props}>
        <GridColumnMenu
          defaultVisibleSlots={defaultVisibleSlots}
          defaultMenuItems={defaultMenuItems}
          {...props}
        />
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
  open: PropTypes.bool.isRequired,
} as any;

export { GridColumnMenuDefault };
