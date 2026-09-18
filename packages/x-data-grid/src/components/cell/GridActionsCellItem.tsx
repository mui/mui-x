'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import type { GridSlotProps, GridBaseIconProps } from '../../models/gridSlotsComponentsProps';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

interface GridActionsCellItemCommonProps {
  icon?: React.JSXElementConstructor<GridBaseIconProps> | React.ReactNode;
  /**
   * The component used for the root node.
   * If not set, and `href` is set, the item renders as an anchor tag.
   * from https://mui.com/material-ui/api/button-base/#ButtonBase-prop-component
   */
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
    const { label, icon, showInMenu, onClick, component, href, ...other } = props;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
    };

    return (
      <rootProps.slots.baseIconButton
        size="small"
        aria-label={label}
        component={component ?? (href ? 'a' : undefined)}
        href={href}
        {...other}
        onClick={handleClick}
        {...rootProps.slotProps?.baseIconButton}
        ref={ref as React.RefObject<HTMLButtonElement>}
      >
        {React.cloneElement(icon!, { fontSize: 'inherit' })}
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
    component,
    href,
    ...other
  } = props;

  const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
    onClick?.(event);
    if (closeMenuOnClick) {
      closeMenu?.();
    }
  };

  return (
    <rootProps.slots.baseMenuItem
      ref={ref}
      component={component ?? (href ? 'a' : undefined)}
      href={href}
      {...(other as any)}
      onClick={handleClick}
      iconStart={icon}
    >
      {label}
    </rootProps.slots.baseMenuItem>
  );
});

GridActionsCellItem.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  /**
   * The component used for the root node.
   * If not set, and `href` is set, the item renders as an anchor tag.
   * from https://mui.com/material-ui/api/button-base/#ButtonBase-prop-component
   */
  component: PropTypes.elementType,
  disabled: PropTypes.bool,
  /**
   * The URL to link to. If set, and `component` is not set, the component renders as an anchor tag.
   */
  href: PropTypes.string,
  icon: PropTypes /* @typescript-to-proptypes-ignore */.element,
  label: PropTypes.node,
  /**
   * The relationship of the linked URL.
   * Set it to `noopener noreferrer` when `target` is set to `_blank` to avoid a security issue.
   */
  rel: PropTypes.string,
  showInMenu: PropTypes.bool,
  style: PropTypes.object,
  /**
   * Where to display the linked URL, as the name for a browsing context.
   */
  target: PropTypes.string,
} as any;

export { GridActionsCellItem };
