import * as React from 'react';
import { extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from './const';
import Surface from './internals/components/Surface';
import { AxisConfig } from './models/axis';
import { LayoutConfig } from './models/layout';
import { AllSeriesType, CartesianSeriesType, ScatterSeriesType } from './models/seriesType';
import { CoordinateContext } from './context/CoordinateContext';

const getXSeriesDomain = (series: CartesianSeriesType[]) => {
  // Work only for scatter plot now

  const values = (series as ScatterSeriesType[]).flatMap(({ data }) => data.map(({ x }) => x));
  const [min, max] = extent(values);
  return { min, max };
};

const getYSeriesDomain = (series: CartesianSeriesType[]) => {
  // Work only for scatter plot now
  const values = (series as ScatterSeriesType[]).flatMap(({ data }) => data.map(({ y }) => y));
  const [min, max] = extent(values);
  return { min, max };
};

type AxisDomain = { [key: string]: { min: number; max: number } };
const getAxisDomains = (
  axis: AxisConfig[],
  series: CartesianSeriesType[],
  coordinate: 'x' | 'y' = 'x',
): AxisDomain => {
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
  const axisDomain = {};
  axis.forEach(({ id, min, max }) => {
    axisDomain[id] = { min, max };
  });

  // Complete with series data if needed
  const getSeriesDomain = coordinate === 'x' ? getXSeriesDomain : getYSeriesDomain;

  Object.entries(axisToSeries).forEach(([axisKey, assocaitedSeriesIndexes]) => {
    if (axisDomain[axisKey]?.min === undefined || axisDomain[axisKey]?.max === undefined) {
      axisDomain[axisKey] = {
        ...getSeriesDomain(assocaitedSeriesIndexes.map((index) => series[index])),
        ...axisDomain[axisKey],
      };
    }
  });

  return axisDomain;
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
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
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

  const xAxisDomain = React.useMemo(
    () => getAxisDomains(xAxis ?? [], series, 'x'),
    [xAxis, series],
  );
  const yAxisDomain = React.useMemo(
    () => getAxisDomains(yAxis ?? [], series, 'y'),
    [yAxis, series],
  );

  const coordinateContext = React.useMemo(() => {
    const xDataToSvg = {};
    const yDataToSvg = {};

    Object.entries(xAxisDomain).forEach(([axisKey, { min, max }]) => {
      xDataToSvg[axisKey] = scaleLinear()
        .domain([min, max])
        .range([drawingArea.left, drawingArea.left + drawingArea.width]);
    });
    Object.entries(yAxisDomain).forEach(([axisKey, { min, max }]) => {
      yDataToSvg[axisKey] = scaleLinear()
        .domain([min, max])
        .range([drawingArea.top, drawingArea.top + drawingArea.height]);
    });

    return {
      drawingArea,
      xDataToSvg,
      yDataToSvg,
    };
  }, [drawingArea, xAxisDomain, yAxisDomain]);
  return (
    <CoordinateContext.Provider value={coordinateContext}>
      <Surface width={width} height={height}>
        {children}
      </Surface>
    </CoordinateContext.Provider>
  );
}

export default ChartContainer;
