import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export type GridActionsCellItemProps<IconButtonProps, MenuItemProps> = {
  label: string;
  icon?: React.ReactElement;
} & (
  | ({ showInMenu?: false; icon: React.ReactElement } & IconButtonProps)
  | ({ showInMenu: true } & MenuItemProps)
);

const GridActionsCellItem = React.forwardRef<
  HTMLButtonElement,
  GridActionsCellItemProps<
    JSX.IntrinsicElements['button'],
    React.DetailedHTMLProps<React.HTMLAttributes<unknown>, unknown>
  >
>((props, ref) => {
  const { label, icon, showInMenu, onClick, ...other } = props;

  const rootProps = useGridRootProps();

  const handleClick = (event: any) => {
    if (onClick) {
      onClick(event);
    }
  };

  if (!showInMenu) {
    return (
      <rootProps.slots.baseIconButton
        ref={ref}
        size="small"
        role="menuitem"
        aria-label={label}
        {...(other as any)}
        onClick={handleClick}
        {...rootProps.slotProps?.baseIconButton}
      >
        {React.cloneElement(icon!, { fontSize: 'small' })}
      </rootProps.slots.baseIconButton>
    );
  }

  return (
    <rootProps.slots.baseMenuItem ref={ref} {...(other as any)} onClick={onClick}>
      {icon && <rootProps.slots.baseListItemIcon>{icon}</rootProps.slots.baseListItemIcon>}
      {label}
    </rootProps.slots.baseMenuItem>
  );
});

GridActionsCellItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  icon: PropTypes.element,
  label: PropTypes.string.isRequired,
  showInMenu: PropTypes.bool,
} as any;

export { GridActionsCellItem };
