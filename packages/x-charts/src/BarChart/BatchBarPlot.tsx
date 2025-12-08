import useId from '@mui/utils/useId';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { type ProcessedBarData, type ProcessedBarSeriesData } from './types';
import { ANIMATION_DURATION_MS } from '../internals/animation/animation';
import { useUtilityClasses } from './barClasses';
import { appendAtKey } from '../internals/appendAtKey';
import { type IndividualBarPlotProps } from './IndividualBarPlot';
import { useChartContext } from '../context/ChartProvider/useChartContext';
import { useSelector } from '../internals/store/useSelector';
import { selectorChartDrawingArea } from '../internals/plugins/corePlugins/useChartDimensions';
import {
  selectorChartSeriesHighlightedItem,
  selectorChartSeriesUnfadedItem,
  type UseChartHighlightSignature,
} from '../internals/plugins/featurePlugins/useChartHighlight';
import { useStore } from '../internals/store/useStore';
import { useOnItemClick } from './useOnItemClick';
import { useInteractionItemProps } from './useItemInteractionProps';

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

export function BatchBarPlot({
  completedData,
  borderRadius = 0,
  onItemClick,
  skipAnimation = false,
}: BatchBarPlotProps) {
  const classes = useUtilityClasses();
  const onClick = useOnItemClick(onItemClick);
  const interactionItemProps = useInteractionItemProps();

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
        >
          <BatchBarSeriesPlot processedSeries={series} borderRadius={borderRadius} />
        </BarGroup>
      ))}
      <DrawingAreaRect onClick={onClick} {...interactionItemProps} />
    </React.Fragment>
  );
}

function DrawingAreaRect(props: React.HTMLAttributes<SVGRectElement>) {
  const store = useStore();
  const drawingArea = useSelector(store, selectorChartDrawingArea);

  return (
    <rect
      x={drawingArea.left}
      y={drawingArea.top}
      width={drawingArea.width}
      height={drawingArea.height}
      fill="transparent"
      {...props}
    />
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
      <FadedHighlightedBars processedSeries={processedSeries} borderRadius={borderRadius} />
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

interface AnimatedGroupProps extends React.HTMLAttributes<SVGGElement> {
  layout: 'horizontal' | 'vertical' | undefined;
  xOrigin: number;
  yOrigin: number;
}

function AnimatedGroup({ children, layout, xOrigin, yOrigin, ...props }: AnimatedGroupProps) {
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
      <PathGroup clipPath={`url(#${clipPathId})`} {...props}>
        {children}
      </PathGroup>
    </React.Fragment>
  );
}
