import * as React from 'react';
import {
  type AxisId,
  useStore,
  useLinePlotData,
  selectorChartPreviewComputedXAxis,
  selectorChartPreviewComputedYAxis,
  type SeriesId,
} from '@mui/x-charts/internals';
import type { PreviewPlotProps } from './PreviewPlot.types';

interface LinePreviewPlotProps extends Pick<PreviewPlotProps, 'axisId'> {}

export function LinePreviewPlot({ axisId }: LinePreviewPlotProps) {
  const completedData = useLinePreviewData(axisId);
  return (
    <g>
      {completedData.map(({ d, seriesId, color, gradientId }) => {
        return (
          <PreviewLineElement
            key={seriesId}
            seriesId={seriesId}
            d={d}
            color={color}
            gradientId={gradientId}
          />
        );
      })}
    </g>
  );
}

export interface PreviewLineElementProps extends Omit<
  React.SVGProps<SVGPathElement>,
  'ref' | 'color' | 'id'
> {
  seriesId: SeriesId;
  gradientId?: string;
  color: string;
  d: string;
}

/**
 * Preview of the line element for the zoom preview.
 * Based on LineElement and AnimatedLine.
 */
function PreviewLineElement({ seriesId, color, gradientId, onClick, ...other }: PreviewLineElementProps) {
  return (
    <path
      stroke={gradientId ? `url(#${gradientId})` : color}
      strokeWidth={2}
      strokeLinejoin="round"
      fill="none"
      data-series={seriesId}
      {...other}
    />
  );
}

function useLinePreviewData(axisId: AxisId) {
  const store = useStore();

  const xAxes = store.use(selectorChartPreviewComputedXAxis, axisId);
  const yAxes = store.use(selectorChartPreviewComputedYAxis, axisId);

  return useLinePlotData(xAxes, yAxes);
}
