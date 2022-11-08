import * as React from 'react';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import { GridColumnMenuValue, GridColumnMenuKey } from '../../../../hooks/features/columnMenu';
import { GridColumnMenuContainer } from './GridColumnMenuContainer';
import { GridColumnMenu } from '../GridColumnMenu';
import { GridColumnMenuProps } from '../GridColumnMenuProps';
import { GridColumnMenuColumnsItem } from './GridColumnMenuColumnsItem';
import { GridColumnMenuFilterItem } from './GridColumnMenuFilterItem';
import { GridColumnMenuHideItem } from './GridColumnMenuHideItem';
import { GridColumnMenuSortItem } from './GridColumnMenuSortItem';

export interface GridColumnMenuDefaultProps
  extends Pick<GridColumnMenuProps, 'hideMenu' | 'currentColumn' | 'open'> {}

const defaultVisibleItems: Array<GridColumnMenuKey> = [
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
    const defaultMenuItems: GridColumnMenuValue['items'] = {
      sorting: <GridColumnMenuSortItem />,
      filter: <GridColumnMenuFilterItem />,
      hideColumn: <GridColumnMenuHideItem />,
      manageColumns: <GridColumnMenuColumnsItem />,
      divider: <Divider />,
    };

    return (
      <GridColumnMenuContainer ref={ref} {...props}>
        <GridColumnMenu
          defaultVisibleItems={defaultVisibleItems}
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
