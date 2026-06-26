'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import { useChartsContext, useChartsSlots } from '@mui/x-charts/internals';
import type { ChartsSlotProps, UseChartCartesianAxisSignature } from '@mui/x-charts/internals';
import { useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import type { RenderProp } from '@mui/x-internals/useComponentRenderer';
import { selectorChartCanZoomIn } from '../internals/plugins/useChartProZoom';
import type { UseChartProZoomSignature } from '../internals/plugins/useChartProZoom';

interface ChartsToolbarZoomInTriggerProps {
  /**
   * A function to customize the rendering of the component.
   */
  render?: RenderProp<ChartsSlotProps['baseButton']>;
}

/**
 * A button that zooms the chart in.
 * It renders the `baseButton` slot.
 */
const ChartsToolbarZoomInTrigger = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<ChartsToolbarZoomInTriggerProps>
>(function ChartsToolbarZoomInTrigger({ render, ...other }, ref) {
  const { slots, slotProps } = useChartsSlots();
  const { instance, store } =
    useChartsContext<[UseChartCartesianAxisSignature, UseChartProZoomSignature]>();
  const disabled = !store.use(selectorChartCanZoomIn);

  const element = useComponentRenderer(slots.baseButton, render, {
    ...slotProps.baseButton,
    onClick: () => instance.zoomIn(),
    disabled,
    ...other,
    ref,
  });

  return <React.Fragment>{element}</React.Fragment>;
});

ChartsToolbarZoomInTrigger.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * A function to customize the rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { ChartsToolbarZoomInTrigger };
