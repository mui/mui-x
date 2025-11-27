'use client';
import * as React from 'react';
import { useChartContext } from '../context/ChartProvider';
import { AxisConfig, D3ContinuousScale, D3OrdinalScale, D3Scale } from '../models/axis';
import { isOrdinalScale } from '../internals/scaleGuards';
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
  /**
   * The minimum space between ticks when using an ordinal scale. It defines the minimum distance in pixels between two ticks.
   * @default 0
   */
  tickSpacing?: number;
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

function getTickPosition(
  scale: D3OrdinalScale,
  value: any,
  placement: Required<TickParams>['tickPlacement'],
) {
  return (
    scale(value)! - (scale.step() - scale.bandwidth()) / 2 + offsetRatio[placement] * scale.step()
  );
}

/**
 * Returns a new domain where each tick is at least {@link tickSpacing}px from the next one.
 * Assumes tick spacing is greater than 0.
 * @param domain Domain of the scale.
 * @param range Range of the scale.
 * @param tickSpacing Spacing in pixels.
 */
export function applyTickSpacing<T>(domain: T[], range: [number, number], tickSpacing: number) {
  const rangeSpan = Math.abs(range[1] - range[0]);

  const every = Math.ceil(domain.length / (rangeSpan / tickSpacing));

  if (Number.isNaN(every) || every <= 1) {
    return domain;
  }

  return domain.filter((_, index) => index % every === 0);
}

export function getTicks(
  options: {
    scale: D3Scale;
    valueFormatter?: AxisConfig['valueFormatter'];
    isInside: (offset: number) => boolean;
  } & Pick<TickParams, 'tickInterval' | 'tickPlacement' | 'tickLabelPlacement' | 'tickSpacing'> &
    Required<Pick<TickParams, 'tickNumber'>>,
) {
  const {
    scale,
    tickNumber,
    valueFormatter,
    tickInterval,
    tickPlacement = 'extremities',
    tickLabelPlacement: tickLabelPlacementProp,
    tickSpacing,
    isInside,
  } = options;

  // band scale
  if (isOrdinalScale(scale)) {
    const domain = scale.domain();
    const tickLabelPlacement = tickLabelPlacementProp ?? 'middle';

    let filteredDomain = domain;
    if (typeof tickInterval === 'object' && tickInterval != null) {
      filteredDomain = tickInterval;
    } else {
      if (tickSpacing !== undefined && tickSpacing > 0) {
        filteredDomain = applyTickSpacing(domain, scale.range(), tickSpacing);
      }

      if (typeof tickInterval === 'function') {
        filteredDomain = filteredDomain.filter(tickInterval);
      }
    }

    if (scale.bandwidth() > 0) {
      // scale type = 'band'

      const isReversed = scale.range()[0] > scale.range()[1];
      // Indexes are inclusive regarding the entire band.
      const startIndex = filteredDomain.findIndex((value) => {
        return isInside(getTickPosition(scale, value, isReversed ? 'start' : 'end'));
      });
      const endIndex = filteredDomain.findLastIndex((value) =>
        isInside(getTickPosition(scale, value, isReversed ? 'end' : 'start')),
      );

      return [
        ...filteredDomain.slice(startIndex, endIndex + 1).map((value) => {
          const defaultTickLabel = `${value}`;

          return {
            value,
            formattedValue:
              valueFormatter?.(value, { location: 'tick', scale, tickNumber, defaultTickLabel }) ??
              defaultTickLabel,
            offset: getTickPosition(scale, value, tickPlacement),
            labelOffset:
              tickLabelPlacement === 'tick'
                ? 0
                : scale.step() * (offsetRatio[tickLabelPlacement] - offsetRatio[tickPlacement]),
          };
        }),

        ...(tickPlacement === 'extremities' &&
        endIndex === domain.length - 1 &&
        isInside(scale.range()[1])
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
    return filteredDomain.map((value) => {
      const defaultTickLabel = `${value}`;
      return {
        value,
        formattedValue:
          valueFormatter?.(value, {
            location: 'tick',
            scale,
            tickNumber,
            defaultTickLabel,
          }) ?? defaultTickLabel,
        offset: scale(value)!,
        labelOffset: 0,
      };
    });
  }

  const domain = scale.domain();
  // Skip axis rendering if no data is available
  // - The domains contains Infinity for continuous scales.
  if (domain.some(isInfinity)) {
    return [];
  }

  const tickLabelPlacement = tickLabelPlacementProp;
  const ticks =
    typeof tickInterval === 'object' ? tickInterval : getDefaultTicks(scale, tickNumber);

  // Ticks inside the drawing area
  const visibleTicks: TickItemType[] = [];

  for (let i = 0; i < ticks.length; i += 1) {
    const value = ticks[i];
    const offset = scale(value);

    if (isInside(offset)) {
      /* If d3 returns an empty string, it means that a tick should be shown, but its label shouldn't.
       * This is especially useful in a log scale where we want to show ticks to demonstrate it's a log
       * scale, but don't want to show labels because they would overlap.
       * https://github.com/mui/mui-x/issues/18239 */
      const defaultTickLabel = scale.tickFormat(tickNumber)(value);

      visibleTicks.push({
        value,
        formattedValue:
          valueFormatter?.(value, { location: 'tick', scale, tickNumber, defaultTickLabel }) ??
          defaultTickLabel,
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
}

function getDefaultTicks(scale: D3ContinuousScale, tickNumber: number) {
  const domain = scale.domain();
  if (domain[0] === domain[1]) {
    return [domain[0]];
  }

  return scale.ticks(tickNumber);
}

export function useTicks(
  options: {
    scale: D3Scale;
    valueFormatter?: AxisConfig['valueFormatter'];
    direction: 'x' | 'y';
  } & Pick<TickParams, 'tickInterval' | 'tickPlacement' | 'tickLabelPlacement' | 'tickSpacing'> &
    Required<Pick<TickParams, 'tickNumber'>>,
): TickItemType[] {
  const {
    scale,
    tickNumber,
    valueFormatter,
    tickInterval,
    tickPlacement = 'extremities',
    tickLabelPlacement,
    tickSpacing,
    direction,
  } = options;
  const { instance } = useChartContext();
  const isInside = direction === 'x' ? instance.isXInside : instance.isYInside;

  return React.useMemo(
    () =>
      getTicks({
        scale,
        tickNumber,
        tickPlacement,
        tickInterval,
        tickLabelPlacement,
        tickSpacing,
        valueFormatter,
        isInside,
      }),
    [
      scale,
      tickNumber,
      tickPlacement,
      tickInterval,
      tickLabelPlacement,
      tickSpacing,
      valueFormatter,
      isInside,
    ],
  );
}
