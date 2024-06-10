import * as React from 'react';
import PropTypes from 'prop-types';
import { IconButtonProps } from '@mui/material/IconButton';
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

interface GridActionsCellItemCommonProps {
  label: string;
  icon?: React.ReactElement;
  /** from https://mui.com/material-ui/api/button-base/#ButtonBase-prop-component */
  component?: React.ElementType;
}

export type GridActionsCellItemProps = GridActionsCellItemCommonProps &
  (
    | ({ showInMenu?: false; icon: React.ReactElement } & Omit<IconButtonProps, 'component'>)
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

const GridActionsCellItem = React.forwardRef<HTMLElement, GridActionsCellItemProps>(
  (props, ref) => {
    const rootProps = useGridRootProps();

    if (!props.showInMenu) {
      const { label, icon, showInMenu, onClick, ...other } = props;

      const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
      };

      return (
        <rootProps.slots.baseIconButton
          ref={ref as React.MutableRefObject<HTMLButtonElement>}
          size="small"
          role="menuitem"
          aria-label={label}
          {...other}
          onClick={handleClick}
          {...rootProps.slotProps?.baseIconButton}
        >
          {React.cloneElement(icon!, { fontSize: 'small' })}
        </rootProps.slots.baseIconButton>
      );
    }

    const {
      label,
      icon,
      showInMenu,
      onClick,
      closeMenuOnClick = true,
      closeMenu,
      ...other
    } = props;

    const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
      onClick?.(event);
      if (closeMenuOnClick) {
        closeMenu?.();
      }
    };

    return (
      <MenuItem ref={ref} {...(other as any)} onClick={handleClick}>
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        {label}
      </MenuItem>
    );
  },
);

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
