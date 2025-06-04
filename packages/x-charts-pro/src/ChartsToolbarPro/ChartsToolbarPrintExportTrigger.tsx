import * as React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { RenderProp, useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import { useChartsSlots } from '@mui/x-charts/internals';
import { useChartApiContext } from '../context';
import { ChartPrintExportOptions } from '../internals/plugins/useChartProExport';
import { ChartsSlotPropsPro, ChartsSlotsPro } from '../internals/material';

export interface ChartsToolbarPrintExportOptions extends ChartPrintExportOptions {
  /**
   * If `true`, this export option will be removed from the ChartsToolbarExport menu.
   * @default false
   */
  disableToolbarButton?: boolean;
}

export type ChartsToolbarPrintExportTriggerProps = ChartsSlotPropsPro['baseButton'] & {
  /**
   * A function to customize the rendering of the component.
   */
  render?: RenderProp<ChartsSlotPropsPro['baseButton']>;
  /**
   * The options to apply on the Print export.
   * @demos
   *   - [Print/Export as PDF](/x/react-charts/export/#print-export-as-pdf)
   */
  options?: ChartPrintExportOptions;
};

/**
 * A button that triggers a print export.
 * It renders the `baseButton` slot.
 *
 * Demos:
 *
 * - [Export](/x/react-charts/export/)
 */
const ChartsToolbarPrintExportTrigger = forwardRef<
  HTMLButtonElement,
  ChartsToolbarPrintExportTriggerProps
>(function ChartsToolbarPrintExportTrigger(props, ref) {
  const { render, options, onClick, ...other } = props;
  const { slots, slotProps } = useChartsSlots<ChartsSlotsPro>();
  const apiRef = useChartApiContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    apiRef.current.exportAsPrint(options);
    onClick?.(event);
  };

  const element = useComponentRenderer(slots.baseButton, render, {
    ...slotProps?.baseButton,
    onClick: handleClick,
    ...other,
    ref,
  });

  return <React.Fragment>{element}</React.Fragment>;
});

ChartsToolbarPrintExportTrigger.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  /**
   * The options to apply on the Print export.
   * @demos
   *   - [Print/Export as PDF](/x/react-charts/export/#print-export-as-pdf)
   */
  options: PropTypes.shape({
    fileName: PropTypes.string,
  }),
  /**
   * A function to customize the rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  style: PropTypes.object,
  tabIndex: PropTypes.number,
} as any;

export { ChartsToolbarPrintExportTrigger };
