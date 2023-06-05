import * as React from 'react';
import Typography from '@mui/material/Typography';
import { AxisInteractionData } from '../context/InteractionProvider';
import { FormattedSeries, SeriesContext } from '../context/SeriesContextProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { ChartSeriesDefaultized, ChartSeriesType } from '../models/seriesType/config';
import { AxisDefaultized } from '../models/axis';
import { TooltipCell, TooltipPaper, TooltipTable, TooltipMark } from './TooltipTable';

export type AxisContentProps = {
  /**
   * Data identifying the triggered axis.
   */
  // eslint-disable-next-line react/no-unused-prop-types
  axisData: AxisInteractionData;
  /**
   * The series linked to the triggered axis.
   */
  series: ChartSeriesDefaultized<ChartSeriesType>[];
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
  const axisFormatter = axis.valueFormatter ?? ((v) => v.toLocaleString());
  return (
    <TooltipPaper>
      <TooltipTable>
        {axisValue != null && (
          <thead>
            <tr>
              <TooltipCell colSpan={3}>
                <Typography variant="caption">{axisFormatter(axisValue)}</Typography>
              </TooltipCell>
            </tr>
          </thead>
        )}
        <tbody>
          {series.map(({ color, id, label, valueFormatter, data }: ChartSeriesDefaultized<any>) => (
            <tr key={id}>
              <TooltipCell>
                <TooltipMark ownerState={{ color }} />
              </TooltipCell>

              <TooltipCell>
                {label ? <Typography variant="caption">{label}</Typography> : null}
              </TooltipCell>

              <TooltipCell>
                <Typography variant="caption">{valueFormatter(data[dataIndex])}</Typography>
              </TooltipCell>
            </tr>
          ))}
        </tbody>
      </TooltipTable>
    </TooltipPaper>
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
        const axisKey = series[seriesType]!.series[seriesId].xAxisKey;
        if (axisKey === undefined || axisKey === USED_X_AXIS_ID) {
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
