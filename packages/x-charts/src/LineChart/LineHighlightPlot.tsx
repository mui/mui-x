'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { type SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { useStore } from '../internals/store/useStore';
import { LineHighlightElement, type LineHighlightElementProps } from './LineHighlightElement';
import { getValueToPositionMapper } from '../hooks/getValueToPositionMapper';
import { DEFAULT_X_AXIS_KEY } from '../constants';
import { useLineSeriesContext } from '../hooks/useLineSeries';
import getColor from './seriesConfig/getColor';
import { useChartsContext } from '../context/ChartsProvider';
import {
  type UseChartCartesianAxisSignature,
  selectorChartsHighlightXAxisIndex,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { useXAxes, useYAxes } from '../hooks/useAxis';
import type { UseChartBrushSignature } from '../internals/plugins/featurePlugins/useChartBrush';
import type { LineHighlightPropsOverrides } from '../models/chartsSlotsComponentsProps';

export interface LineHighlightPlotSlots {
  lineHighlight?: React.JSXElementConstructor<
    LineHighlightElementProps & LineHighlightPropsOverrides
  >;
}

export interface LineHighlightPlotSlotProps {
  lineHighlight?: SlotComponentPropsFromProps<
    LineHighlightElementProps,
    LineHighlightPropsOverrides,
    {}
  >;
}

export interface LineHighlightPlotProps extends React.SVGAttributes<SVGSVGElement> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: LineHighlightPlotSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: LineHighlightPlotSlotProps;
}

/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LineHighlightPlot API](https://mui.com/x/api/charts/line-highlight-plot/)
 */
function LineHighlightPlot(props: LineHighlightPlotProps) {
  const { slots, slotProps, ...other } = props;

  const seriesData = useLineSeriesContext();
  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();

  const { instance } = useChartsContext();

  const store = useStore<[UseChartCartesianAxisSignature, UseChartBrushSignature]>();
  const highlightedIndexes = store.use(selectorChartsHighlightXAxisIndex);

  if (seriesData === undefined) {
    return null;
  }
  const { series, stackingGroups } = seriesData;
  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  const hasStartEndMark = stackingGroups.some(({ ids }) =>
    ids.some(
      (seriesId) => series[seriesId].showMark === 'start' || series[seriesId].showMark === 'end',
    ),
  );

  if (highlightedIndexes.length === 0 && !hasStartEndMark) {
    return null;
  }

  const getHighlightedIndex = new Map<string | number, number>();
  highlightedIndexes.forEach(({ axisId, dataIndex }) => {
    getHighlightedIndex.set(axisId, dataIndex);
  });

  const Element = slots?.lineHighlight ?? LineHighlightElement;

  return (
    <g {...other}>
      {stackingGroups.flatMap(({ ids: groupIds }) =>
        groupIds.flatMap((seriesId) => {
          const {
            xAxisId = defaultXAxisId,
            yAxisId = defaultYAxisId,
            visibleStackedData,
            data,
            disableHighlight,
            showMark,
            shape = 'circle',
            hidden,
          } = series[seriesId];

          if (hidden) {
            return null;
          }

          const axisIndex = disableHighlight ? undefined : getHighlightedIndex.get(xAxisId);
          const showMarkIndex =
            showMark === 'start' || showMark === 'end'
              ? getStartEndMarkIndex(data, showMark)
              : undefined;

          const highlightedIndex = axisIndex ?? showMarkIndex;

          if (highlightedIndex === undefined || data[highlightedIndex] == null) {
            return null;
          }

          const xScale = getValueToPositionMapper(xAxis[xAxisId].scale);
          const yScale = yAxis[yAxisId].scale;
          const xData = xAxis[xAxisId].data;

          if (xData === undefined) {
            throw new Error(
              `MUI X Charts: ${
                xAxisId === DEFAULT_X_AXIS_KEY
                  ? 'The first `xAxis`'
                  : `The x-axis with id "${xAxisId}"`
              } should have a data property to be able to display a line plot. ` +
                'The x-axis data defines the positions for each point in the line. ' +
                'Provide a data array to the x-axis configuration.',
            );
          }

          const x = xScale(xData[highlightedIndex]);
          const y = yScale(visibleStackedData[highlightedIndex][1])!; // This should not be undefined since y should not be a band scale
          if (!instance.isPointInside(x, y)) {
            return null;
          }

          const colorGetter = getColor(series[seriesId], xAxis[xAxisId], yAxis[yAxisId]);
          return (
            <Element
              key={`${seriesId}`}
              seriesId={seriesId}
              color={colorGetter(highlightedIndex)}
              x={x}
              y={y}
              shape={shape}
              {...slotProps?.lineHighlight}
            />
          );
        }),
      )}
    </g>
  );
}

/**
 * Returns the index of the first (`'start'`) or last (`'end'`) non-null item, or `-1` if none.
 */
function getStartEndMarkIndex(data: readonly (number | null)[], type: 'start' | 'end') {
  if (type === 'start') {
    const index = data.findIndex((value) => value != null);
    return index < 0 ? undefined : index;
  }
  const index = data.findLastIndex((value) => value != null);
  return index < 0 ? undefined : index;
}

LineHighlightPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
} as any;

export { LineHighlightPlot };
