import * as React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { type RenderProp, useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import { useChartsSlots } from '@mui/x-charts/internals';
import { useChartProApiContext } from '../context';
import { type ChartPrintExportOptions } from '../internals/plugins/useChartProExport';
import { type ChartsSlotPropsPro, type ChartsSlotsPro } from '../internals/material';

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
   *   - [Print/Export as PDF](https://mui.com/x/react-charts/export/#print-export-as-pdf)
   */
  options?: ChartPrintExportOptions;
};

/**
 * A button that triggers a print export.
 * It renders the `baseButton` slot.
 *
 * Demos:
 *
 * - [Export](https://mui.com/x/react-charts/export/)
 */
const ChartsToolbarPrintExportTrigger = forwardRef<
  HTMLButtonElement,
  ChartsToolbarPrintExportTriggerProps
>(function ChartsToolbarPrintExportTrigger(props, ref) {
  const { render, options, onClick, ...other } = props;
  const { slots, slotProps } = useChartsSlots<ChartsSlotsPro>();
  const apiRef = useChartProApiContext();

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

  return element;
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
   *   - [Print/Export as PDF](https://mui.com/x/react-charts/export/#print-export-as-pdf)
   */
  options: PropTypes.shape({
    copyStyles: PropTypes.bool,
    fileName: PropTypes.string,
    nonce: PropTypes.string,
    onBeforeExport: PropTypes.func,
  }),
  /**
   * A function to customize the rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  style: PropTypes.object,
  tabIndex: PropTypes.number,
} as any;

export { ChartsToolbarPrintExportTrigger };
