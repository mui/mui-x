import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import { styled } from '@mui/material/styles';
import {
  AxisId,
  useAreaPlotData,
  selectorChartPreviewComputedXAxis,
  selectorChartPreviewComputedYAxis,
  SeriesId,
  useChartStore,
} from '@mui/x-charts/internals';
import { PreviewPlotProps } from './PreviewPlot.types';

const AreaPlotRoot = styled('g', {
  name: 'MuiAreaPlot',
  slot: 'Root',
})();

interface AreaPreviewPlotProps extends PreviewPlotProps {}

export function AreaPreviewPlot({ axisId }: AreaPreviewPlotProps) {
  const completedData = useAreaPreviewData(axisId);

  return (
    <AreaPlotRoot>
      {completedData.map(
        ({ d, seriesId, color, area, gradientId }) =>
          !!area && (
            <PreviewAreaElement
              key={seriesId}
              id={seriesId}
              d={d}
              color={color}
              gradientId={gradientId}
            />
          ),
      )}
    </AreaPlotRoot>
  );
}

export interface PreviewAreaElementProps
  extends Omit<React.SVGProps<SVGPathElement>, 'ref' | 'color' | 'id'> {
  id: SeriesId;
  gradientId?: string;
  color: string;
  d: string;
}

/**
 * Preview of the area element for the zoom preview.
 * Based on AreaElement and AnimatedArea.
 */
function PreviewAreaElement({ id, color, gradientId, onClick, ...other }: PreviewAreaElementProps) {
  return (
    <path
      fill={gradientId ? `url(#${gradientId})` : color}
      stroke="none"
      data-series={id}
      {...other}
    />
  );
}

function useAreaPreviewData(axisId: AxisId) {
  const store = useChartStore();

  const xAxes = useStore(store, selectorChartPreviewComputedXAxis, axisId);
  const yAxes = useStore(store, selectorChartPreviewComputedYAxis, axisId);

  return useAreaPlotData(xAxes, yAxes);
}
