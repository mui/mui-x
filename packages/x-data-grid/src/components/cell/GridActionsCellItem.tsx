import * as React from 'react';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { GridSlotProps, GridBaseIconProps } from '../../models/gridSlotsComponentsProps';
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

/**
 * Checks if the component should allow default behavior for the click event.
 * Returns true for anchor elements
 */
function shouldAllowDefaultBehavior(event: React.MouseEvent): boolean {
  // Check if the event is coming from an anchor tag
  const target = event.currentTarget as HTMLElement;
  if (target.tagName === 'A' || target.getAttribute('href') !== null) {
    return true;
  }

  return false;
}

const GridActionsCellItem = forwardRef<HTMLElement, GridActionsCellItemProps>((props, ref) => {
  const rootProps = useGridRootProps();

  if (!props.showInMenu) {
    const { label, icon, showInMenu, onClick, ...other } = props;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      const allowDefault = shouldAllowDefaultBehavior(event);

      if (!allowDefault) {
        event.stopPropagation();
        event.preventDefault();
      }

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
    const allowDefault = shouldAllowDefaultBehavior(event);

    if (!allowDefault) {
      event.stopPropagation();
      event.preventDefault();
    }

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
