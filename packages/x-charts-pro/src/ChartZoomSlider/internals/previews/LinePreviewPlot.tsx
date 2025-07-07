import * as React from 'react';
import {
  AxisId,
  useSelector,
  useStore,
  useLinePlotData,
  selectorChartPreviewComputedXAxis,
  selectorChartPreviewComputedYAxis,
  SeriesId,
} from '@mui/x-charts/internals';
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
  const store = useStore();

  const xAxes = useSelector(store, selectorChartPreviewComputedXAxis, [axisId]);
  const yAxes = useSelector(store, selectorChartPreviewComputedYAxis, [axisId]);

  return useLinePlotData(xAxes, yAxes);
}
