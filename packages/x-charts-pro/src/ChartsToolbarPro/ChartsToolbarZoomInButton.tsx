'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import { useChartContext, useChartSlots, ChartsSlotProps } from '@mui/x-charts/internals';
import { RenderProp, useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import { UseChartProZoomSignature } from '../internals/plugins/useChartProZoom';

interface ChartsToolbarZoomInButtonProps {
  /**
   * A function to customize the rendering of the component.
   */
  render?: RenderProp<ChartsSlotProps['baseIconButton']>;
}

/**
 * The zoom-in button for the chart toolbar.
 */
const ChartsToolbarZoomInButton = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<ChartsToolbarZoomInButtonProps>
>(function ChartsToolbarZoomInButton({ render, ...other }, ref) {
  const { slots, slotProps } = useChartSlots();
  const { instance } = useChartContext<[UseChartProZoomSignature]>();
  const element = useComponentRenderer(slots.baseIconButton, render, {
    ...slotProps?.baseIconButton,
    onClick: () => instance.zoomIn(),
    ...other,
    ref,
  });

  return <React.Fragment>{element}</React.Fragment>;
});

ChartsToolbarZoomInButton.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * A function to customize the rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { ChartsToolbarZoomInButton };
