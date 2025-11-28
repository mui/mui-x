import useId from '@mui/utils/useId';
import * as React from 'react';
import { styled } from '@mui/material/styles';

import { useSvgRef } from '../hooks';
import { ProcessedBarData, ProcessedBarSeriesData } from './types';
import { findClosestPoints } from '../internals/plugins/featurePlugins/useChartClosestPoint/findClosestPoints';
import { ANIMATION_DURATION_MS } from '../internals/animation/animation';
import { useUtilityClasses } from './barClasses';
import { appendAtKey } from '../internals/appendAtKey';
import { IndividualBarPlotProps } from './IndividualBarPlot';
import { useChartContext } from '../context/ChartProvider/useChartContext';
import {
  selectorChartAxisZoomData,
  selectorChartBarSeriesFlatbushMap,
  selectorChartSeriesEmptyFlatbushMap,
  selectorChartXAxis,
  selectorChartYAxis,
  selectorChartZoomIsInteracting,
  UseChartCartesianAxisSignature,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { useSelector } from '../internals/store/useSelector';
import { selectorChartDrawingArea } from '../internals/plugins/corePlugins/useChartDimensions';
import { SeriesId } from '../models/seriesType/common';
import { selectorChartSeriesProcessed } from '../internals/plugins/corePlugins/useChartSeries';
import { getSVGPoint } from '../internals/getSVGPoint';
import {
  selectorChartSeriesHighlightedItem,
  selectorChartSeriesUnfadedItem,
  UseChartHighlightSignature,
} from '../internals/plugins/featurePlugins/useChartHighlight';
import { useStore } from '../internals/store/useStore';

interface BatchBarPlotProps extends IndividualBarPlotProps {}

const MAX_POINTS_PER_PATH = 1000;

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

      const getX = (dataIndex: number) => xAxis.data?.[dataIndex] ?? 0;
      const getY = (dataIndex: number) => aSeries.data?.[dataIndex] ?? 0;

      const closestPointIndex = findClosestPoints(
        flatbush,
        getX,
        getY,
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

      if (point == null) {
        continue;
      }

      const scaledX =
        aSeries.layout === 'horizontal' ? xScale(point) : xScale(xAxis.data?.[closestPointIndex]);
      const scaledY =
        aSeries.layout === 'horizontal' ? yScale(yAxis.data?.[closestPointIndex]) : yScale(point);

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
  const onClick = useOnItemClick(onItemClick);

  return (
    <React.Fragment>
      {completedData.map((series) => (
        <BarGroup
          key={series.seriesId}
          className={classes.series}
          data-series={series.seriesId}
          layout={series.layout}
          xOrigin={series.xOrigin}
          yOrigin={series.yOrigin}
          skipAnimation={skipAnimation}
          onClick={onClick}
        >
          <BatchBarSeriesPlot processedSeries={series} borderRadius={borderRadius} />
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
}: {
  processedSeries: ProcessedBarSeriesData;
  borderRadius: number;
}) {
  const paths = useCreatePaths(processedSeries, borderRadius);
  const children: React.ReactNode[] = [];

  let i = 0;
  for (const [fill, dArray] of paths.entries()) {
    for (const d of dArray) {
      children.push(<path key={i} fill={fill} d={d} />);
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

const PathGroup = styled('g')({
  '&[data-faded="true"]': {
    opacity: 0.3,
  },
  '& path': {
    /* The browser must do hit testing to know which element a pointer is interacting with.
     * With many data points, we create many paths causing significant time to be spent in the hit test phase.
     * To fix this issue, we disable pointer events for the descendant paths.
     *
     * Ideally, users should be able to override this in case they need pointer events to be enabled,
     * but it can affect performance negatively, especially with many data points. */
    pointerEvents: 'none',
  },
});

interface BarGroupProps extends React.HTMLAttributes<SVGGElement> {
  skipAnimation: boolean;
  layout: 'horizontal' | 'vertical' | undefined;
  xOrigin: number;
  yOrigin: number;
}

function BarGroup({ skipAnimation, layout, xOrigin, yOrigin, ...props }: BarGroupProps) {
  if (skipAnimation) {
    return <PathGroup {...props} />;
  }

  return <AnimatedGroup {...props} layout={layout} xOrigin={xOrigin} yOrigin={yOrigin} />;
}

function AnimatedGroup({
  children,
  layout,
  xOrigin,
  yOrigin,
}: React.PropsWithChildren<{
  layout: 'horizontal' | 'vertical' | undefined;
  xOrigin: number;
  yOrigin: number;
}>) {
  const store = useStore();
  const drawingArea = useSelector(store, selectorChartDrawingArea);
  const clipPathId = useId();

  const animateChildren = [];

  if (layout === 'horizontal') {
    animateChildren.push(
      <rect
        key="left"
        x={drawingArea.left}
        width={xOrigin - drawingArea.left}
        y={drawingArea.top}
        height={drawingArea.height}
      >
        <animate
          attributeName="x"
          from={xOrigin}
          to={drawingArea.left}
          dur={`${ANIMATION_DURATION_MS}ms`}
          fill="freeze"
        />
        <animate
          attributeName="width"
          from={0}
          to={xOrigin - drawingArea.left}
          dur={`${ANIMATION_DURATION_MS}ms`}
          fill="freeze"
        />
      </rect>,
    );
    animateChildren.push(
      <rect
        key="right"
        x={xOrigin}
        width={drawingArea.left + drawingArea.width - xOrigin}
        y={drawingArea.top}
        height={drawingArea.height}
      >
        <animate
          attributeName="width"
          from={0}
          to={drawingArea.left + drawingArea.width - xOrigin}
          dur={`${ANIMATION_DURATION_MS}ms`}
          fill="freeze"
        />
      </rect>,
    );
  } else {
    animateChildren.push(
      <rect
        key="top"
        x={drawingArea.left}
        width={drawingArea.width}
        y={drawingArea.top}
        height={yOrigin - drawingArea.top}
      >
        <animate
          attributeName="y"
          from={yOrigin}
          to={drawingArea.top}
          dur={`${ANIMATION_DURATION_MS}ms`}
          fill="freeze"
        />
        <animate
          attributeName="height"
          from={0}
          to={yOrigin - drawingArea.top}
          dur={`${ANIMATION_DURATION_MS}ms`}
          fill="freeze"
        />
      </rect>,
    );
    animateChildren.push(
      <rect
        key="bottom"
        x={drawingArea.left}
        width={drawingArea.width}
        y={yOrigin}
        height={drawingArea.top + drawingArea.height - yOrigin}
      >
        <animate
          attributeName="height"
          from={0}
          to={drawingArea.top + drawingArea.height - yOrigin}
          dur={`${ANIMATION_DURATION_MS}ms`}
          fill="freeze"
        />
      </rect>,
    );
  }

  return (
    <React.Fragment>
      <clipPath id={clipPathId}>{animateChildren}</clipPath>
      <PathGroup clipPath={`url(#${clipPathId})`}>{children}</PathGroup>
    </React.Fragment>
  );
}
