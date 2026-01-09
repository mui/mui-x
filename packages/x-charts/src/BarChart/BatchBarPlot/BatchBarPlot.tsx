import * as React from 'react';
import { useSvgRef } from '../../hooks';
import type { BarItemIdentifier } from '../../models';
import { type ProcessedBarSeriesData } from '../types';
import { useUtilityClasses } from '../barClasses';
import { type IndividualBarPlotProps } from '../IndividualBarPlot';
import { useChartContext } from '../../context/ChartProvider/useChartContext';
import {
  selectorChartIsSeriesFaded,
  selectorChartIsSeriesHighlighted,
  selectorChartSeriesHighlightedItem,
  selectorChartSeriesUnfadedItem,
  type UseChartHighlightSignature,
} from '../../internals/plugins/featurePlugins/useChartHighlight';
import { useRegisterItemClickHandlers } from '../useRegisterItemClickHandlers';
import { createPath, useCreateBarPaths } from './useCreateBarPaths';
import { BarGroup } from './BarGroup';
import { useRegisterPointerInteractions } from '../../internals/plugins/featurePlugins/shared/useRegisterPointerInteractions';
import { selectorBarItemAtPosition } from '../../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxisPosition.selectors';

interface BatchBarPlotProps extends Omit<IndividualBarPlotProps, 'onItemClick'> {
  onItemClick?: (event: MouseEvent, barItemIdentifier: BarItemIdentifier) => void;
}

export function BatchBarPlot({
  completedData,
  borderRadius = 0,
  onItemClick,
  skipAnimation = false,
}: BatchBarPlotProps) {
  const prevCursorRef = React.useRef<string | null>(null);
  const svgRef = useSvgRef();

  const onItemEnter = onItemClick
    ? () => {
        const svg = svgRef.current;

        if (!svg) {
          return;
        }

        if (prevCursorRef.current == null) {
          prevCursorRef.current = svg.style.cursor;
          // eslint-disable-next-line react-compiler/react-compiler
          svg.style.cursor = 'pointer';
        }
      }
    : undefined;

  const onItemLeave = onItemClick
    ? () => {
        const svg = svgRef.current;

        if (!svg) {
          return;
        }

        if (prevCursorRef.current != null) {
          svg.style.cursor = prevCursorRef.current;
          prevCursorRef.current = null;
        }
      }
    : undefined;

  useRegisterPointerInteractions(selectorBarItemAtPosition, onItemEnter, onItemLeave);
  useRegisterItemClickHandlers(onItemClick);

  return (
    <React.Fragment>
      {completedData.map((series) => (
        <SeriesBatchPlot
          key={series.seriesId}
          series={series}
          borderRadius={borderRadius}
          skipAnimation={skipAnimation}
        />
      ))}
    </React.Fragment>
  );
}

const MemoFadedHighlightedBars = React.memo(FadedHighlightedBars);

function SeriesBatchPlot({
  series,
  borderRadius,
  skipAnimation,
}: {
  series: ProcessedBarSeriesData;
  borderRadius: number;
  skipAnimation: boolean;
}) {
  const classes = useUtilityClasses();
  const { store } = useChartContext<[UseChartHighlightSignature]>();
  const isSeriesHighlighted = store.use(selectorChartIsSeriesHighlighted, series.seriesId);
  const isSeriesFaded = store.use(selectorChartIsSeriesFaded, series.seriesId);

  return (
    <React.Fragment>
      <BarGroup
        className={classes.series}
        data-series={series.seriesId}
        layout={series.layout}
        xOrigin={series.xOrigin}
        yOrigin={series.yOrigin}
        skipAnimation={skipAnimation}
        data-faded={isSeriesFaded || undefined}
        data-highlighted={isSeriesHighlighted || undefined}
      >
        <BatchBarSeriesPlot processedSeries={series} borderRadius={borderRadius} />
      </BarGroup>
      <MemoFadedHighlightedBars processedSeries={series} borderRadius={borderRadius} />
    </React.Fragment>
  );
}

function BatchBarSeriesPlot({
  processedSeries,
  borderRadius,
}: {
  processedSeries: ProcessedBarSeriesData;
  borderRadius: number;
}) {
  const paths = useCreateBarPaths(processedSeries, borderRadius);
  const children: React.ReactNode[] = [];

  let i = 0;
  for (const [fill, dArray] of paths.entries()) {
    for (const d of dArray) {
      children.push(<path key={i} fill={fill} d={d} />);
      i += 1;
    }
  }

  return <React.Fragment>{children}</React.Fragment>;
}

function FadedHighlightedBars({
  processedSeries,
  borderRadius,
}: {
  processedSeries: ProcessedBarSeriesData;
  borderRadius: number;
}) {
  const { store } = useChartContext<[UseChartHighlightSignature]>();
  const seriesHighlightedDataIndex = store.use(
    selectorChartSeriesHighlightedItem,
    processedSeries.seriesId,
  );
  const seriesUnfadedDataIndex = store.use(
    selectorChartSeriesUnfadedItem,
    processedSeries.seriesId,
  );

  const seriesHighlightedItem =
    seriesHighlightedDataIndex != null
      ? processedSeries.data.find((v) => v.dataIndex === seriesHighlightedDataIndex) || null
      : null;

  const seriesUnfadedItem =
    seriesUnfadedDataIndex != null
      ? processedSeries.data.find((v) => v.dataIndex === seriesUnfadedDataIndex) || null
      : null;

  const siblings: React.ReactNode[] = [];
  if (seriesHighlightedItem != null) {
    siblings.push(
      <path
        key={`highlighted-${processedSeries.seriesId}`}
        fill={seriesHighlightedItem.color}
        filter="brightness(120%)"
        data-highlighted
        d={createPath(seriesHighlightedItem, borderRadius)}
      />,
    );
  }

  if (seriesUnfadedItem != null) {
    siblings.push(
      <path
        key={`unfaded-${seriesUnfadedItem.seriesId}`}
        fill={seriesUnfadedItem.color}
        d={createPath(seriesUnfadedItem, borderRadius)}
      />,
    );
  }

  return <React.Fragment>{siblings}</React.Fragment>;
}
