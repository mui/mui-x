import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { isHideMenuKey, isTabKey } from '../../../../utils/keyboardUtils';
import { GridColumnMenuProps } from '../GridColumnMenuProps';
import { gridClasses } from '../../../../constants/gridClasses';

const GridColumnMenuDefaultContainerRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minWidth: theme.typography.pxToRem(248),
  padding: theme.spacing(1, 0),
}));

export interface GridColumnMenuContainerProps
  extends Pick<
    GridColumnMenuProps,
    'hideMenu' | 'currentColumn' | 'open' | 'id' | 'labelledby' | 'className' | 'children'
  > {}

const GridColumnMenuDefaultContainer = React.forwardRef<
  HTMLDivElement,
  GridColumnMenuContainerProps
>(function GridColumnMenuDefaultContainer(props: GridColumnMenuContainerProps, ref) {
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
    <GridColumnMenuDefaultContainerRoot
      id={id}
      ref={ref}
      className={clsx(gridClasses.menuList, className)}
      aria-labelledby={labelledby}
      onKeyDown={handleListKeyDown}
      {...other}
    >
      {children}
    </GridColumnMenuDefaultContainerRoot>
  );
});

GridColumnMenuDefaultContainer.propTypes = {
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

export { GridColumnMenuDefaultContainer };
