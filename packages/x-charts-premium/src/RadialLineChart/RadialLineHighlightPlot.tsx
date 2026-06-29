'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import type { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import {
  selectorChartsInteractionRotationAxisIndex,
  useChartsContext,
} from '@mui/x-charts/internals';
import type { UseChartPolarAxisSignature } from '@mui/x-charts/internals';
import { getValueToPositionMapper, useRadiusAxes, useRotationAxes } from '@mui/x-charts/hooks';
import { useRadialLineSeriesContext } from '../hooks/useRadialLineSeries';
import { RadialLineHighlightElement } from './RadialLineHighlightElement';
import type { RadialLineHighlightElementProps } from './RadialLineHighlightElement';
import getColor from './seriesConfig/getColor';
import type { RadialLineHighlightPropsOverrides } from '../models/chartsSlotsComponentsPropsPremium';

export interface RadialLineHighlightPlotSlots {
  radialLineHighlight?: React.JSXElementConstructor<
    RadialLineHighlightElementProps & RadialLineHighlightPropsOverrides
  >;
}

export interface RadialLineHighlightPlotSlotProps {
  radialLineHighlight?: SlotComponentPropsFromProps<
    RadialLineHighlightElementProps,
    RadialLineHighlightPropsOverrides,
    {}
  >;
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
          const rotationPosition = getValueToPositionMapper(rotationAxis[rotationAxisId].scale);
          const rotationData = rotationAxis[rotationAxisId].data;

          if (rotationData === undefined) {
            return null;
          }

          const value = stackedData[highlightedIndex]?.[1] ?? data[highlightedIndex];
          const radius = radiusScale(value as number)!;
          const angle = rotationPosition(rotationData[highlightedIndex])!;

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

RadialLineHighlightPlot.propTypes /* remove-proptypes */ = {
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

export { RadialLineHighlightPlot };
