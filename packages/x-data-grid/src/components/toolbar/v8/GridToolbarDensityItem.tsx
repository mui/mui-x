import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useId as useId } from '@mui/utils';
import { ToggleButtonGroupProps } from '@mui/material/ToggleButtonGroup';
import { ToggleButtonProps } from '@mui/material/ToggleButton';
import { TooltipProps } from '@mui/material/Tooltip';
import { gridDensitySelector } from '../../../hooks/features/density/densitySelector';
import { GridDensity } from '../../../models/gridDensity';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import { GridDensityOption } from '../../../models/api/gridDensityApi';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { GridToolbarTooltip } from './GridToolbarTooltip';
import { GridToolbarToggleButtonGroup } from './GridToolbarToggleButtonGroup';
import { GridToolbarToggleButton } from './GridToolbarToggleButton';
import { GridToolbarPopover } from './GridToolbarPopover';

interface GridToolbarDensityItemProps {
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

const GridToolbarDensityItem = React.forwardRef<HTMLButtonElement, GridToolbarDensityItemProps>(
  function GridToolbarDensityItem(props, ref) {
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
        <GridToolbarTooltip
          title={apiRef.current.getLocaleText('toolbarDensityLabel')}
          {...tooltipProps}
        >
          <GridToolbarToggleButton
            ref={ref}
            aria-label={apiRef.current.getLocaleText('toolbarDensityLabel')}
            id={densityButtonId}
            value="density"
            selected={!!anchorEl}
            onChange={handleDensitySelectorOpen}
            {...toggleButtonProps}
          >
            {densityIcons[density]}
            <rootProps.slots.arrowDropDownIcon fontSize="small" sx={{ mr: -0.75 }} />
          </GridToolbarToggleButton>
        </GridToolbarTooltip>

        <GridToolbarPopover
          open={!!anchorEl}
          anchorEl={anchorEl}
          onClose={handleDensitySelectorOpen}
          id={densityMenuId}
        >
          <GridToolbarToggleButtonGroup
            value={density}
            onChange={handleDensityUpdate}
            exclusive
            {...toggleButtonGroupProps}
          >
            {densityOptions.map((option) => (
              <GridToolbarTooltip key={option.value} title={option.label} {...tooltipProps}>
                <GridToolbarToggleButton
                  value={option.value}
                  aria-label={option.label}
                  {...toggleButtonProps}
                >
                  {option.icon}
                </GridToolbarToggleButton>
              </GridToolbarTooltip>
            ))}
          </GridToolbarToggleButtonGroup>
        </GridToolbarPopover>
      </React.Fragment>
    );
  },
);

GridToolbarDensityItem.propTypes = {
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

export { GridToolbarDensityItem };
