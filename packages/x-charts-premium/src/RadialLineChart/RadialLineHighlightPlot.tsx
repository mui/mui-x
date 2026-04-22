'use client';
import * as React from 'react';
import { type SlotComponentPropsFromProps } from '@mui/x-internals/types';
import {
  selectorChartsInteractionRotationAxisIndex,
  useChartsContext,
  type UseChartPolarAxisSignature,
} from '@mui/x-charts/internals';
import { useRadiusAxes, useRotationAxes } from '@mui/x-charts/hooks';
import { useRadialLineSeriesContext } from '../hooks/useRadialLineSeries';
import {
  RadialLineHighlightElement,
  type RadialLineHighlightElementProps,
} from './RadialLineHighlightElement';
import getColor from './seriesConfig/getColor';

export interface RadialLineHighlightPlotSlots {
  radialLineHighlight?: React.JSXElementConstructor<RadialLineHighlightElementProps>;
}

export interface RadialLineHighlightPlotSlotProps {
  radialLineHighlight?: SlotComponentPropsFromProps<RadialLineHighlightElementProps, {}, {}>;
}

export interface RadialLineHighlightPlotProps extends React.SVGAttributes<SVGGElement> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: RadialLineHighlightPlotSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: RadialLineHighlightPlotSlotProps;
}

function RadialLineHighlightPlot(props: RadialLineHighlightPlotProps) {
  const { slots, slotProps, ...other } = props;

  const seriesData = useRadialLineSeriesContext();
  const { radiusAxis, radiusAxisIds } = useRadiusAxes();
  const { rotationAxis, rotationAxisIds } = useRotationAxes();

  const { instance, store } = useChartsContext<[UseChartPolarAxisSignature]>();
  const highlightedIndex = store.use(selectorChartsInteractionRotationAxisIndex);

  if (highlightedIndex === null || highlightedIndex === -1) {
    return null;
  }

  if (seriesData === undefined) {
    return null;
  }

  const { series, stackingGroups } = seriesData;
  const defaultRotationAxisId = rotationAxisIds[0];
  const defaultRadiusAxisId = radiusAxisIds[0];

  const Element = slots?.radialLineHighlight ?? RadialLineHighlightElement;

  return (
    <g {...other}>
      {stackingGroups.flatMap(({ ids: groupIds }) =>
        groupIds.flatMap((seriesId) => {
          const {
            rotationAxisId = defaultRotationAxisId,
            radiusAxisId = defaultRadiusAxisId,
            stackedData,
            data,
            disableHighlight,
            shape = 'circle',
            hidden,
          } = series[seriesId];

          if (hidden || disableHighlight || data[highlightedIndex] == null) {
            return null;
          }

          const radiusScale = radiusAxis[radiusAxisId].scale;
          const rotationScale = rotationAxis[rotationAxisId].scale;
          const rotationData = rotationAxis[rotationAxisId].data;

          if (rotationData === undefined) {
            return null;
          }

          const value = stackedData[highlightedIndex]?.[1] ?? data[highlightedIndex];
          const radius = radiusScale(value as number)!;
          const angle = rotationScale(rotationData[highlightedIndex])!;

          const [x, y] = instance.polar2svg(radius, angle);

          if (!instance.isPointInside(x, y)) {
            return null;
          }

          const colorGetter = getColor(
            series[seriesId],
            rotationAxis[rotationAxisId],
            radiusAxis[radiusAxisId],
          );

          return (
            <Element
              key={`${seriesId}`}
              seriesId={seriesId}
              color={colorGetter(highlightedIndex)}
              x={x}
              y={y}
              shape={shape}
              {...slotProps?.radialLineHighlight}
            />
          );
        }),
      )}
    </g>
  );
}

export { RadialLineHighlightPlot };
