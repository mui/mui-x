import * as React from 'react';
import { extent } from 'd3-array';

import { DEFAULT_MARGINS, DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from './const';
import Surface from './internals/components/Surface';
import { AxisConfig, Scales } from './models/axis';
import { LayoutConfig } from './models/layout';
import { AllSeriesType, CartesianSeriesType, ScatterSeriesType } from './models/seriesType';
import { CoordinateContext } from './context/CoordinateContext';
import { SeriesContext } from './context/SeriesContext';
import { getScale } from './hooks/useScale';

const getXSeriesDomain = (series: CartesianSeriesType[]) => {
  // Work only for scatter plot now

  const values = series.flatMap(({ data, type }) => {
    switch (type) {
      case 'scatter':
        return data.map(({ x }) => x);

      case 'bar':
      case 'line':
        return [];
      default:
        return [];
        break;
    }
  });
  if (values.length === 0) {
    return {};
  }

  const [min, max] = extent(values);
  return { min, max };
};

const getYSeriesDomain = (series: CartesianSeriesType[]) => {
  // Work only for scatter plot now
  const values = series.flatMap(({ data, type }) => {
    switch (type) {
      case 'scatter':
        return data.map(({ y }) => y);

      case 'bar':
      case 'line':
        return [0, ...data];
      default:
        return [];
        break;
    }
  });
  if (values.length === 0) {
    return {};
  }

  const [min, max] = extent(values);
  return { min, max };
};

type AxisParams = { [key: string]: { min: number; max: number; scale: Scales | undefined } };

const getAxisParams = (
  axis: AxisConfig[],
  series: CartesianSeriesType[],
  coordinate: 'x' | 'y' = 'x',
): AxisParams => {
  // Map series and axis
  const axisToSeries: { [key: string]: number[] } = {};

  series.forEach(
    ({ xAxisKey = DEFAULT_X_AXIS_KEY, yAxisKey = DEFAULT_Y_AXIS_KEY }, seriesIndex) => {
      const axisKey = coordinate === 'x' ? xAxisKey : yAxisKey;

      if (axisToSeries[axisKey] === undefined) {
        axisToSeries[axisKey] = [];
      }

      axisToSeries[axisKey].push(seriesIndex);
    },
  );

  // Initialized with user data
  const axisParameters = {};
  axis.forEach(({ id, min, max, scale, data }) => {
    let minData;
    let maxData;
    if (data && (min === undefined || max === undefined)) {
      [minData, maxData] = extent(data);
    }
    axisParameters[id] = { min: min ?? minData, max: max ?? maxData, scale, data };
  });

  // Complete with series data if needed
  const getSeriesDomain = coordinate === 'x' ? getXSeriesDomain : getYSeriesDomain;

  Object.entries(axisToSeries).forEach(([axisKey, assocaitedSeriesIndexes]) => {
    if (axisParameters[axisKey]?.min === undefined || axisParameters[axisKey]?.max === undefined) {
      axisParameters[axisKey] = {
        ...getSeriesDomain(assocaitedSeriesIndexes.map((index) => series[index])),
        ...axisParameters[axisKey],
      };
    }
  });

  return axisParameters;
};

export interface ChartContainerProps extends LayoutConfig {
  xAxis?: AxisConfig[];
  yAxis?: AxisConfig[];
  series: AllSeriesType[];
  children: React.ReactNode;
}

function ChartContainer(props: ChartContainerProps) {
  const { xAxis, yAxis, series, width, height, margin, children } = props;

  const defaultizedMargin = {
    ...DEFAULT_MARGINS,
    ...margin,
  };
  const drawingArea = React.useMemo(
    () => ({
      left: defaultizedMargin.left,
      top: defaultizedMargin.top,
      width: Math.max(0, width - defaultizedMargin.left - defaultizedMargin.right),
      height: Math.max(0, height - defaultizedMargin.top - defaultizedMargin.bottom),
    }),
    [
      width,
      height,
      defaultizedMargin.top,
      defaultizedMargin.bottom,
      defaultizedMargin.left,
      defaultizedMargin.right,
    ],
  );

  const xAxisParams = React.useMemo(() => getAxisParams(xAxis ?? [], series, 'x'), [xAxis, series]);
  const yAxisParams = React.useMemo(() => getAxisParams(yAxis ?? [], series, 'y'), [yAxis, series]);

  const coordinateContext = React.useMemo(() => {
    const xAxisContext = {};
    const yAxisContext = {};

    Object.entries(xAxisParams).forEach(([axisKey, { min, max, scale, data }]) => {
      xAxisContext[axisKey] = {
        scale: getScale(scale)
          .domain(scale === 'band' ? data : [min, max])
          // .nice()
          .range([drawingArea.left, drawingArea.left + drawingArea.width]),
        data,
      };
    });
    Object.entries(yAxisParams).forEach(([axisKey, { min, max, scale, data }]) => {
      yAxisContext[axisKey] = {
        scale: getScale(scale)
          .domain(scale === 'band' ? data : [min, max])
          // .nice()
          .range([drawingArea.top + drawingArea.height, drawingArea.top]),
        data,
      };
    });

    return {
      drawingArea,
      xAxis: xAxisContext,
      yAxis: yAxisContext,
    };
  }, [drawingArea, xAxisParams, yAxisParams]);

  return (
    <SeriesContext.Provider value={series}>
      <CoordinateContext.Provider value={coordinateContext}>
        <Surface width={width} height={height}>
          {children}
        </Surface>
      </CoordinateContext.Provider>
    </SeriesContext.Provider>
  );
}

export default ChartContainer;
