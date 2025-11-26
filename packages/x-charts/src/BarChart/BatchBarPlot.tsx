import useId from '@mui/utils/useId';
import * as React from 'react';
import {
  UseChartHighlightSignature,
  getSVGPoint,
  selectorChartAxisZoomData,
  selectorChartBarSeriesFlatbushMap,
  selectorChartDrawingArea,
  selectorChartSeriesEmptyFlatbushMap,
  selectorChartSeriesHighlightedItem,
  selectorChartSeriesProcessed,
  selectorChartSeriesUnfadedItem,
  selectorChartXAxis,
  selectorChartYAxis,
  selectorChartZoomIsInteracting,
  SeriesId,
  UseChartCartesianAxisSignature,
  useChartContext,
  useSelector,
  useStore,
} from '../internals';
import { useSvgRef } from '../hooks';
import { BarPlotSlotProps, BarPlotSlots } from './BarPlot';
import { BarItemIdentifier } from '../models';
import { ProcessedBarData, ProcessedBarSeriesData } from './types';
import { findClosestPoints } from '../internals/plugins/featurePlugins/useChartClosestPoint/findClosestPoints';
import { ANIMATION_DURATION_MS } from '../internals/animation/animation';
import { useUtilityClasses } from './barClasses';

interface BatchBarPlotProps {
  completedData: ProcessedBarSeriesData[];
  borderRadius?: number;
  skipAnimation?: boolean;
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    barItemIdentifier: BarItemIdentifier,
  ) => void;
  slotProps?: BarPlotSlotProps;
  slots?: BarPlotSlots;
}

const MAX_POINTS_PER_PATH = 1000;

function appendAtKey(map: Map<string, string[]>, key: string, value: string) {
  let bucket = map.get(key);
  if (!bucket) {
    bucket = [value];
    map.set(key, bucket);
  } else {
    bucket.push(value);
  }
  return bucket;
}

function generateBarPath(
  x: number,
  y: number,
  width: number,
  height: number,
  topLeftBorderRadius: number,
  topRightBorderRadius: number,
  bottomRightBorderRadius: number,
  bottomLeftBorderRadius: number,
) {
  const tLBR = Math.min(topLeftBorderRadius, width / 2, height / 2);
  const tRBR = Math.min(topRightBorderRadius, width / 2, height / 2);
  const bRBR = Math.min(bottomRightBorderRadius, width / 2, height / 2);
  const bLBR = Math.min(bottomLeftBorderRadius, width / 2, height / 2);

  return `M${x + tLBR},${y}
   h${width - tLBR - tRBR}
   a${tRBR},${tRBR} 0 0 1 ${tRBR},${tRBR}
   v${height - tRBR - bRBR}
   a${bRBR},${bRBR} 0 0 1 -${bRBR},${bRBR}
   h-${width - bRBR - bLBR}
   a${bLBR},${bLBR} 0 0 1 -${bLBR},-${bLBR}
   v-${height - bLBR - tLBR}
   a${tLBR},${tLBR} 0 0 1 ${tLBR},-${tLBR}
   Z`;
}

function createPath(barData: ProcessedBarData, borderRadius: number) {
  return generateBarPath(
    barData.x,
    barData.y,
    barData.width,
    barData.height,
    barData.borderRadiusSide === 'left' || barData.borderRadiusSide === 'top' ? borderRadius : 0,
    barData.borderRadiusSide === 'right' || barData.borderRadiusSide === 'top' ? borderRadius : 0,
    barData.borderRadiusSide === 'right' || barData.borderRadiusSide === 'bottom'
      ? borderRadius
      : 0,
    barData.borderRadiusSide === 'left' || barData.borderRadiusSide === 'bottom' ? borderRadius : 0,
  );
}

function useCreatePaths(seriesData: ProcessedBarSeriesData, borderRadius: number) {
  const paths = new Map<string, string[]>();
  const temporaryPaths = new Map<string, string[]>();

  for (let j = 0; j < seriesData.data.length; j += 1) {
    const barData = seriesData.data[j];

    const pathString = createPath(barData, borderRadius);

    const tempPath = appendAtKey(temporaryPaths, barData.color, pathString);

    if (tempPath.length >= MAX_POINTS_PER_PATH) {
      appendAtKey(paths, barData.color, tempPath.join(''));
      temporaryPaths.delete(barData.color);
    }
  }

  for (const [fill, tempPath] of temporaryPaths.entries()) {
    if (tempPath.length > 0) {
      appendAtKey(paths, fill, tempPath.join(''));
    }
  }

  return paths;
}

