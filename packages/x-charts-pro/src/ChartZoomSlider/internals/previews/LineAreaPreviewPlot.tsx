import * as React from 'react';
import { AreaPreviewPlot } from './AreaPreviewPlot';
import { LinePreviewPlot } from './LinePreviewPlot';
import { type PreviewPlotProps } from './PreviewPlot.types';

export function LineAreaPreviewPlot({ axisId }: PreviewPlotProps) {
  return (
    <React.Fragment>
      <AreaPreviewPlot axisId={axisId} />
      <LinePreviewPlot axisId={axisId} />
    </React.Fragment>
  );
}
