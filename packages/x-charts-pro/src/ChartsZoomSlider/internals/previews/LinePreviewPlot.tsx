import * as React from 'react';
import {
  useStore,
  useLinePlotData,
  selectorChartPreviewComputedXAxis,
  selectorChartPreviewComputedYAxis,
  selectorChartAxisZoomOptionsLookup,
} from '@mui/x-charts/internals';
import type { AxisId, SeriesId, ZoomMap } from '@mui/x-charts/internals';
import type { PreviewPlotProps } from './PreviewPlot.types';

interface LinePreviewPlotProps extends Pick<PreviewPlotProps, 'axisId' | 'seriesIds'> {}

export function LinePreviewPlot({ axisId, seriesIds }: LinePreviewPlotProps) {
  const completedData = useLinePreviewData(axisId);
  const seriesIdsSet = seriesIds ? new Set(seriesIds) : undefined;

  return (
    <g>
      {completedData.map(({ d, seriesId, color, gradientId }) => {
        if (seriesIdsSet && !seriesIdsSet.has(seriesId)) {
          return null;
        }
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
function PreviewLineElement({
  seriesId,
  color,
  gradientId,
  onClick,
  ...other
}: PreviewLineElementProps) {
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
  const zoomOptions = store.use(selectorChartAxisZoomOptionsLookup, axisId);

  // The preview is a full-range overview, so sample against its own range and width rather than the
  // active zoom — otherwise the main chart's zoom would change the preview's point density.
  const samplingOverride = React.useMemo(() => {
    const range = xAxes[axisId]?.scale.range() ?? [0, 0];
    return {
      zoomMap: new Map([
        [axisId, { axisId, start: zoomOptions.minStart, end: zoomOptions.maxEnd }],
      ]) as ZoomMap,
      availableSize: Math.abs(range[range.length - 1] - range[0]),
    };
  }, [xAxes, axisId, zoomOptions.minStart, zoomOptions.maxEnd]);

  return useLinePlotData(xAxes, yAxes, samplingOverride);
}
