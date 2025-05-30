'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import { useChartContext, ChartsSlotProps, useSelector } from '@mui/x-charts/internals';
import { RenderProp, useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import { ToolbarButton } from '@mui/x-charts/Toolbar';
import {
  selectorChartCanZoomIn,
  UseChartProZoomSignature,
} from '../internals/plugins/useChartProZoom';

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
  const { instance, store } = useChartContext<[UseChartProZoomSignature]>();
  const disabled = useSelector(store, selectorChartCanZoomIn);

  const element = useComponentRenderer(ToolbarButton, render, {
    onClick: () => instance.zoomIn(),
    disabled,
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
