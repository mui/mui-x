import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { isHideMenuKey, isTabKey } from '../../../../utils/keyboardUtils';
import { GridColumnMenuProps } from '../GridColumnMenuProps';
import { gridClasses } from '../../../../constants/gridClasses';

const GridColumnMenuContainerRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minWidth: '248px',
  padding: theme.spacing(1, 0),
}));

export interface GridColumnMenuContainerProps
  extends Pick<
    GridColumnMenuProps,
    | 'hideMenu'
    | 'currentColumn'
    | 'open'
    | 'filterColumnMenuItems'
    | 'id'
    | 'labelledby'
    | 'className'
    | 'children'
  > {}

const GridColumnMenuContainer = React.forwardRef<HTMLDivElement, GridColumnMenuContainerProps>(
  function GridColumnMenuContainer(props: GridColumnMenuContainerProps, ref) {
    const { hideMenu, currentColumn, id, labelledby, className, children, ...other } = props;

    const handleListKeyDown = React.useCallback(
      (event: React.KeyboardEvent) => {
        if (isTabKey(event.key)) {
          event.preventDefault();
        }
        if (isHideMenuKey(event.key)) {
          hideMenu(event);
        }
      },
      [hideMenu],
    );

    return (
      <GridColumnMenuContainerRoot
        id={id}
        ref={ref}
        className={clsx(gridClasses.menuList, className)}
        aria-labelledby={labelledby}
        onKeyDown={handleListKeyDown}
        {...other}
      >
        {children}
      </GridColumnMenuContainerRoot>
    );
  },
);

GridColumnMenuContainer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  currentColumn: PropTypes.object.isRequired,
  filterColumnMenuItems: PropTypes.func,
  hideMenu: PropTypes.func.isRequired,
  id: PropTypes.string,
  labelledby: PropTypes.string,
  open: PropTypes.bool.isRequired,
} as any;

export { GridColumnMenuContainer };
