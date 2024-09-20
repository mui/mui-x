import * as React from 'react';
import PropTypes from 'prop-types';
import { ToggleButtonProps } from '@mui/material/ToggleButton';
import { TooltipProps } from '@mui/material/Tooltip';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridToolbarToggleButton } from './GridToolbarToggleButton';
import { GridToolbarTooltip } from './GridToolbarTooltip';

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
    <GridToolbarTooltip
      title={apiRef.current.getLocaleText('toolbarExportPrint')}
      {...tooltipProps}
    >
      <GridToolbarToggleButton
        ref={ref}
        value="print"
        selected={false}
        onChange={showPrint}
        {...toggleButtonProps}
      >
        <rootProps.slots.printIcon fontSize="small" />
      </GridToolbarToggleButton>
    </GridToolbarTooltip>
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
