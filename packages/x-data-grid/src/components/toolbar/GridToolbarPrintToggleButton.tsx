import * as React from 'react';
import PropTypes from 'prop-types';
import { ToggleButtonProps } from '@mui/material/ToggleButton';
import { TooltipProps } from '@mui/material/Tooltip';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

interface GridToolbarPrintToggleButtonProps {
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps?: { toggleButton?: Partial<ToggleButtonProps>; tooltip?: Partial<TooltipProps> };
}

const GridToolbarPrintToggleButton = React.forwardRef<
  HTMLButtonElement,
  GridToolbarPrintToggleButtonProps
>(function GridToolbarPrintToggleButton(props, ref) {
  const { slotProps = {} } = props;
  const toggleButtonProps = slotProps.toggleButton || {};
  const tooltipProps = slotProps.tooltip || {};

  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const showPrint = () => {
    apiRef.current.exportDataAsPrint();
  };

  return (
    <rootProps.slots.baseTooltip
      title={apiRef.current.getLocaleText('toolbarExportPrint')}
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
        sx={{
          border: 0,
        }}
        value="print"
        selected={false}
        {...toggleButtonProps}
        onChange={showPrint}
        {...rootProps.slotProps?.baseToggleButton}
      >
        <rootProps.slots.printIcon fontSize="small" />
      </rootProps.slots.baseToggleButton>
    </rootProps.slots.baseTooltip>
  );
});

GridToolbarPrintToggleButton.propTypes = {
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

export { GridToolbarPrintToggleButton };
