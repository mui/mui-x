'use client';
import * as React from 'react';
import { forwardRef } from '@mui/x-internals/forwardRef';
import type { GridSlotProps, GridBaseIconProps } from '../../models/gridSlotsComponentsProps';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

interface GridActionsCellItemCommonProps {
  icon?: React.JSXElementConstructor<GridBaseIconProps> | React.ReactNode;
  /** from https://mui.com/material-ui/api/button-base/#ButtonBase-prop-component */
  component?: React.ElementType;
}

export type GridActionsCellItemProps = GridActionsCellItemCommonProps &
  (
    | ({ showInMenu?: false; icon: React.ReactElement<any>; label: string } & Omit<
        GridSlotProps['baseIconButton'],
        'component'
      >)
    | ({
        showInMenu: true;
        /**
         * If false, the menu will not close when this item is clicked.
         * @default true
         */
        closeMenuOnClick?: boolean;
        closeMenu?: () => void;
        label: React.ReactNode;
      } & Omit<GridSlotProps['baseMenuItem'], 'component'>)
  );

const GridActionsCellItem = forwardRef<HTMLElement, GridActionsCellItemProps>((props, ref) => {
  const rootProps = useGridRootProps();

  if (!props.showInMenu) {
    const { label, icon, showInMenu, onClick, ...other } = props;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
    };

    const iconButtonSize =
      (other as any).size ?? (rootProps.slotProps?.baseIconButton as any)?.size ?? 'small';

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
        {React.cloneElement(icon!, { fontSize: iconButtonSize })}
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

export { GridActionsCellItem };
