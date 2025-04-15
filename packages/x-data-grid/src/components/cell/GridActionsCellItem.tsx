import * as React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { GridSlotProps, GridBaseIconProps } from '../../models/gridSlotsComponentsProps';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

interface GridActionsCellItemCommonProps {
  label: string;
  icon?: React.JSXElementConstructor<GridBaseIconProps> | React.ReactNode;
  /** from https://mui.com/material-ui/api/button-base/#ButtonBase-prop-component */
  component?: React.ElementType;
}

export type GridActionsCellItemProps = GridActionsCellItemCommonProps &
  (
    | ({ showInMenu?: false; icon: React.ReactElement<any> } & Omit<
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
      } & Omit<GridSlotProps['baseMenuItem'], 'component'>)
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
  className: PropTypes.string,
  /**
   * from https://mui.com/material-ui/api/button-base/#ButtonBase-prop-component
   */
  component: PropTypes.elementType,
  disabled: PropTypes.bool,
  icon: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
    PropTypes.number,
    PropTypes.object,
    PropTypes.shape({
      '__@toStringTag@560': PropTypes.oneOf(['BigInt']).isRequired,
      toLocaleString: PropTypes.func.isRequired,
      toString: PropTypes.func.isRequired,
      valueOf: PropTypes.func.isRequired,
    }),
    PropTypes.shape({
      '__@iterator@557': PropTypes.func.isRequired,
    }),
    PropTypes.shape({
      children: PropTypes.node,
      key: PropTypes.string,
      props: PropTypes.any.isRequired,
      type: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
    }),
    PropTypes.shape({
      '__@toStringTag@560': PropTypes.string.isRequired,
      catch: PropTypes.func.isRequired,
      finally: PropTypes.func.isRequired,
      then: PropTypes.func.isRequired,
    }),
    PropTypes.shape({
      key: PropTypes.string,
      props: PropTypes.any.isRequired,
      toExponential: PropTypes.func.isRequired,
      toFixed: PropTypes.func.isRequired,
      toLocaleString: PropTypes.func.isRequired,
      toPrecision: PropTypes.func.isRequired,
      toString: PropTypes.func.isRequired,
      type: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
      valueOf: PropTypes.func.isRequired,
    }),
    PropTypes.shape({
      '__@toStringTag@560': PropTypes.oneOf(['BigInt']).isRequired,
      key: PropTypes.string,
      props: PropTypes.any.isRequired,
      toLocaleString: PropTypes.func.isRequired,
      toString: PropTypes.func.isRequired,
      type: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
      valueOf: PropTypes.func.isRequired,
    }),
    PropTypes.shape({
      key: PropTypes.string,
      props: PropTypes.any.isRequired,
      type: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
      valueOf: PropTypes.func.isRequired,
    }),
    PropTypes.shape({
      key: PropTypes.string,
      props: PropTypes.any.isRequired,
      type: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
    }),
    PropTypes.shape({
      '__@iterator@557': PropTypes.func.isRequired,
      key: PropTypes.string,
      props: PropTypes.any.isRequired,
      type: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
    }),
    PropTypes.shape({
      '__@toStringTag@560': PropTypes.string.isRequired,
      catch: PropTypes.func.isRequired,
      finally: PropTypes.func.isRequired,
      key: PropTypes.string,
      props: PropTypes.any.isRequired,
      then: PropTypes.func.isRequired,
      type: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
    }),
    PropTypes.string,
    PropTypes.bool,
  ]),
  label: PropTypes.string.isRequired,
  showInMenu: PropTypes.bool,
  style: PropTypes.object,
} as any;

export { GridActionsCellItem };
