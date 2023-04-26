import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { symbol as d3Symbol, symbolsFill as d3SymbolsFill } from 'd3-shape';
import { AxisInteractionData } from '../context/InteractionProvider';
import { FormattedSeries, SeriesContext } from '../context/SeriesContextProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { getSymbol } from '../internals/utils';
import { ChartSeries, ChartSeriesType } from '../models/seriesType/config';
import { AxisDefaultized } from '../models/axis';

const format = (data: any) => (typeof data === 'object' ? `(${data.x}, ${data.y})` : data);

export type AxisContentProps = {
  /**
   * Data identifying the triggered axis.
   */
  // eslint-disable-next-line react/no-unused-prop-types
  axisData: AxisInteractionData;
  /**
   * The series linked to the triggered axis.
   */
  series: ChartSeries<ChartSeriesType>[];
  /**
   * The properties of the triggered axis.
   */
  axis: AxisDefaultized;
  /**
   * The index of the data item triggered.
   */
  dataIndex?: null | number;
  /**
   * The value associated to the current mouse position.
   */
  axisValue: any;
};
export function DefaultAxisContent(props: AxisContentProps) {
  const { series, axis, dataIndex, axisValue } = props;

  if (dataIndex == null) {
    return null;
  }
  const xAxisName = axis.id;

  const markerSize = 30; // TODO: allows customization
  const shape = 'square';
  return (
    <Paper sx={{ p: 1 }}>
      {axisValue != null && (
        <React.Fragment>
          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
            {xAxisName}: {axisValue.toLocaleString()}
          </Typography>
          <Divider />
        </React.Fragment>
      )}
      {series.map(({ color, id, label, data }) => (
        <Typography variant="caption" key={id} sx={{ display: 'flex', alignItems: 'center' }}>
          <svg width={markerSize} height={markerSize}>
            <path
              // @ts-ignore TODO: Fix me
              d={d3Symbol(d3SymbolsFill[getSymbol(shape)], markerSize)()!}
              // TODO: Should be customizable. Maybe owner state would make more sense
              // fill={invertMarkers ? d.stroke : d.fill}
              // stroke={invertMarkers ? d.fill : d.stroke}
              fill={color}
              transform={`translate(${markerSize / 2}, ${markerSize / 2})`}
            />
          </svg>
          {label ?? id}: {format(data[dataIndex])}
        </Typography>
      ))}
    </Paper>
  );
}

export function AxisTooltipContent(props: {
  axisData: AxisInteractionData;
  content?: React.ElementType<AxisContentProps>;
}) {
  const { content, axisData } = props;
  const dataIndex = axisData.x && axisData.x.index;
  const axisValue = axisData.x && axisData.x.value;

  const { xAxisIds, xAxis } = React.useContext(CartesianContext);
  const series = React.useContext(SeriesContext);

  const USED_X_AXIS_ID = xAxisIds[0];

  const relevantSeries = React.useMemo(() => {
    const rep: any[] = [];
    (Object.keys(series) as (keyof FormattedSeries)[]).forEach((seriesType) => {
      series[seriesType]!.seriesOrder.forEach((seriesId) => {
        if (series[seriesType]!.series[seriesId].xAxisKey === USED_X_AXIS_ID) {
          rep.push(series[seriesType]!.series[seriesId]);
        }
      });
    });
    return rep;
  }, [USED_X_AXIS_ID, series]);

  const relevantAxis = React.useMemo(() => {
    return xAxis[USED_X_AXIS_ID];
  }, [USED_X_AXIS_ID, xAxis]);

  const Content = content ?? DefaultAxisContent;
  return (
    <Content
      axisData={axisData}
      series={relevantSeries}
      axis={relevantAxis}
      dataIndex={dataIndex}
      axisValue={axisValue}
    />
  );
}
