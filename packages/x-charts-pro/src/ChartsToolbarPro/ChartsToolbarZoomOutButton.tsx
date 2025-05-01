'use client';

import * as React from 'react';
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

export const ChartsToolbarZoomOutButton = React.forwardRef<
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
