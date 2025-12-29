'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import useForkRef from '@mui/utils/useForkRef';
import { forwardRef } from '@mui/x-internals/forwardRef';
import type { GridSlotProps } from '../../models/gridSlotsComponentsProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridMenu } from '../menu/GridMenu';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridClasses } from '../../constants/gridClasses';

interface GridToolbarExportContainerProps {
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps?: {
    button?: Partial<GridSlotProps['baseButton']>;
    tooltip?: Partial<GridSlotProps['baseTooltip']>;
  };
}

const GridToolbarExportContainer = forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<GridToolbarExportContainerProps>
>(function GridToolbarExportContainer(props, ref) {
  const { children, slotProps = {} } = props;
  const buttonProps = slotProps.button || {};
  const tooltipProps = slotProps.tooltip || {};

  const apiRef = useGridApiContext();
  const { slots, slotProps: rootPropsSlotProps } = useGridRootProps();
  const exportButtonId = useId();
  const exportMenuId = useId();

  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const handleRef = useForkRef(ref, buttonRef);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen((prevOpen) => !prevOpen);
    buttonProps.onClick?.(event);
  };

  const handleMenuClose = () => setOpen(false);

  if (children == null) {
    return null;
  }

  return (
    <React.Fragment>
      <slots.baseTooltip
        title={apiRef.current.getLocaleText('toolbarExportLabel')}
        enterDelay={1000}
        {...rootPropsSlotProps?.baseTooltip}
        {...tooltipProps}
      >
        <slots.baseButton
          size="small"
          startIcon={<slots.exportIcon />}
          aria-expanded={open}
          aria-label={apiRef.current.getLocaleText('toolbarExportLabel')}
          aria-haspopup="menu"
          aria-controls={open ? exportMenuId : undefined}
          id={exportButtonId}
          {...rootPropsSlotProps?.baseButton}
          {...buttonProps}
          onClick={handleMenuOpen}
          ref={handleRef}
        >
          {apiRef.current.getLocaleText('toolbarExport')}
        </slots.baseButton>
      </slots.baseTooltip>
      <GridMenu
        open={open}
        target={buttonRef.current}
        onClose={handleMenuClose}
        position="bottom-end"
      >
        <slots.baseMenuList
          id={exportMenuId}
          className={gridClasses.menuList}
          aria-labelledby={exportButtonId}
          autoFocusItem={open}
        >
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) {
              return child;
            }
            return React.cloneElement<any>(child, { hideMenu: handleMenuClose });
          })}
        </slots.baseMenuList>
      </GridMenu>
    </React.Fragment>
  );
});

GridToolbarExportContainer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps: PropTypes.object,
} as any;

export { GridToolbarExportContainer };
