import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useId as useId } from '@mui/utils';
import { ToggleButtonGroupProps } from '@mui/material/ToggleButtonGroup';
import { ToggleButtonProps } from '@mui/material/ToggleButton';
import { TooltipProps } from '@mui/material/Tooltip';
import { gridDensitySelector } from '../../hooks/features/density/densitySelector';
import { GridDensity } from '../../models/gridDensity';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { GridDensityOption } from '../../models/api/gridDensityApi';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

interface GridToolbarDensityToggleButtonProps {
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps?: {
    toggleButtonGroup?: Partial<ToggleButtonGroupProps>;
    toggleButton?: Partial<ToggleButtonProps>;
    tooltip?: Partial<TooltipProps>;
  };
}

const GridToolbarDensityToggleButton = React.forwardRef<
  HTMLButtonElement,
  GridToolbarDensityToggleButtonProps
>(function GridToolbarDensityToggleButton(props, ref) {
  const { slotProps = {} } = props;
  const toggleButtonGroupProps = slotProps.toggleButtonGroup || {};
  const toggleButtonProps = slotProps.toggleButton || {};
  const tooltipProps = slotProps.tooltip || {};
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const density = useGridSelector(apiRef, gridDensitySelector);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const densityButtonId = useId();
  const densityMenuId = useId();

  const handleDensitySelectorOpen = (event: React.MouseEvent) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget as HTMLButtonElement);
    }
  };

  const densityIcons = {
    compact: <rootProps.slots.densityCompactIcon fontSize="small" />,
    standard: <rootProps.slots.densityStandardIcon fontSize="small" />,
    comfortable: <rootProps.slots.densityComfortableIcon fontSize="small" />,
  };

  const densityOptions: GridDensityOption[] = [
    {
      icon: densityIcons.compact,
      label: apiRef.current.getLocaleText('toolbarDensityCompact'),
      value: 'compact',
    },
    {
      icon: densityIcons.standard,
      label: apiRef.current.getLocaleText('toolbarDensityStandard'),
      value: 'standard',
    },
    {
      icon: densityIcons.comfortable,
      label: apiRef.current.getLocaleText('toolbarDensityComfortable'),
      value: 'comfortable',
    },
  ];

  const handleDensityUpdate = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    newDensity: GridDensity,
  ) => {
    if (newDensity !== null) {
      apiRef.current.setDensity(newDensity);
    }
    setAnchorEl(null);
  };

  if (rootProps.disableDensitySelector) {
    return null;
  }

  return (
    <React.Fragment>
      <rootProps.slots.baseTooltip
        title={apiRef.current.getLocaleText('toolbarDensityLabel')}
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
        <rootProps.slots.baseToggleButton
          ref={ref}
          size="small"
          aria-label={apiRef.current.getLocaleText('toolbarDensityLabel')}
          id={densityButtonId}
          sx={{
            border: 0,
          }}
          {...toggleButtonProps}
          value="density"
          selected={!!anchorEl}
          onChange={handleDensitySelectorOpen}
          {...rootProps.slotProps?.baseToggleButton}
        >
          {densityIcons[density]}
          <rootProps.slots.arrowDropDownIcon fontSize="small" sx={{ mr: -0.75 }} />
        </rootProps.slots.baseToggleButton>
      </rootProps.slots.baseTooltip>

      <rootProps.slots.basePopover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleDensitySelectorOpen}
        id={densityMenuId}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <rootProps.slots.baseToggleButtonGroup
          color="primary"
          size="small"
          value={density}
          onChange={handleDensityUpdate}
          sx={{
            gap: 0.25,
            p: 0.5,
          }}
          exclusive
          {...toggleButtonGroupProps}
          {...rootProps.slotProps?.baseToggleButtonGroup}
        >
          {densityOptions.map((option) => (
            <rootProps.slots.baseTooltip
              key={option.value}
              title={option.label}
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
              <rootProps.slots.baseToggleButton
                value={option.value}
                aria-label={option.label}
                sx={{
                  border: 0,
                  borderRadius: '4px !important', // TODO: Properly style the toggle button
                }}
                {...toggleButtonProps}
                {...rootProps.slotProps?.baseToggleButton}
              >
                {option.icon}
              </rootProps.slots.baseToggleButton>
            </rootProps.slots.baseTooltip>
          ))}
        </rootProps.slots.baseToggleButtonGroup>
      </rootProps.slots.basePopover>
    </React.Fragment>
  );
});

GridToolbarDensityToggleButton.propTypes = {
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

export { GridToolbarDensityToggleButton };
