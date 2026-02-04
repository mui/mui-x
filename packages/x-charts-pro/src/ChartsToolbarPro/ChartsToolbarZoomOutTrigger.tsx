'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import {
  useChartContext,
  type ChartsSlotProps,
  useChartsSlots,
  type UseChartCartesianAxisSignature,
} from '@mui/x-charts/internals';
import { type RenderProp, useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import {
  selectorChartCanZoomOut,
  type UseChartProZoomSignature,
} from '../internals/plugins/useChartProZoom';

interface ChartsToolbarZoomOutTriggerProps {
  /**
   * A function to customize the rendering of the component.
   */
  render?: RenderProp<ChartsSlotProps['baseButton']>;
}

/**
 * A button that zooms the chart out.
 * It renders the `baseButton` slot.
 */
const ChartsToolbarZoomOutTrigger = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<ChartsToolbarZoomOutTriggerProps>
>(function ChartsToolbarZoomOutTrigger({ render, ...other }, ref) {
  const { slots, slotProps } = useChartsSlots();
  const { instance, store } =
    useChartContext<[UseChartCartesianAxisSignature, UseChartProZoomSignature]>();
  const disabled = store.use(selectorChartCanZoomOut);

  const element = useComponentRenderer(slots.baseButton, render, {
    ...slotProps.baseButton,
    onClick: () => instance.zoomOut(),
    disabled,
    ...other,
    ref,
  });

  return <React.Fragment>{element}</React.Fragment>;
});

ChartsToolbarZoomOutTrigger.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * A function to customize the rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { ChartsToolbarZoomOutTrigger };
