import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as React from 'react';
import MenuList from '@mui/material/MenuList';
import { styled } from '@mui/material/styles';
import { isHideMenuKey, isTabKey } from '../../../../utils/keyboardUtils';
import { GridColumnMenuProps } from '../GridColumnMenuProps';
import { gridClasses } from '../../../../constants/gridClasses';

const StyledMenuList = styled(MenuList)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minWidth: theme.typography.pxToRem(248),
}));

export interface GridColumnMenuContainerProps
  extends Pick<
    GridColumnMenuProps,
    'hideMenu' | 'currentColumn' | 'open' | 'id' | 'labelledby' | 'className' | 'children'
  > {}

const GridColumnMenuDefaultContainer = React.forwardRef<
  HTMLUListElement,
  GridColumnMenuContainerProps
>(function GridColumnMenuDefaultContainer(props: GridColumnMenuContainerProps, ref) {
  const { hideMenu, currentColumn, id, labelledby, className, children, open, ...other } = props;

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
    <StyledMenuList
      id={id}
      ref={ref}
      role="menu"
      className={clsx(gridClasses.menuList, className)}
      aria-labelledby={labelledby}
      onKeyDown={handleListKeyDown}
      autoFocus={open}
      {...other}
    >
      {children}
    </StyledMenuList>
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
