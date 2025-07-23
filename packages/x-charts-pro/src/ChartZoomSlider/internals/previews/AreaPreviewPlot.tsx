import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  AxisId,
  useSelector,
  useStore,
  useAreaPlotData,
  selectorChartPreviewComputedXAxis,
  selectorChartPreviewComputedYAxis,
  SeriesId,
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
  const store = useStore();

  const xAxes = useSelector(store, selectorChartPreviewComputedXAxis, [axisId]);
  const yAxes = useSelector(store, selectorChartPreviewComputedYAxis, [axisId]);

  return useAreaPlotData(xAxes, yAxes);
}
