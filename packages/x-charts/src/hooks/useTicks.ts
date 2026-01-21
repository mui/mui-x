'use client';
import * as React from 'react';
import type { AxisConfig, D3ContinuousScale, D3OrdinalScale, D3Scale } from '../models/axis';
import type { OrdinalTimeTicks, TickFrequencyDefinition } from '../models/timeTicks';
import { isOrdinalScale } from '../internals/scaleGuards';
import { isInfinity } from '../internals/isInfinity';
import { tickFrequencies } from '../utils/timeTicks';
import { isDateData } from '../internals/dateHelpers';
import { useChartContext } from '../context/ChartProvider/useChartContext';

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

export type TickItem = {
  /**
   * The value of the tick.
   * It is only undefined if it's the tick closing the last band.
   */
  value?: any;
  /**
   * The formatted value of the tick.
   * It is only undefined if it's the tick closing the last band.
   */
  formattedValue?: string;
  /**
   * The offset in pixels relative to the SVG origin.
   * For an x-axis, it is relative to the left side of the SVG.
   * For a y-axis, it is relative to the top side of the SVG.
   */
  offset: number;
  /**
   * The offset in pixels relative to the tick position.
   * For an x-axis, a positive value means the label is shifted to the right of the tick.
   * For a y-axis, a positive value means the label is shifted downwards from the tick.
   */
  labelOffset: number;
};

function getTickPosition<T extends { toString(): string }>(
  scale: D3OrdinalScale<T>,
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

function getTimeTicks<T extends { toString(): string }>(
  domain: T[],
  tickNumber: number,
  ticksFrequencies: TickFrequencyDefinition[],
  scale: D3OrdinalScale<T>,
  isInside: (offset: number) => boolean,
) {
  if (ticksFrequencies.length === 0) {
    return [];
  }

  const isReversed = scale.range()[0] > scale.range()[1];
  // Indexes are inclusive regarding the entire band.
  const startIndex = domain.findIndex((value) => {
    return isInside(getTickPosition(scale, value, isReversed ? 'start' : 'end'));
  });
  const endIndex = domain.findLastIndex((value) =>
    isInside(getTickPosition(scale, value, isReversed ? 'end' : 'start')),
  );

  const start = domain[0];
  const end = domain[domain.length - 1];

  if (!(start instanceof Date) || !(end instanceof Date)) {
    return [];
  }

  let startFrequencyIndex = 0;

  for (let i = 0; i < ticksFrequencies.length; i += 1) {
    if (ticksFrequencies[i].getTickNumber(start, end) !== 0) {
      startFrequencyIndex = i;
      break;
    }
  }

  let endFrequencyIndex = startFrequencyIndex;
  for (let i = startFrequencyIndex; i < ticksFrequencies.length; i += 1) {
    if (i === ticksFrequencies.length - 1) {
      // If we reached the end, use the last tick frequency
      endFrequencyIndex = i;
      break;
    }

    const prevTickCount = ticksFrequencies[i].getTickNumber(start, end);
    const nextTickCount = ticksFrequencies[i + 1].getTickNumber(start, end);

    // Smooth ratio between ticks steps: ticksNumber[i]*ticksNumber[i+1] <= targetTickNumber^2
    if (nextTickCount > tickNumber || tickNumber / prevTickCount < nextTickCount / tickNumber) {
      endFrequencyIndex = i;
      break;
    }
  }

  const ticks: { index: number; formatter: (d: Date) => string }[] = [];
  for (let tickIndex = Math.max(1, startIndex); tickIndex <= endIndex; tickIndex += 1) {
    for (let i = startFrequencyIndex; i <= endFrequencyIndex; i += 1) {
      const prevDate = domain[tickIndex - 1];
      const currentDate = domain[tickIndex];

      if (
        prevDate instanceof Date &&
        currentDate instanceof Date &&
        ticksFrequencies[i].isTick(prevDate, currentDate)
      ) {
        ticks.push({ index: tickIndex, formatter: ticksFrequencies[i].format });

        // once we found a matching tick space, we can break the inner loop
        break;
      }
    }
  }

  return ticks;
}

interface GetTicksOptions
  extends
    Pick<TickParams, 'tickInterval' | 'tickPlacement' | 'tickLabelPlacement' | 'tickSpacing'>,
    Required<Pick<TickParams, 'tickNumber'>> {
  scale: D3Scale;
  valueFormatter?: AxisConfig['valueFormatter'];
  isInside: (offset: number) => boolean;
  ordinalTimeTicks?: OrdinalTimeTicks;
}

export function getTicks(options: GetTicksOptions) {
  const {
    scale,
    tickNumber,
    valueFormatter,
    tickInterval,
    tickPlacement: tickPlacementProp,
    tickLabelPlacement: tickLabelPlacementProp,
    tickSpacing,
    isInside,
    ordinalTimeTicks,
  } = options;

  if (ordinalTimeTicks !== undefined && isDateData(scale.domain()) && isOrdinalScale(scale)) {
    // ordinal scale with spaced ticks.
    const domain = scale.domain();

    if (domain.length === 0 || domain.length === 1) {
      return [];
    }

    const tickPlacement = 'middle';
    const ticksIndexes = getTimeTicks(
      domain,
      tickNumber,
      ordinalTimeTicks.map((tickDef) =>
        typeof tickDef === 'string' ? tickFrequencies[tickDef] : tickDef,
      ),
      scale,
      isInside,
    );

    return ticksIndexes.map(({ index, formatter }) => {
      const value = domain[index];
      const formattedValue = formatter(value as Date);
      return {
        value,
        formattedValue,
        offset: getTickPosition(scale, value, tickPlacement),
        labelOffset: 0,
      };
    });
  }

  const tickPlacement = tickPlacementProp ?? 'extremities';

  // Standard ordinal scale: 1 item =1 tick
  if (isOrdinalScale(scale)) {
    const domain = scale.domain();
    const tickLabelPlacement = tickLabelPlacementProp ?? 'middle';

    let filteredDomain = domain;
    if (typeof tickInterval === 'object' && tickInterval != null) {
      filteredDomain = tickInterval;
    } else {
      if (typeof tickInterval === 'function') {
        filteredDomain = filteredDomain.filter(tickInterval);
      }

      if (tickSpacing !== undefined && tickSpacing > 0) {
        filteredDomain = applyTickSpacing(filteredDomain, scale.range(), tickSpacing);
      }
    }

    if (filteredDomain.length === 0) {
      return [];
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
  const visibleTicks: TickItem[] = [];

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
  options: Omit<GetTicksOptions, 'isInside'> & { direction: 'x' | 'y' },
): TickItem[] {
  const {
    scale,
    tickNumber,
    valueFormatter,
    tickInterval,
    tickPlacement = 'extremities',
    tickLabelPlacement,
    tickSpacing,
    direction,
    ordinalTimeTicks,
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
        ordinalTimeTicks,
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
      ordinalTimeTicks,
    ],
  );
}