function useOnItemClick(onItemClick: BatchBarPlotProps['onItemClick'] | undefined) {
  const { instance } = useChartContext();
  const svgRef = useSvgRef();
  const store = useStore<[UseChartCartesianAxisSignature, UseChartHighlightSignature]>();
  const zoomIsInteracting = useSelector(store, selectorChartZoomIsInteracting);
  const flatbushMap = useSelector(
    store,
    zoomIsInteracting ? selectorChartSeriesEmptyFlatbushMap : selectorChartBarSeriesFlatbushMap,
  );

  return function onClick(event: React.MouseEvent<SVGElement, MouseEvent>) {
    const element = svgRef.current;

    if (element == null) {
      return;
    }

    const svgPoint = getSVGPoint(element, event);

    if (!instance.isPointInside(svgPoint.x, svgPoint.y)) {
      return;
    }

    const { series, seriesOrder } = selectorChartSeriesProcessed(store.getSnapshot())?.bar ?? {};
    const { axis: xAxes, axisIds: xAxisIds } = selectorChartXAxis(store.getSnapshot());
    const { axis: yAxes, axisIds: yAxisIds } = selectorChartYAxis(store.getSnapshot());
    const defaultXAxisId = xAxisIds[0];
    const defaultYAxisId = yAxisIds[0];

    let closestPoint: { dataIndex: number; seriesId: SeriesId; distanceSq: number } | undefined =
      undefined;

    for (const seriesId of seriesOrder ?? []) {
      const aSeries = (series ?? {})[seriesId];
      const flatbush = flatbushMap.get(seriesId);

      if (!flatbush) {
        continue;
      }

      const xAxisId = aSeries.xAxisId ?? defaultXAxisId;
      const yAxisId = aSeries.yAxisId ?? defaultYAxisId;

      const drawingArea = selectorChartDrawingArea(store.getSnapshot());
      const xAxisZoom = selectorChartAxisZoomData(store.getSnapshot(), xAxisId);
      const yAxisZoom = selectorChartAxisZoomData(store.getSnapshot(), yAxisId);

      const xZoomStart = (xAxisZoom?.start ?? 0) / 100;
      const xZoomEnd = (xAxisZoom?.end ?? 100) / 100;
      const yZoomStart = (yAxisZoom?.start ?? 0) / 100;
      const yZoomEnd = (yAxisZoom?.end ?? 100) / 100;

      const xAxis = xAxes[xAxisId];
      const yAxis = yAxes[yAxisId];
      const xScale = xAxis.scale;
      const yScale = yAxis.scale;

      const adaptedData = aSeries.data?.map((d, i) => ({ x: xAxis.data?.[i], y: d })) ?? [];

      const closestPointIndex = findClosestPoints(
        flatbush,
        drawingArea,
        adaptedData,
        xScale,
        yScale,
        xZoomStart,
        xZoomEnd,
        yZoomStart,
        yZoomEnd,
        svgPoint.x,
        svgPoint.y,
      )[0];

      if (closestPointIndex === undefined) {
        continue;
      }

      const point = aSeries.data[closestPointIndex];
      // FIXME: Handle horizontal bars
      const scaledX = xScale(xAxis.data?.[closestPointIndex] ?? point);
      const scaledY = yScale(yAxis.data?.[closestPointIndex] ?? point);

      const distSq = (scaledX! - svgPoint.x) ** 2 + (scaledY! - svgPoint.y) ** 2;

      if (closestPoint === undefined || distSq < closestPoint.distanceSq) {
        closestPoint = {
          dataIndex: closestPointIndex,
          seriesId,
          distanceSq: distSq,
        };
      }
    }

    if (closestPoint) {
      onItemClick?.(event, {
        type: 'bar',
        seriesId: closestPoint.seriesId,
        dataIndex: closestPoint.dataIndex,
      });
    }
  };
}

