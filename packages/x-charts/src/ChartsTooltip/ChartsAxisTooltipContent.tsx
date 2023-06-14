import * as React from 'react';
import Typography from '@mui/material/Typography';
import { AxisInteractionData } from '../context/InteractionProvider';
import { FormattedSeries, SeriesContext } from '../context/SeriesContextProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { ChartSeriesDefaultized, ChartSeriesType } from '../models/seriesType/config';
import { AxisDefaultized } from '../models/axis';
import {
  ChartsTooltipCell,
  ChartsTooltipPaper,
  ChartsTooltipTable,
  ChartsTooltipMark,
} from './ChartsTooltipTable';

export type ChartsAxisContentProps = {
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
export function DefaultChartsAxisContent(props: ChartsAxisContentProps) {
  const { series, axis, dataIndex, axisValue } = props;

  if (dataIndex == null) {
    return null;
  }
  const axisFormatter = axis.valueFormatter ?? ((v) => v.toLocaleString());
  return (
    <ChartsTooltipPaper>
      <ChartsTooltipTable>
        {axisValue != null && (
          <thead>
            <tr>
              <ChartsTooltipCell colSpan={3}>
                <Typography variant="caption">{axisFormatter(axisValue)}</Typography>
              </ChartsTooltipCell>
            </tr>
          </thead>
        )}
        <tbody>
          {series.map(({ color, id, label, valueFormatter, data }: ChartSeriesDefaultized<any>) => (
            <tr key={id}>
              <ChartsTooltipCell>
                <ChartsTooltipMark ownerState={{ color }} />
              </ChartsTooltipCell>

              <ChartsTooltipCell>
                {label ? <Typography variant="caption">{label}</Typography> : null}
              </ChartsTooltipCell>

              <ChartsTooltipCell>
                <Typography variant="caption">{valueFormatter(data[dataIndex])}</Typography>
              </ChartsTooltipCell>
            </tr>
          ))}
        </tbody>
      </ChartsTooltipTable>
    </ChartsTooltipPaper>
  );
}

export function ChartsAxisTooltipContent(props: {
  axisData: AxisInteractionData;
  content?: React.ElementType<ChartsAxisContentProps>;
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

  const Content = content ?? DefaultChartsAxisContent;
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
