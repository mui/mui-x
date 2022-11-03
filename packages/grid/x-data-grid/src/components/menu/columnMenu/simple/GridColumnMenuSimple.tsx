import * as React from 'react';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import { GridColumnMenuLookup, GridColumnMenuValue } from '../../../../hooks/features/columnMenu';
import { GridColumnMenuSimpleContainer } from './GridColumnMenuSimpleContainer';
import { GridColumnMenuProps } from '../GridColumnMenuProps';
import { GridColumnsMenuSimpleItem } from './GridColumnsMenuSimpleItem';
import { GridFilterMenuSimpleItem } from './GridFilterMenuSimpleItem';
import { HideGridColMenuSimpleItem } from './HideGridColMenuSimpleItem';
import { SortGridMenuSimpleItems } from './SortGridMenuSimpleItems';
import { GridColumnMenu } from '../GridColumnMenu';

interface Props
  extends Pick<
    GridColumnMenuProps,
    'hideMenu' | 'currentColumn' | 'open' | 'getVisibleColumnMenuItems'
  > {}

const defaultVisibleSlots: Array<GridColumnMenuLookup['slot']> = [
  'sorting',
  'filter',
  'hideColumn',
  'manageColumns',
];

const GridColumnMenuSimple = React.forwardRef<HTMLUListElement, Props>(
  function GridColumnMenuSimple(props: Props, ref) {
    const defaultMenuItems: GridColumnMenuValue['items'] = [
      {
        slot: 'sorting',
        displayName: 'SortGridMenuSimpleItems',
        component: <SortGridMenuSimpleItems />,
      },
      {
        slot: 'filter',
        displayName: 'GridFilterMenuSimpleItem',
        component: <GridFilterMenuSimpleItem />,
      },
      {
        slot: 'hideColumn',
        displayName: 'HideGridColMenuSimpleItem',
        component: <HideGridColMenuSimpleItem />,
      },
      {
        slot: 'manageColumns',
        displayName: 'GridColumnsMenuSimpleItem',
        component: <GridColumnsMenuSimpleItem />,
      },
      {
        slot: 'divider',
        component: <Divider />,
      },
    ];

    return (
      <GridColumnMenuSimpleContainer ref={ref} {...props}>
        <GridColumnMenu
          defaultMenuItems={defaultMenuItems}
          defaultVisibleSlots={defaultVisibleSlots}
          {...props}
        />
      </GridColumnMenuSimpleContainer>
    );
  },
);

GridColumnMenuSimple.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  currentColumn: PropTypes.object.isRequired,
  getVisibleColumnMenuItems: PropTypes.func,
  hideMenu: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
} as any;

export { GridColumnMenuSimple };
