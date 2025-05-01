'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import { useChartContext, useChartToolbarSlots } from '@mui/x-charts/internals';
import { ChartsToolbarSlotProps } from '@mui/x-charts/material';
import { RenderProp, useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import { UseChartProZoomSignature } from '../internals/plugins/useChartProZoom';

interface ChartsToolbarZoomOutButtonProps {
  /**
   * A function to customize the rendering of the component.
   */
  render?: RenderProp<ChartsToolbarSlotProps['baseIconButton']>;
}

/**
 * The zoom-out button for the chart toolbar.
 */
const ChartsToolbarZoomOutButton = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<ChartsToolbarZoomOutButtonProps>
>(function ChartsToolbarZoomOutButton({ render, ...other }, ref) {
  const { slots, slotProps } = useChartToolbarSlots();
  const { instance } = useChartContext<[UseChartProZoomSignature]>();
  const element = useComponentRenderer(slots.baseIconButton, render, {
    ...slotProps?.baseIconButton,
    onClick: () => instance.zoomOut(),
    ...other,
    ref,
  });

  return <React.Fragment>{element}</React.Fragment>;
});

ChartsToolbarZoomOutButton.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * A function to customize the rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { ChartsToolbarZoomOutButton };
