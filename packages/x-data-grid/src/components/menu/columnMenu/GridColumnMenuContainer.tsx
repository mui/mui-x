import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as React from 'react';
import { styled } from '@mui/material/styles';

import { forwardRef } from '@mui/x-internals/forwardRef';
import { isHideMenuKey } from '../../../utils/keyboardUtils';
import { NotRendered } from '../../../utils/assert';
import { gridClasses } from '../../../constants/gridClasses';
import { GridSlotProps } from '../../../models/gridSlotsComponent';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { GridColumnMenuContainerProps } from './GridColumnMenuProps';

const StyledMenuList = styled(NotRendered<GridSlotProps['baseMenuList']>)(() => ({
  minWidth: 248,
}));

const GridColumnMenuContainer = forwardRef<HTMLUListElement, GridColumnMenuContainerProps>(
  function GridColumnMenuContainer(props, ref) {
    const { hideMenu, colDef, id, labelledby, className, children, open, ...other } = props;
    const rootProps = useGridRootProps();

    const handleListKeyDown = React.useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === 'Tab') {
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
        as={rootProps.slots.baseMenuList}
        id={id}
        className={clsx(gridClasses.menuList, className)}
        aria-labelledby={labelledby}
        onKeyDown={handleListKeyDown}
        autoFocus={open}
        {...other}
        ref={ref}
      >
        {children}
      </StyledMenuList>
    );
  },
);

GridColumnMenuContainer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  hideMenu: PropTypes.func.isRequired,
  id: PropTypes.string,
  labelledby: PropTypes.string,
  open: PropTypes.bool.isRequired,
} as any;

export { GridColumnMenuContainer };
