'use client';
import * as React from 'react';
import { useChartContext } from '../context/ChartProvider';
import { AxisConfig, D3ContinuousScale, D3Scale } from '../models/axis';
import { isBandScale, isOrdinalScale } from '../internals/scaleGuards';
import { isInfinity } from '../internals/isInfinity';
import { tickFrequencies, TimeOrdinalTicks, TicksFrequencyDefinition } from '../internals/timeTicks';

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

interface GetTicksOptions
  extends Pick<TickParams, 'tickInterval' | 'tickPlacement' | 'tickLabelPlacement'>,
  Required<Pick<TickParams, 'tickNumber'>> {
  scale: D3Scale;
  valueFormatter?: AxisConfig['valueFormatter'];
  isInside: (offset: number) => boolean;
  timeOrdinalTicks?: TimeOrdinalTicks;
}

function getTimeTicks(domain: Date[], tickNumber: number, tickSpaces: TicksFrequencyDefinition[]) {
  const start = domain[0];
  const end = domain[domain.length - 1];

  let startSpaceIndex = 0;
  while (
    startSpaceIndex < tickSpaces.length &&
    tickSpaces[startSpaceIndex].getTickNumber(start, end) === 0
  ) { startSpaceIndex += 1; }

  let endSpaceIndex = Math.max(0, startSpaceIndex - 1);

  let prevTickCount = tickSpaces[endSpaceIndex].getTickNumber(start, end);
  let nextTickCount = tickSpaces[endSpaceIndex + 1].getTickNumber(start, end);

  // Smooth ratio between ticks steps: ticksNumber[i]*ticksNumber[i+1] <= targetTickNumber^2
  while (
    endSpaceIndex + 1 < tickSpaces.length &&
    (nextTickCount <= tickNumber || tickNumber / prevTickCount >= nextTickCount / tickNumber)
  ) {
    endSpaceIndex += 1;
    prevTickCount = nextTickCount;
    if (endSpaceIndex + 1 < tickSpaces.length) { nextTickCount = tickSpaces[endSpaceIndex + 1].getTickNumber(start, end); }
  }

  const ticks: { index: number; formatter: (d: Date) => string }[] = [];
  for (let tickIndex = 1; tickIndex < domain.length; tickIndex += 1) {
    for (let i = startSpaceIndex; i <= endSpaceIndex; i += 1) {
      const prevDate = domain[tickIndex - 1];
      const currentDate = domain[tickIndex];
      if (tickSpaces[i].isTick(prevDate, currentDate)) {
        ticks.push({ index: tickIndex, formatter: tickSpaces[i].format });

        // once we found a matching tick space, we can break the inner loop
        i = endSpaceIndex + 1;
      }
    }
  }

  return ticks;
}

export function getTicks(options: GetTicksOptions) {
  const {
    scale,
    tickNumber,
    valueFormatter,
    tickInterval,
    tickPlacement: tickPlacementProp,
    tickLabelPlacement: tickLabelPlacementProp,
    isInside,
    timeOrdinalTicks,
  } = options;

  // ordinal scale with spaced ticks.
  if (isOrdinalScale(scale) && timeOrdinalTicks !== undefined && timeOrdinalTicks.length > 0) {
    const domain = scale.domain();

    const tickPlacement = 'middle';
    const ticksIndexes = getTimeTicks(
      domain as Date[],
      tickNumber,
      timeOrdinalTicks.map((tickDef) =>
        typeof tickDef === 'string' ? tickFrequencies[tickDef] : tickDef,
      ),
    );

    return ticksIndexes.map(({ index, formatter }) => {
      const value = domain[index];
      const formattedValue = formatter(value as Date);
      return {
        value,
        formattedValue,
        offset:
          scale(value)! -
          (scale.step() - scale.bandwidth()) / 2 +
          offsetRatio[tickPlacement] * scale.step(),
        labelOffset: 0,
      };
    });
  }

  const tickPlacement = tickPlacementProp ?? 'extremities';

  // Standard ordinal scale: 1 item =1 tick
  if (isOrdinalScale(scale)) {
    const domain = scale.domain();

    const tickLabelPlacement = tickLabelPlacementProp ?? 'middle';

    if (isBandScale(scale)) {
      // scale type = 'band'
      const filteredDomain =
        (typeof tickInterval === 'function' && domain.filter(tickInterval)) ||
        (typeof tickInterval === 'object' && tickInterval) ||
        domain;

      return [
        ...filteredDomain.map((value) => {
          const defaultTickLabel = `${value}`;

          return {
            value,
            formattedValue:
              valueFormatter?.(value, { location: 'tick', scale, tickNumber, defaultTickLabel }) ??
              defaultTickLabel,
            offset:
              scale(value)! -
              (scale.step() - scale.bandwidth()) / 2 +
              offsetRatio[tickPlacement] * scale.step(),
            labelOffset:
              tickLabelPlacement === 'tick'
                ? 0
                : scale.step() * (offsetRatio[tickLabelPlacement] - offsetRatio[tickPlacement]),
          };
        }),

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
  options: Omit<GetTicksOptions, 'isInside'> & { direction: 'x' | 'y' },
): TickItemType[] {
  const {
    scale,
    tickNumber,
    valueFormatter,
    tickInterval,
    tickPlacement = 'extremities',
    tickLabelPlacement,
    direction,
    timeOrdinalTicks,
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
        valueFormatter,
        isInside,
        timeOrdinalTicks,
      }),
    [
      scale,
      tickNumber,
      tickPlacement,
      tickInterval,
      tickLabelPlacement,
      valueFormatter,
      isInside,
      timeOrdinalTicks,
    ],
  );
}
