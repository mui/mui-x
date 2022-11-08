import * as React from 'react';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import { GridColumnMenuKey } from '../../../../hooks/features/columnMenu';
import { GridColumnMenuSimpleContainer } from './GridColumnMenuSimpleContainer';
import { GridColumnMenuProps } from '../GridColumnMenuProps';
import { GridColumnMenuColumnsItemSimple } from './GridColumnMenuColumnsItemSimple';
import { GridColumnMenuFilterItemSimple } from './GridColumnMenuFilterItemSimple';
import { GridColumnMenuHideItemSimple } from './GridColumnMenuHideItemSimple';
import { GridColumnMenuSortItemSimple } from './GridColumnMenuSortItemSimple';
import { GridColumnMenu } from '../GridColumnMenu';

interface Props
  extends Pick<
    GridColumnMenuProps,
    'hideMenu' | 'currentColumn' | 'open' | 'getVisibleColumnMenuItems'
  > {}

const defaultVisibleItems: Array<GridColumnMenuKey> = [
  'sorting',
  'filter',
  'hideColumn',
  'manageColumns',
];

const GridColumnMenuSimple = React.forwardRef<HTMLUListElement, Props>(
  function GridColumnMenuSimple(props: Props, ref) {
    const defaultMenuItems = {
      sorting: <GridColumnMenuSortItemSimple />,
      filter: <GridColumnMenuFilterItemSimple />,
      hideColumn: <GridColumnMenuHideItemSimple />,
      manageColumns: <GridColumnMenuColumnsItemSimple />,
      divider: <Divider />,
    };

    return (
      <GridColumnMenuSimpleContainer ref={ref} {...props}>
        <GridColumnMenu
          defaultMenuItems={defaultMenuItems}
          defaultVisibleItems={defaultVisibleItems}
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
