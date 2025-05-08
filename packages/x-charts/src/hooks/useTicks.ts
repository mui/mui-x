'use client';
import * as React from 'react';
import { useChartContext } from '../context/ChartProvider';
import { AxisConfig, D3Scale } from '../models/axis';
import { isBandScale } from '../internals/isBandScale';
import { isInfinity } from '../internals/isInfinity';

export interface TickParams {
  /**
   * Maximal step between two ticks.
   * When using time data, the value is assumed to be in ms.
   * Not supported by categorical axis (band, points).
   */
  tickMaxStep?: number;
  /**
   * Minimal step between two ticks.
   * When using time data, the value is assumed to be in ms.
   * Not supported by categorical axis (band, points).
   */
  tickMinStep?: number;
  /**
   * The number of ticks. This number is not guaranteed.
   * Not supported by categorical axis (band, points).
   */
  tickNumber?: number;
  /**
   * Defines which ticks are displayed.
   * Its value can be:
   * - 'auto' In such case the ticks are computed based on axis scale and other parameters.
   * - a filtering function of the form `(value, index) => boolean` which is available only if the axis has "point" scale.
   * - an array containing the values where ticks should be displayed.
   * @see See {@link https://mui.com/x/react-charts/axis/#fixed-tick-positions}
   * @default 'auto'
   */
  tickInterval?: 'auto' | ((value: any, index: number) => boolean) | any[];
  /**
   * The placement of ticks in regard to the band interval.
   * Only used if scale is 'band'.
   * @default 'extremities'
   */
  tickPlacement?: 'start' | 'end' | 'middle' | 'extremities';
  /**
   * The placement of ticks label. Can be the middle of the band, or the tick position.
   * Only used if scale is 'band'.
   * @default 'middle'
   */
  tickLabelPlacement?: 'middle' | 'tick';
}

const offsetRatio = {
  start: 0,
  extremities: 0,
  end: 1,
  middle: 0.5,
} as const;

export type TickItemType = {
  /**
   * This property is undefined only if it's the tick closing the last band
   */
  value?: any;
  formattedValue?: string;
  offset: number;
  labelOffset: number;
};

export function useTicks(
  options: {
    scale: D3Scale;
    valueFormatter?: AxisConfig['valueFormatter'];
    direction: 'x' | 'y';
  } & Pick<TickParams, 'tickNumber' | 'tickInterval' | 'tickPlacement' | 'tickLabelPlacement'>,
): TickItemType[] {
  const {
    scale,
    tickNumber,
    valueFormatter,
    tickInterval,
    tickPlacement = 'extremities',
    tickLabelPlacement: tickLabelPlacementProp,
    direction,
  } = options;
  const { instance } = useChartContext();

  return React.useMemo(() => {
    // band scale
    if (isBandScale(scale)) {
      const domain = scale.domain();

      const tickLabelPlacement = tickLabelPlacementProp ?? 'middle';

      if (scale.bandwidth() > 0) {
        // scale type = 'band'
        const filteredDomain =
          (typeof tickInterval === 'function' && domain.filter(tickInterval)) ||
          (typeof tickInterval === 'object' && tickInterval) ||
          domain;
        return [
          ...filteredDomain.map((value) => ({
            value,
            formattedValue: valueFormatter?.(value, { location: 'tick', scale }) ?? `${value}`,
            offset:
              scale(value)! -
              (scale.step() - scale.bandwidth()) / 2 +
              offsetRatio[tickPlacement] * scale.step(),
            labelOffset:
              tickLabelPlacement === 'tick'
                ? 0
                : scale.step() * (offsetRatio[tickLabelPlacement] - offsetRatio[tickPlacement]),
          })),

          ...(tickPlacement === 'extremities'
            ? [
                {
                  formattedValue: undefined,
                  offset: scale.range()[1],
                  labelOffset: 0,
                },
              ]
            : []),
        ];
      }

      // scale type = 'point'
      const filteredDomain =
        (typeof tickInterval === 'function' && domain.filter(tickInterval)) ||
        (typeof tickInterval === 'object' && tickInterval) ||
        domain;

      return filteredDomain.map((value) => ({
        value,
        formattedValue: valueFormatter?.(value, { location: 'tick', scale }) ?? `${value}`,
        offset: scale(value)!,
        labelOffset: 0,
      }));
    }

    const domain = scale.domain();
    // Skip axis rendering if no data is available
    // - The domains contains Infinity for continuous scales.
    if (domain.some(isInfinity)) {
      return [];
    }
    const tickLabelPlacement = tickLabelPlacementProp;
    const ticks = typeof tickInterval === 'object' ? tickInterval : scale.ticks(tickNumber);

    // Ticks inside the drawing area
    const visibleTicks = [];

    for (let i = 0; i < ticks.length; i += 1) {
      const value = ticks[i];
      const offset = scale(value);
      const point = direction === 'x' ? { x: offset, y: 0 } : { x: 0, y: offset };

      if (instance.isPointInside(point, { direction })) {
        visibleTicks.push({
          value,
          formattedValue:
            valueFormatter?.(value, { location: 'tick', scale }) ??
            scale.tickFormat(tickNumber)(value),
          offset,
          // Allowing the label to be placed in the middle of a continuous scale is weird.
          // But it is useful in some cases, like funnel categories with a linear scale.
          labelOffset:
            tickLabelPlacement === 'middle'
              ? scale(ticks[i - 1] ?? 0) - (offset + scale(ticks[i - 1] ?? 0)) / 2
              : 0,
        });
      }
    }

    return visibleTicks;
  }, [
    scale,
    tickLabelPlacementProp,
    tickInterval,
    tickNumber,
    tickPlacement,
    valueFormatter,
    direction,
    instance,
  ]);
}
