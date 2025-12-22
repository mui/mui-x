import * as React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { type RenderProp, useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import { useChartsSlots } from '@mui/x-charts/internals';
import { useChartProApiContext } from '../context';
import { type ChartImageExportOptions } from '../internals/plugins/useChartProExport';
import { type ChartsSlotPropsPro, type ChartsSlotsPro } from '../internals/material';

export interface ChartsToolbarImageExportOptions
  extends Omit<ChartImageExportOptions, 'type'>, Required<Pick<ChartImageExportOptions, 'type'>> {}

export type ChartsToolbarImageExportTriggerProps = ChartsSlotPropsPro['baseButton'] & {
  /**
   * A function to customize the rendering of the component.
   */
  render?: RenderProp<ChartsSlotPropsPro['baseButton']>;
  /**
   * The options to apply on the image export.
   * @demos
   *   - [Export as Image](https://mui.com/x/react-charts/export/#export-as-image)
   */
  options?: ChartsToolbarImageExportOptions;
};

/**
 * A button that triggers an image export.
 * It renders the `baseButton` slot.
 *
 * Demos:
 *
 * - [Export](https://mui.com/x/react-charts/export/)
 */
const ChartsToolbarImageExportTrigger = forwardRef<
  HTMLButtonElement,
  ChartsToolbarImageExportTriggerProps
>(function ChartsToolbarImageExportTrigger(props, ref) {
  const { render, options, onClick, ...other } = props;
  const { slots, slotProps } = useChartsSlots<ChartsSlotsPro>();
  const apiRef = useChartProApiContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    apiRef.current.exportAsImage(options);
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

ChartsToolbarImageExportTrigger.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  /**
   * The options to apply on the image export.
   * @demos
   *   - [Export as Image](https://mui.com/x/react-charts/export/#export-as-image)
   */
  options: PropTypes.shape({
    copyStyles: PropTypes.bool,
    fileName: PropTypes.string,
    nonce: PropTypes.string,
    onBeforeExport: PropTypes.func,
    quality: PropTypes.number,
    type: PropTypes.string.isRequired,
  }),
  /**
   * A function to customize the rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  style: PropTypes.object,
  tabIndex: PropTypes.number,
} as any;

export { ChartsToolbarImageExportTrigger };
