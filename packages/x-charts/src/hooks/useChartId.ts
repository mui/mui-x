import * as React from 'react';
import { DrawingContext } from '../context/DrawingProvider';

export function useChartId() {
  const { chartId } = React.useContext(DrawingContext);

  return React.useMemo(() => chartId, [chartId]);
}
