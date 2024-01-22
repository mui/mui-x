import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { ChartSeriesDefaultized } from '../models/seriesType/config';
import {
  ChartsTooltipCell,
  ChartsTooltipPaper,
  ChartsTooltipTable,
  ChartsTooltipMark,
  ChartsTooltipRow,
} from './ChartsTooltipTable';
import type { ChartsAxisContentProps } from './ChartsAxisTooltipContent';

function DefaultChartsAxisTooltipContent(props: ChartsAxisContentProps) {
  const { series, axis, dataIndex, axisValue, sx, classes } = props;

  if (dataIndex == null) {
    return null;
  }
  const axisFormatter = axis.valueFormatter ?? ((v) => v.toLocaleString());
  return (
    <ChartsTooltipPaper sx={sx} className={classes.root}>
      <ChartsTooltipTable className={classes.table}>
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
          {series.map(({ color, id, label, valueFormatter, data }: ChartSeriesDefaultized<any>) => {
            const formattedValue = valueFormatter(data[dataIndex]);
            if (formattedValue == null) {
              return null;
            }
            return (
              <ChartsTooltipRow key={id} className={classes.row}>
                <ChartsTooltipCell className={clsx(classes.markCell, classes.cell)}>
                  <ChartsTooltipMark
                    ownerState={{ color }}
                    boxShadow={1}
                    className={classes.mark}
                  />
                </ChartsTooltipCell>

                <ChartsTooltipCell className={clsx(classes.labelCell, classes.cell)}>
                  {label ? <Typography>{label}</Typography> : null}
                </ChartsTooltipCell>

                <ChartsTooltipCell className={clsx(classes.valueCell, classes.cell)}>
                  <Typography>{formattedValue}</Typography>
                </ChartsTooltipCell>
              </ChartsTooltipRow>
            );
          })}
        </tbody>
      </ChartsTooltipTable>
    </ChartsTooltipPaper>
  );
}

