import * as React from 'react';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import { GridColumnMenuValue, GridColumnMenuTypes } from '../../../../hooks/features/columnMenu';
import { GridColumnMenuContainer } from './GridColumnMenuContainer';
import { GridColumnMenu } from '../GridColumnMenu';
import { GridColumnMenuProps } from '../GridColumnMenuProps';
import { GridColumnsMenuItem } from './GridColumnsMenuItem';
import { GridFilterMenuItem } from './GridFilterMenuItem';
import { HideGridColMenuItem } from './HideGridColMenuItem';
import { SortGridMenuItems } from './SortGridMenuItems';

export interface GridColumnMenuDefaultProps
  extends Pick<GridColumnMenuProps, 'hideMenu' | 'currentColumn' | 'open'> {}

const defaultVisibleItems: Array<GridColumnMenuTypes['key']> = [
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
    // TODO: Fix typing
    const defaultMenuItems: GridColumnMenuValue['items'] = {
      sorting: <SortGridMenuItems />,
      filter: <GridFilterMenuItem />,
      hideColumn: <HideGridColMenuItem />,
      manageColumns: <GridColumnsMenuItem />,
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
