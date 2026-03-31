import * as React from 'react';
import { AreaPreviewPlot } from './AreaPreviewPlot';
import { LinePreviewPlot } from './LinePreviewPlot';
import { type PreviewPlotProps } from './PreviewPlot.types';

export function LineAreaPreviewPlot({ axisId, seriesIds }: PreviewPlotProps) {
  return (
    <React.Fragment>
      <AreaPreviewPlot axisId={axisId} seriesIds={seriesIds} />
      <LinePreviewPlot axisId={axisId} seriesIds={seriesIds} />
    </React.Fragment>
  );
}
