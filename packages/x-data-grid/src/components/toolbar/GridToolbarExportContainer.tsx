import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useId as useId, unstable_useForkRef as useForkRef } from '@mui/utils';
import MenuList from '@mui/material/MenuList';
import { ButtonProps } from '@mui/material/Button';
import { TooltipProps } from '@mui/material/Tooltip';
import { ToggleButtonProps } from '@mui/material/ToggleButton';
import { isHideMenuKey } from '../../utils/keyboardUtils';
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
    button?: Partial<ButtonProps>;
    tooltip?: Partial<TooltipProps>;
    toggleButton?: Partial<ToggleButtonProps>;
  };
}

const GridToolbarExportContainer = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<GridToolbarExportContainerProps>
>(function GridToolbarExportContainer(props, ref) {
  const { children, slotProps = {} } = props;
  const buttonProps = slotProps.button || {};
  const toggleButtonProps = slotProps.toggleButton;
  const tooltipProps = slotProps.tooltip || {};

  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const exportButtonId = useId();
  const exportMenuId = useId();

  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const handleRef = useForkRef(ref, buttonRef);

  const handleMenuOpen = (event: React.MouseEvent) => {
    setOpen((prevOpen) => !prevOpen);
    buttonProps.onClick?.(event as React.MouseEvent<HTMLButtonElement>);
  };

  const handleMenuClose = () => setOpen(false);

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
    }
    if (isHideMenuKey(event.key)) {
      handleMenuClose();
    }
  };

  if (children == null) {
    return null;
  }

  return (
    <React.Fragment>
      <rootProps.slots.baseTooltip
        title={apiRef.current.getLocaleText('toolbarExportLabel')}
        enterDelay={1000}
        slotProps={{
          popper: {
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, -10],
                },
              },
            ],
          },
        }}
        {...tooltipProps}
        {...rootProps.slotProps?.baseTooltip}
      >
        {toggleButtonProps ? (
          <rootProps.slots.baseToggleButton
            ref={handleRef}
            size="small"
            sx={{
              border: 0,
            }}
            aria-expanded={open}
            aria-label={apiRef.current.getLocaleText('toolbarExportLabel')}
            aria-haspopup="menu"
            aria-controls={open ? exportMenuId : undefined}
            id={exportButtonId}
            value="export"
            selected={open}
            {...toggleButtonProps}
            onChange={handleMenuOpen}
            {...rootProps.slotProps?.baseToggleButton}
          >
            <rootProps.slots.exportIcon fontSize="small" />
            <rootProps.slots.arrowDropDownIcon fontSize="small" sx={{ mr: -0.75 }} />
          </rootProps.slots.baseToggleButton>
        ) : (
          <rootProps.slots.baseButton
            ref={handleRef}
            size="small"
            startIcon={<rootProps.slots.exportIcon />}
            aria-expanded={open}
            aria-label={apiRef.current.getLocaleText('toolbarExportLabel')}
            aria-haspopup="menu"
            aria-controls={open ? exportMenuId : undefined}
            id={exportButtonId}
            {...buttonProps}
            onClick={handleMenuOpen}
            {...rootProps.slotProps?.baseButton}
          >
            {apiRef.current.getLocaleText('toolbarExport')}
          </rootProps.slots.baseButton>
        )}
      </rootProps.slots.baseTooltip>
      <GridMenu
        open={open}
        target={buttonRef.current}
        onClose={handleMenuClose}
        position="bottom-start"
      >
        <MenuList
          id={exportMenuId}
          className={gridClasses.menuList}
          aria-labelledby={exportButtonId}
          onKeyDown={handleListKeyDown}
          autoFocusItem={open}
        >
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) {
              return child;
            }
            return React.cloneElement<any>(child, { hideMenu: handleMenuClose });
          })}
        </MenuList>
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
