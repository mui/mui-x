'use client';
import * as React from 'react';
import { DrawingAreaContext } from '../context/DrawingAreaProvider';

export function useChartId() {
  const { chartId } = React.useContext(DrawingAreaContext);

  return React.useMemo(() => chartId, [chartId]);
}
