import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { AxisInteractionData } from '../context/InteractionProvider';
import { SeriesContext } from '../context/SeriesContextProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import {
  CartesianChartSeriesType,
  ChartSeriesDefaultized,
  ChartSeriesType,
} from '../models/seriesType/config';
import { AxisDefaultized } from '../models/axis';
import {
  ChartsTooltipCell,
  ChartsTooltipPaper,
  ChartsTooltipTable,
  ChartsTooltipMark,
  ChartsTooltipRow,
} from './ChartsTooltipTable';
import { ChartsTooltipClasses } from './tooltipClasses';

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
  /**
   * Override or extend the styles applied to the component.
   */
  classes: ChartsTooltipClasses;
  sx?: SxProps<Theme>;
};
export function DefaultChartsAxisContent(props: ChartsAxisContentProps) {
  const { series, axis, dataIndex, axisValue, sx, classes } = props;

  if (dataIndex == null) {
    return null;
  }
  const axisFormatter = axis.valueFormatter ?? ((v) => v.toLocaleString());
  return (
    <ChartsTooltipPaper sx={sx} variant="outlined" className={classes.root}>
      <ChartsTooltipTable>
        {axisValue != null && !axis.hideTooltip && (
          <thead>
            <ChartsTooltipRow>
              <ChartsTooltipCell colSpan={3}>
                <Typography>{axisFormatter(axisValue)}</Typography>
              </ChartsTooltipCell>
            </ChartsTooltipRow>
          </thead>
        )}
        <tbody>
          {series.map(({ color, id, label, valueFormatter, data }: ChartSeriesDefaultized<any>) => (
            <ChartsTooltipRow key={id}>
              <ChartsTooltipCell className={classes.markCell}>
                <ChartsTooltipMark ownerState={{ color }} boxShadow={1} />
              </ChartsTooltipCell>

              <ChartsTooltipCell className={classes.labelCell}>
                {label ? <Typography>{label}</Typography> : null}
              </ChartsTooltipCell>

              <ChartsTooltipCell className={classes.valueCell}>
                <Typography>{valueFormatter(data[dataIndex])}</Typography>
              </ChartsTooltipCell>
            </ChartsTooltipRow>
          ))}
        </tbody>
      </ChartsTooltipTable>
    </ChartsTooltipPaper>
  );
}

export function ChartsAxisTooltipContent(props: {
  axisData: AxisInteractionData;
  content?: React.ElementType<ChartsAxisContentProps>;
  sx?: SxProps<Theme>;
  classes: ChartsAxisContentProps['classes'];
}) {
  const { content, axisData, sx, classes } = props;
  const dataIndex = axisData.x && axisData.x.index;
  const axisValue = axisData.x && axisData.x.value;

  const { xAxisIds, xAxis } = React.useContext(CartesianContext);
  const series = React.useContext(SeriesContext);

  const USED_X_AXIS_ID = xAxisIds[0];

  const relevantSeries = React.useMemo(() => {
    const rep: any[] = [];
    (
      Object.keys(series).filter((seriesType) =>
        ['bar', 'line', 'scatter'].includes(seriesType),
      ) as CartesianChartSeriesType[]
    ).forEach((seriesType) => {
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
      sx={sx}
      classes={classes}
    />
  );
}
