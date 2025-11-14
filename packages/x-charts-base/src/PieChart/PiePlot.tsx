'use client';

import {
  getPieCoordinates,
  type PieArcPlotProps,
  usePieSeriesContext,
  useDrawingArea,
} from '@mui/x-charts';
import { getPercentageValue } from '@mui/x-charts/internals/getPercentageValue';
import { PieArcPlot } from './PieArcPlot';
import { PieArcLabelPlot } from './PieArcLabelPlot';

export interface PiePlotProps extends Pick<PieArcPlotProps, 'onItemClick'> {}

function PiePlot(props: PiePlotProps) {
  const { onItemClick } = props;
  const seriesData = usePieSeriesContext();
  const { left, top, width, height } = useDrawingArea();

  if (seriesData === undefined) {
    return null;
  }

  const { series, seriesOrder } = seriesData;

  return (
    <g>
      {seriesOrder.map((seriesId) => {
        const {
          innerRadius: innerRadiusParam,
          outerRadius: outerRadiusParam,
          cornerRadius,
          paddingAngle,
          data,
          cx: cxParam,
          cy: cyParam,
          highlighted,
          faded,
        } = series[seriesId];

        const { cx, cy, availableRadius } = getPieCoordinates(
          { cx: cxParam, cy: cyParam },
          { width, height },
        );

        const outerRadius = getPercentageValue(
          outerRadiusParam ?? availableRadius,
          availableRadius,
        );
        const innerRadius = getPercentageValue(innerRadiusParam ?? 0, availableRadius);
        return (
          <g
            key={seriesId}
            className={'-----series'}
            transform={`translate(${left + cx}, ${top + cy})`}
            data-series={seriesId}
          >
            <PieArcPlot
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              cornerRadius={cornerRadius}
              paddingAngle={paddingAngle}
              id={seriesId}
              data={data}
              highlighted={highlighted}
              faded={faded}
              onItemClick={onItemClick}
            />
          </g>
        );
      })}
      {seriesOrder.map((seriesId) => {
        const {
          innerRadius: innerRadiusParam,
          outerRadius: outerRadiusParam,
          arcLabelRadius: arcLabelRadiusParam,
          cornerRadius,
          paddingAngle,
          arcLabel,
          arcLabelMinAngle,
          data,
          cx: cxParam,
          cy: cyParam,
        } = series[seriesId];

        const { cx, cy, availableRadius } = getPieCoordinates(
          { cx: cxParam, cy: cyParam },
          { width, height },
        );

        const outerRadius = getPercentageValue(
          outerRadiusParam ?? availableRadius,
          availableRadius,
        );
        const innerRadius = getPercentageValue(innerRadiusParam ?? 0, availableRadius);

        const arcLabelRadius =
          arcLabelRadiusParam === undefined
            ? (outerRadius + innerRadius) / 2
            : getPercentageValue(arcLabelRadiusParam, availableRadius);

        return (
          <g
            key={seriesId}
            className={'-----series-labels'}
            transform={`translate(${left + cx}, ${top + cy})`}
            data-series={seriesId}
          >
            <PieArcLabelPlot
              innerRadius={innerRadius}
              outerRadius={outerRadius ?? availableRadius}
              arcLabelRadius={arcLabelRadius}
              cornerRadius={cornerRadius}
              paddingAngle={paddingAngle}
              id={seriesId}
              data={data}
              arcLabel={arcLabel}
              arcLabelMinAngle={arcLabelMinAngle}
            />
          </g>
        );
      })}
    </g>
  );
}

export { PiePlot };
