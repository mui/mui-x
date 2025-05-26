import { Toolbar } from '@mui/x-charts/Toolbar';
import * as React from 'react';
import { useChartContext, useSelector } from '@mui/x-charts/internals';
import { selectorChartZoomIsEnabled } from '../internals/plugins/useChartProZoom';
import { ChartsToolbarZoomInButton } from './internal/ChartsToolbarZoomInButton';
import { ChartsToolbarZoomOutButton } from './internal/ChartsToolbarZoomOutButton';

/**
 * The chart toolbar component for the pro package.
 */
export function ChartsToolbarPro() {
  const { store } = useChartContext();
  const isZoomEnabled = useSelector(store, selectorChartZoomIsEnabled);

  const children: Array<React.JSX.Element> = [];

  if (isZoomEnabled) {
    children.push(<ChartsToolbarZoomInButton key="zoom-in" />);
    children.push(<ChartsToolbarZoomOutButton key="zoom-out" />);
  }

  if (children.length === 0) {
    return null;
  }

  return <Toolbar>{children}</Toolbar>;
}
