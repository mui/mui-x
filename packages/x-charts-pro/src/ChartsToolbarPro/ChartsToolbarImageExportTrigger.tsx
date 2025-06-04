import * as React from 'react';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { RenderProp, useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import { useChartsSlots } from '@mui/x-charts/internals';
import { useChartApiContext } from '../context';
import { ChartImageExportOptions } from '../internals/plugins/useChartProExport';
import { ChartsSlotPropsPro, ChartsSlotsPro } from '../internals/material';

export interface ChartsToolbarImageExportOptions
  extends Omit<ChartImageExportOptions, 'type'>,
    Required<Pick<ChartImageExportOptions, 'type'>> {}

export type ChartsToolbarImageExportTriggerProps = ChartsSlotPropsPro['baseButton'] & {
  /**
   * A function to customize the rendering of the component.
   */
  render?: RenderProp<ChartsSlotPropsPro['baseButton']>;
  /**
   * The options to apply on the image export.
   * @demos
   *   - [Export as Image](/x/react-charts/export/#export-as-image)
   */
  options?: ChartsToolbarImageExportOptions;
};

/**
 * A button that triggers an image export.
 * It renders the `baseButton` slot.
 *
 * Demos:
 *
 * - [Export](/x/react-charts/export/)
 */
export const ChartsToolbarImageExportTrigger = forwardRef<
  HTMLButtonElement,
  ChartsToolbarImageExportTriggerProps
>(function ChartsToolbarImageExportTrigger(props, ref) {
  const { render, options, onClick, ...other } = props;
  const { slots, slotProps } = useChartsSlots<ChartsSlotsPro>();
  const apiRef = useChartApiContext();

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
