import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { ChartsSurface, ChartsSurfaceProps } from '@mui/x-charts/ChartsSurface';
import {
  ChartsAxesGradients,
  DrawingProvider,
  DrawingProviderProps,
  SeriesContextProvider,
  SeriesContextProviderProps,
  InteractionProvider,
  CartesianContextProvider,
  CartesianContextProviderProps,
  HighlightProvider,
  ExtremumGetter,
  FormatterParams,
  SeriesFormatterType,
  FormatterResult,
  ZAxisContextProvider,
} from '@mui/x-charts/internals';
import { AllSeriesType } from '@mui/x-charts/models';
import { ZAxisContextProviderProps } from '@mui/x-charts/context';

export type HeatmapContainerProps = Omit<
  ChartsSurfaceProps &
    Omit<SeriesContextProviderProps<'heatmap'>, 'formatSeries'> &
    Omit<DrawingProviderProps, 'svgRef'> &
    ZAxisContextProviderProps &
    Omit<CartesianContextProviderProps, 'xExtremumGetters' | 'yExtremumGetters'>,
  'children'
> & {
  children?: React.ReactNode;
};

const getBaseExtremum: ExtremumGetter<'heatmap'> = (params) => {
  const { axis } = params;

  const minX = Math.min(...(axis.data ?? []));
  const maxX = Math.max(...(axis.data ?? []));
  return [minX, maxX];
};

const xExtremumGetters = {
  heatmap: getBaseExtremum,
};
const yExtremumGetters = {
  heatmap: getBaseExtremum,
};

const formatSeries: SeriesFormatterType<'heatmap'> = (series: AllSeriesType[]) => {
  // Group series by type
  const seriesGroups: { heatmap?: FormatterParams<'heatmap'> } = {};

  series.forEach((seriesData, seriesIndex: number) => {
    const { id = `auto-generated-id-${seriesIndex}`, type } = seriesData;

    if (type !== 'heatmap') {
      throw new Error('Heatmap does nto suport other series type that "heatmap"');
    }

    if (seriesGroups[type] === undefined) {
      seriesGroups[type] = { series: {}, seriesOrder: [] };
    }
    if (seriesGroups[type]?.series[id] !== undefined) {
      throw new Error(`MUI X Charts: series' id "${id}" is not unique.`);
    }

    seriesGroups[type]!.series[id] = {
      id,
      ...seriesData,
    };
    seriesGroups[type]!.seriesOrder.push(id);
  });

  const formattedSeries: { heatmap: FormatterResult<'heatmap'> } = {
    heatmap: {
      series: {},
      seriesOrder: seriesGroups.heatmap?.seriesOrder ?? [],
    },
  };

  seriesGroups.heatmap?.seriesOrder.forEach((id) => {
    formattedSeries.heatmap!.series[id] = {
      valueFormatter: (value) => (value === undefined ? '' : value.toString()),
      data: [],
      ...seriesGroups.heatmap!.series[id],
    };
  });

  return formattedSeries;
};

export const HeatmapContainer = React.forwardRef(function HeatmapContainer(
  props: HeatmapContainerProps,
  ref,
) {
  const {
    width,
    height,
    series,
    margin,
    xAxis,
    yAxis,
    zAxis,
    colors,
    dataset,
    sx,
    title,
    desc,
    disableAxisListener,
    children,
  } = props;
  const svgRef = React.useRef<SVGSVGElement>(null);
  const handleRef = useForkRef(ref, svgRef);

  // useReducedMotion(); // a11y reduce motion (see: https://react-spring.dev/docs/utilities/use-reduced-motion)

  return (
    <DrawingProvider width={width} height={height} margin={margin} svgRef={svgRef}>
      <SeriesContextProvider
        series={series}
        colors={colors}
        dataset={dataset}
        formatSeries={formatSeries}
      >
        <CartesianContextProvider
          xAxis={xAxis}
          yAxis={yAxis}
          dataset={dataset}
          xExtremumGetters={xExtremumGetters}
          yExtremumGetters={yExtremumGetters}
        >
          <ZAxisContextProvider zAxis={zAxis}>
            <InteractionProvider>
              <HighlightProvider>
                <ChartsSurface
                  width={width}
                  height={height}
                  ref={handleRef}
                  sx={sx}
                  title={title}
                  desc={desc}
                  disableAxisListener={disableAxisListener}
                >
                  <ChartsAxesGradients />
                  {children}
                </ChartsSurface>
              </HighlightProvider>
            </InteractionProvider>
          </ZAxisContextProvider>
        </CartesianContextProvider>
      </SeriesContextProvider>
    </DrawingProvider>
  );
});