export function BatchBarPlot({
  completedData,
  borderRadius = 0,
  onItemClick,
  skipAnimation = false,
}: BatchBarPlotProps) {
  const classes = useUtilityClasses();

  return (
    <React.Fragment>
      {completedData.map((series) => (
        <BarGroup
          className={classes.series}
          data-series={series.seriesId}
          skipAnimation={skipAnimation}
        >
          <BatchBarSeriesPlot
            key={series.seriesId}
            processedSeries={series}
            borderRadius={borderRadius}
            onItemClick={onItemClick}
          />
        </BarGroup>
      ))}
    </React.Fragment>
  );
}

function FadedHighlightedBars({
  processedSeries,
  borderRadius,
}: {
  processedSeries: ProcessedBarSeriesData;
  borderRadius: number;
}) {
  const { store } = useChartContext<[UseChartHighlightSignature]>();
  const seriesHighlightedItem = useSelector(
    store,
    selectorChartSeriesHighlightedItem,
    processedSeries.seriesId,
  );
  const seriesUnfadedItem = useSelector(
    store,
    selectorChartSeriesUnfadedItem,
    processedSeries.seriesId,
  );

  const siblings: React.ReactNode[] = [];
  if (seriesHighlightedItem != null) {
    const barData = processedSeries.data[seriesHighlightedItem];

    siblings.push(
      <path
        key={`highlighted-${processedSeries.seriesId}`}
        fill={barData.color}
        data-highlighted
        d={createPath(barData, borderRadius)}
      />,
    );
  }

  if (seriesUnfadedItem != null) {
    const barData = processedSeries.data[seriesUnfadedItem];

    siblings.push(
      <path
        key={`unfaded-${processedSeries.seriesId}`}
        fill={barData.color}
        d={createPath(barData, borderRadius)}
      />,
    );
  }

  return <React.Fragment>{siblings}</React.Fragment>;
}

const MemoFadedHighlightedBars = React.memo(FadedHighlightedBars);

function BatchBarSeriesPlot({
  processedSeries,
  borderRadius,
  onItemClick,
}: {
  processedSeries: ProcessedBarSeriesData;
  borderRadius: number;
  onItemClick?: BatchBarPlotProps['onItemClick'];
}) {
  const onClick = useOnItemClick(onItemClick);
  const paths = useCreatePaths(processedSeries, borderRadius);
  const children: React.ReactNode[] = [];

  let i = 0;
  for (const [fill, dArray] of paths.entries()) {
    for (const d of dArray) {
      children.push(<path key={i} fill={fill} d={d} onClick={onClick} />);
      i += 1;
    }
  }

  return (
    <React.Fragment>
      {children}
      <MemoFadedHighlightedBars processedSeries={processedSeries} borderRadius={borderRadius} />
    </React.Fragment>
  );
}

function BarGroup({
  skipAnimation,
  ...props
}: React.HTMLAttributes<SVGGElement> & { skipAnimation: boolean }) {
  if (skipAnimation) {
    return <g {...props} />;
  }

  return <AnimatedGroup {...props} />;
}

function AnimatedGroup({ children }: React.PropsWithChildren<{}>) {
  const store = useStore();
  const drawingArea = useSelector(store, selectorChartDrawingArea);
  const clipPathId = useId();
  // FIXME: Handle layout; handle charts with negative and positive values (i.e., origin not at axis)

  return (
    <React.Fragment>
      <clipPath id={clipPathId}>
        <rect
          x={drawingArea.left}
          y={drawingArea.top}
          width={drawingArea.width}
          height={drawingArea.height}
        >
          <animate
            attributeName="y"
            from={drawingArea.top + drawingArea.height}
            to={drawingArea.top}
            dur={`${ANIMATION_DURATION_MS}ms`}
            fill="freeze"
          />
          <animate
            attributeName="height"
            from={0}
            to={drawingArea.height}
            dur={`${ANIMATION_DURATION_MS}ms`}
            fill="freeze"
          />
        </rect>
      </clipPath>
      <g clipPath={clipPathId}>{children}</g>
    </React.Fragment>
  );
}
