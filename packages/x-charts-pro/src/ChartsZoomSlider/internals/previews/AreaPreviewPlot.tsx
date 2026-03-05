import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  type AxisId,
  useStore,
  useAreaPlotData,
  selectorChartPreviewComputedXAxis,
  selectorChartPreviewComputedYAxis,
  type SeriesId,
} from '@mui/x-charts/internals';
import { type PreviewPlotProps } from './PreviewPlot.types';

const AreaPlotRoot = styled('g', {
  name: 'MuiAreaPlot',
  slot: 'Root',
})({});

interface AreaPreviewPlotProps extends Pick<PreviewPlotProps, 'axisId'> {}

export function AreaPreviewPlot({ axisId }: AreaPreviewPlotProps) {
  const completedData = useAreaPreviewData(axisId);

  return (
    <AreaPlotRoot>
      {completedData.map(
        ({ d, seriesId, color, area, gradientId }) =>
          !!area && (
            <PreviewAreaElement
              key={seriesId}
              seriesId={seriesId}
              d={d}
              color={color}
              gradientId={gradientId}
            />
          ),
      )}
    </AreaPlotRoot>
  );
}

export interface PreviewAreaElementProps extends Omit<
  React.SVGProps<SVGPathElement>,
  'ref' | 'color' | 'id'
> {
  seriesId: SeriesId;
  gradientId?: string;
  color: string;
  d: string;
}

/**
 * Preview of the area element for the zoom preview.
 * Based on AreaElement and AnimatedArea.
 */
function PreviewAreaElement({
  seriesId,
  color,
  gradientId,
  onClick,
  ...other
}: PreviewAreaElementProps) {
  return (
    <path
      fill={gradientId ? `url(#${gradientId})` : color}
      stroke="none"
      data-series={seriesId}
      {...other}
    />
  );
}

function useAreaPreviewData(axisId: AxisId) {
  const store = useStore();

  const xAxes = store.use(selectorChartPreviewComputedXAxis, axisId);
  const yAxes = store.use(selectorChartPreviewComputedYAxis, axisId);

  return useAreaPlotData(xAxes, yAxes);
}
