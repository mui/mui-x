import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useId as useId, unstable_useForkRef as useForkRef } from '@mui/utils';
import { ButtonProps } from '@mui/material/Button';
import { TooltipProps } from '@mui/material/Tooltip';
import { gridDensitySelector } from '../../hooks/features/density/densitySelector';
import { GridDensity } from '../../models/gridDensity';
import { isHideMenuKey } from '../../utils/keyboardUtils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { GridDensityOption } from '../../models/api/gridDensityApi';
import { GridMenu } from '../menu/GridMenu';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridClasses } from '../../constants/gridClasses';

interface GridToolbarDensitySelectorProps {
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps?: { button?: Partial<ButtonProps>; tooltip?: Partial<TooltipProps> };
}

const GridToolbarDensitySelector = React.forwardRef<
  HTMLButtonElement,
  GridToolbarDensitySelectorProps
>(function GridToolbarDensitySelector(props, ref) {
  const { slotProps = {} } = props;
  const buttonProps = slotProps.button || {};
  const tooltipProps = slotProps.tooltip || {};
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const density = useGridSelector(apiRef, gridDensitySelector);
  const densityButtonId = useId();
  const densityMenuId = useId();

  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const handleRef = useForkRef(ref, buttonRef);

  const densityOptions: GridDensityOption[] = [
    {
      icon: <rootProps.slots.densityCompactIcon />,
      label: apiRef.current.getLocaleText('toolbarDensityCompact'),
      value: 'compact',
    },
    {
      icon: <rootProps.slots.densityStandardIcon />,
      label: apiRef.current.getLocaleText('toolbarDensityStandard'),
      value: 'standard',
    },
    {
      icon: <rootProps.slots.densityComfortableIcon />,
      label: apiRef.current.getLocaleText('toolbarDensityComfortable'),
      value: 'comfortable',
    },
  ];

  const startIcon = React.useMemo<React.ReactElement>(() => {
    switch (density) {
      case 'compact':
        return <rootProps.slots.densityCompactIcon />;
      case 'comfortable':
        return <rootProps.slots.densityComfortableIcon />;
      default:
        return <rootProps.slots.densityStandardIcon />;
    }
  }, [density, rootProps]);

  const handleDensitySelectorOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen((prevOpen) => !prevOpen);
    buttonProps.onClick?.(event);
  };
  const handleDensitySelectorClose = () => {
    setOpen(false);
  };
  const handleDensityUpdate = (newDensity: GridDensity) => {
    apiRef.current.setDensity(newDensity);
    setOpen(false);
  };

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
    }
    if (isHideMenuKey(event.key)) {
      setOpen(false);
    }
  };

  // Disable the button if the corresponding is disabled
  if (rootProps.disableDensitySelector) {
    return null;
  }

  const densityElements = densityOptions.map<React.ReactElement>((option, index) => (
    <rootProps.slots.baseMenuItem
      key={index}
      onClick={() => handleDensityUpdate(option.value)}
      selected={option.value === density}
      iconStart={option.icon}
    >
      {option.label}
    </rootProps.slots.baseMenuItem>
  ));

  return (
    <React.Fragment>
      <rootProps.slots.baseTooltip
        title={apiRef.current.getLocaleText('toolbarDensityLabel')}
        enterDelay={1000}
        {...rootProps.slotProps?.baseTooltip}
        {...tooltipProps}
      >
        <rootProps.slots.baseButton
          ref={handleRef}
          size="small"
          startIcon={startIcon}
          aria-label={apiRef.current.getLocaleText('toolbarDensityLabel')}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? densityMenuId : undefined}
          id={densityButtonId}
          onClick={handleDensitySelectorOpen}
          {...rootProps.slotProps?.baseButton}
          {...buttonProps}
        >
          {apiRef.current.getLocaleText('toolbarDensity')}
        </rootProps.slots.baseButton>
      </rootProps.slots.baseTooltip>
      <GridMenu
        open={open}
        target={buttonRef.current}
        onClose={handleDensitySelectorClose}
        position="bottom-start"
      >
        <rootProps.slots.baseMenuList
          id={densityMenuId}
          className={gridClasses.menuList}
          aria-labelledby={densityButtonId}
          onKeyDown={handleListKeyDown}
          autoFocusItem={open}
        >
          {densityElements}
        </rootProps.slots.baseMenuList>
      </GridMenu>
    </React.Fragment>
  );
});

GridToolbarDensitySelector.propTypes = {
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

export { GridToolbarDensitySelector };
