import * as React from 'react';
import PropTypes from 'prop-types';
import { IconButtonProps } from '@mui/material/IconButton';
import { MenuItemProps } from '@mui/material/MenuItem';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

interface GridActionsCellItemCommonProps {
  label: string;
  icon?: React.ReactElement<any>;
  /** from https://mui.com/material-ui/api/button-base/#ButtonBase-prop-component */
  component?: React.ElementType;
}

export type GridActionsCellItemProps = GridActionsCellItemCommonProps &
  (
    | ({ showInMenu?: false; icon: React.ReactElement<any> } & Omit<IconButtonProps, 'component'>)
    | ({
        showInMenu: true;
        /**
         * If false, the menu will not close when this item is clicked.
         * @default true
         */
        closeMenuOnClick?: boolean;
        closeMenu?: () => void;
      } & Omit<MenuItemProps, 'component'>)
  );

const GridActionsCellItem = forwardRef<HTMLElement, GridActionsCellItemProps>((props, ref) => {
  const rootProps = useGridRootProps();

  if (!props.showInMenu) {
    const { label, icon, showInMenu, onClick, ...other } = props;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
    };

    return (
      <rootProps.slots.baseIconButton
        size="small"
        role="menuitem"
        aria-label={label}
        {...other}
        onClick={handleClick}
        {...rootProps.slotProps?.baseIconButton}
        ref={ref as React.RefObject<HTMLButtonElement>}
      >
        {React.cloneElement(icon!, { fontSize: 'small' })}
      </rootProps.slots.baseIconButton>
    );
  }

  const { label, icon, showInMenu, onClick, closeMenuOnClick = true, closeMenu, ...other } = props;

  const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
    onClick?.(event);
    if (closeMenuOnClick) {
      closeMenu?.();
    }
  };

  return (
    <rootProps.slots.baseMenuItem
      ref={ref}
      {...(other as any)}
      onClick={handleClick}
      iconStart={icon}
    >
      {label}
    </rootProps.slots.baseMenuItem>
  );
});

GridActionsCellItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * from https://mui.com/material-ui/api/button-base/#ButtonBase-prop-component
   */
  component: PropTypes.elementType,
  icon: PropTypes.element,
  label: PropTypes.string.isRequired,
  showInMenu: PropTypes.bool,
} as any;

export { GridActionsCellItem };
