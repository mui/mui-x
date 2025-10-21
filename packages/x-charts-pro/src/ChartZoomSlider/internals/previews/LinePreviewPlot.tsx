import * as React from 'react';
import {
  AxisId,
  useLinePlotData,
  selectorChartPreviewComputedXAxis,
  selectorChartPreviewComputedYAxis,
  SeriesId,
  useChartStore,
} from '@mui/x-charts/internals';
import { useStore } from '@mui/x-internals/store';
import { PreviewPlotProps } from './PreviewPlot.types';

interface LinePreviewPlotProps extends PreviewPlotProps {}

export function LinePreviewPlot({ axisId }: LinePreviewPlotProps) {
  const completedData = useLinePreviewData(axisId);
  return (
    <g>
      {completedData.map(({ d, seriesId, color, gradientId }) => {
        return (
          <PreviewLineElement
            key={seriesId}
            id={seriesId}
            d={d}
            color={color}
            gradientId={gradientId}
          />
        );
      })}
    </g>
  );
}

export interface PreviewLineElementProps
  extends Omit<React.SVGProps<SVGPathElement>, 'ref' | 'color' | 'id'> {
  id: SeriesId;
  gradientId?: string;
  color: string;
  d: string;
}

/**
 * Preview of the line element for the zoom preview.
 * Based on LineElement and AnimatedLine.
 */
function PreviewLineElement({ id, color, gradientId, onClick, ...other }: PreviewLineElementProps) {
  return (
    <path
      stroke={gradientId ? `url(#${gradientId})` : color}
      strokeWidth={2}
      strokeLinejoin="round"
      fill="none"
      data-series={id}
      {...other}
    />
  );
}

function useLinePreviewData(axisId: AxisId) {
  const store = useChartStore();

  const xAxes = useStore(store, selectorChartPreviewComputedXAxis, axisId);
  const yAxes = useStore(store, selectorChartPreviewComputedYAxis, axisId);

  return useLinePlotData(xAxes, yAxes);
}