DefaultChartsAxisTooltipContent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The properties of the triggered axis.
   */
  axis: PropTypes.oneOfType([
    PropTypes.shape({
      axisId: PropTypes.string,
      classes: PropTypes.object,
      data: PropTypes.array,
      dataKey: PropTypes.string,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      hideTooltip: PropTypes.bool,
      id: PropTypes.string.isRequired,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      labelStyle: PropTypes.object,
      max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      position: PropTypes.oneOf(['bottom', 'left', 'right', 'top']),
      scale: PropTypes.func.isRequired,
      scaleType: PropTypes.oneOf(['time']).isRequired,
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickInterval: PropTypes.oneOfType([
        PropTypes.oneOf(['auto']),
        PropTypes.array,
        PropTypes.func,
      ]),
      tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number.isRequired,
      tickSize: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
    PropTypes.shape({
      axisId: PropTypes.string,
      barGapRatio: PropTypes.number.isRequired,
      categoryGapRatio: PropTypes.number.isRequired,
      classes: PropTypes.object,
      data: PropTypes.array,
      dataKey: PropTypes.string,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      hideTooltip: PropTypes.bool,
      id: PropTypes.string.isRequired,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      labelStyle: PropTypes.object,
      max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      position: PropTypes.oneOf(['bottom', 'left', 'right', 'top']),
      scale: PropTypes.func.isRequired,
      scaleType: PropTypes.oneOf(['band']).isRequired,
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickInterval: PropTypes.oneOfType([
        PropTypes.oneOf(['auto']),
        PropTypes.array,
        PropTypes.func,
      ]),
      tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number.isRequired,
      tickSize: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
    PropTypes.shape({
      axisId: PropTypes.string,
      classes: PropTypes.object,
      data: PropTypes.array,
      dataKey: PropTypes.string,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      hideTooltip: PropTypes.bool,
      id: PropTypes.string.isRequired,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      labelStyle: PropTypes.object,
      max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      position: PropTypes.oneOf(['bottom', 'left', 'right', 'top']),
      scale: PropTypes.func.isRequired,
      scaleType: PropTypes.oneOf(['linear']).isRequired,
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickInterval: PropTypes.oneOfType([
        PropTypes.oneOf(['auto']),
        PropTypes.array,
        PropTypes.func,
      ]),
      tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number.isRequired,
      tickSize: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
    PropTypes.shape({
      axisId: PropTypes.string,
      classes: PropTypes.object,
      data: PropTypes.array,
      dataKey: PropTypes.string,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      hideTooltip: PropTypes.bool,
      id: PropTypes.string.isRequired,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      labelStyle: PropTypes.object,
      max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      position: PropTypes.oneOf(['bottom', 'left', 'right', 'top']),
      scale: PropTypes.func.isRequired,
      scaleType: PropTypes.oneOf(['point']).isRequired,
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickInterval: PropTypes.oneOfType([
        PropTypes.oneOf(['auto']),
        PropTypes.array,
        PropTypes.func,
      ]),
      tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number.isRequired,
      tickSize: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
    PropTypes.shape({
      axisId: PropTypes.string,
      classes: PropTypes.object,
      data: PropTypes.array,
      dataKey: PropTypes.string,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      hideTooltip: PropTypes.bool,
      id: PropTypes.string.isRequired,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      labelStyle: PropTypes.object,
      max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      position: PropTypes.oneOf(['bottom', 'left', 'right', 'top']),
      scale: PropTypes.func.isRequired,
      scaleType: PropTypes.oneOf(['log']).isRequired,
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickInterval: PropTypes.oneOfType([
        PropTypes.oneOf(['auto']),
        PropTypes.array,
        PropTypes.func,
      ]),
      tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number.isRequired,
      tickSize: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
    PropTypes.shape({
      axisId: PropTypes.string,
      classes: PropTypes.object,
      data: PropTypes.array,
      dataKey: PropTypes.string,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      hideTooltip: PropTypes.bool,
      id: PropTypes.string.isRequired,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      labelStyle: PropTypes.object,
      max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      position: PropTypes.oneOf(['bottom', 'left', 'right', 'top']),
      scale: PropTypes.func.isRequired,
      scaleType: PropTypes.oneOf(['pow']).isRequired,
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickInterval: PropTypes.oneOfType([
        PropTypes.oneOf(['auto']),
        PropTypes.array,
        PropTypes.func,
      ]),
      tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number.isRequired,
      tickSize: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
    PropTypes.shape({
      axisId: PropTypes.string,
      classes: PropTypes.object,
      data: PropTypes.array,
      dataKey: PropTypes.string,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      hideTooltip: PropTypes.bool,
      id: PropTypes.string.isRequired,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      labelStyle: PropTypes.object,
      max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      position: PropTypes.oneOf(['bottom', 'left', 'right', 'top']),
      scale: PropTypes.func.isRequired,
      scaleType: PropTypes.oneOf(['sqrt']).isRequired,
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickInterval: PropTypes.oneOfType([
        PropTypes.oneOf(['auto']),
        PropTypes.array,
        PropTypes.func,
      ]),
      tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number.isRequired,
      tickSize: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
    PropTypes.shape({
      axisId: PropTypes.string,
      classes: PropTypes.object,
      data: PropTypes.array,
      dataKey: PropTypes.string,
      disableLine: PropTypes.bool,
      disableTicks: PropTypes.bool,
      fill: PropTypes.string,
      hideTooltip: PropTypes.bool,
      id: PropTypes.string.isRequired,
      label: PropTypes.string,
      labelFontSize: PropTypes.number,
      labelStyle: PropTypes.object,
      max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      position: PropTypes.oneOf(['bottom', 'left', 'right', 'top']),
      scale: PropTypes.func.isRequired,
      scaleType: PropTypes.oneOf(['utc']).isRequired,
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      stroke: PropTypes.string,
      tickFontSize: PropTypes.number,
      tickInterval: PropTypes.oneOfType([
        PropTypes.oneOf(['auto']),
        PropTypes.array,
        PropTypes.func,
      ]),
      tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
      tickLabelStyle: PropTypes.object,
      tickMaxStep: PropTypes.number,
      tickMinStep: PropTypes.number,
      tickNumber: PropTypes.number.isRequired,
      tickSize: PropTypes.number,
      valueFormatter: PropTypes.func,
    }),
  ]).isRequired,
  /**
   * Data identifying the triggered axis.
   */
  axisData: PropTypes.shape({
    x: PropTypes.shape({
      index: PropTypes.number,
      value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]).isRequired,
    }),
    y: PropTypes.shape({
      index: PropTypes.number,
      value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]).isRequired,
    }),
  }).isRequired,
  /**
   * The value associated to the current mouse position.
   */
  axisValue: PropTypes.any.isRequired,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object.isRequired,
  /**
   * The index of the data item triggered.
   */
  dataIndex: PropTypes.number,
  /**
   * The series linked to the triggered axis.
   */
  series: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        area: PropTypes.bool,
        color: PropTypes.string.isRequired,
        connectNulls: PropTypes.bool,
        curve: PropTypes.oneOf([
          'catmullRom',
          'linear',
          'monotoneX',
          'monotoneY',
          'natural',
          'step',
          'stepAfter',
          'stepBefore',
        ]),
        data: PropTypes.arrayOf(PropTypes.number).isRequired,
        dataKey: PropTypes.string,
        disableHighlight: PropTypes.bool,
        highlightScope: PropTypes.shape({
          faded: PropTypes.oneOf(['global', 'none', 'series']),
          highlighted: PropTypes.oneOf(['item', 'none', 'series']),
        }),
        id: PropTypes.string.isRequired,
        label: PropTypes.string,
        showMark: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
        stack: PropTypes.string,
        stackOffset: PropTypes.oneOf(['diverging', 'expand', 'none', 'silhouette', 'wiggle']),
        stackOrder: PropTypes.oneOf([
          'appearance',
          'ascending',
          'descending',
          'insideOut',
          'none',
          'reverse',
        ]),
        type: PropTypes.oneOf(['line']).isRequired,
        valueFormatter: PropTypes.func.isRequired,
        xAxisKey: PropTypes.string,
        yAxisKey: PropTypes.string,
      }),
      PropTypes.shape({
        color: PropTypes.string.isRequired,
        data: PropTypes.arrayOf(PropTypes.number).isRequired,
        dataKey: PropTypes.string,
        highlightScope: PropTypes.shape({
          faded: PropTypes.oneOf(['global', 'none', 'series']),
          highlighted: PropTypes.oneOf(['item', 'none', 'series']),
        }),
        id: PropTypes.string.isRequired,
        label: PropTypes.string,
        layout: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
        stack: PropTypes.string,
        stackOffset: PropTypes.oneOf(['diverging', 'expand', 'none', 'silhouette', 'wiggle']),
        stackOrder: PropTypes.oneOf([
          'appearance',
          'ascending',
          'descending',
          'insideOut',
          'none',
          'reverse',
        ]),
        type: PropTypes.oneOf(['bar']).isRequired,
        valueFormatter: PropTypes.func.isRequired,
        xAxisKey: PropTypes.string,
        yAxisKey: PropTypes.string,
      }),
      PropTypes.shape({
        color: PropTypes.string.isRequired,
        data: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
          }),
        ).isRequired,
        disableHover: PropTypes.bool,
        highlightScope: PropTypes.shape({
          faded: PropTypes.oneOf(['global', 'none', 'series']),
          highlighted: PropTypes.oneOf(['item', 'none', 'series']),
        }),
        id: PropTypes.string.isRequired,
        label: PropTypes.string,
        markerSize: PropTypes.number,
        type: PropTypes.oneOf(['scatter']).isRequired,
        valueFormatter: PropTypes.func.isRequired,
        xAxisKey: PropTypes.string,
        yAxisKey: PropTypes.string,
      }),
      PropTypes.shape({
        arcLabel: PropTypes.oneOfType([
          PropTypes.oneOf(['formattedValue', 'label', 'value']),
          PropTypes.func,
        ]),
        arcLabelMinAngle: PropTypes.number,
        arcLabelRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        color: PropTypes.string,
        cornerRadius: PropTypes.number,
        cx: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        cy: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        data: PropTypes.arrayOf(
          PropTypes.shape({
            color: PropTypes.string.isRequired,
            endAngle: PropTypes.number.isRequired,
            formattedValue: PropTypes.string.isRequired,
            id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            index: PropTypes.number.isRequired,
            label: PropTypes.string,
            padAngle: PropTypes.number.isRequired,
            startAngle: PropTypes.number.isRequired,
            value: PropTypes.number.isRequired,
          }),
        ).isRequired,
        endAngle: PropTypes.number,
        faded: PropTypes.shape({
          additionalRadius: PropTypes.number,
          arcLabelRadius: PropTypes.number,
          color: PropTypes.string,
          cornerRadius: PropTypes.number,
          innerRadius: PropTypes.number,
          outerRadius: PropTypes.number,
          paddingAngle: PropTypes.number,
        }),
        highlighted: PropTypes.shape({
          additionalRadius: PropTypes.number,
          arcLabelRadius: PropTypes.number,
          color: PropTypes.string,
          cornerRadius: PropTypes.number,
          innerRadius: PropTypes.number,
          outerRadius: PropTypes.number,
          paddingAngle: PropTypes.number,
        }),
        highlightScope: PropTypes.shape({
          faded: PropTypes.oneOf(['global', 'none', 'series']),
          highlighted: PropTypes.oneOf(['item', 'none', 'series']),
        }),
        id: PropTypes.string.isRequired,
        innerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        outerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        paddingAngle: PropTypes.number,
        sortingValues: PropTypes.oneOfType([
          PropTypes.oneOf(['asc', 'desc', 'none']),
          PropTypes.func,
        ]),
        startAngle: PropTypes.number,
        type: PropTypes.oneOf(['pie']).isRequired,
        valueFormatter: PropTypes.func.isRequired,
      }),
    ]).isRequired,
  ).isRequired,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { DefaultChartsAxisTooltipContent };
