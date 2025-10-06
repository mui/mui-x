'use client';
import * as React from 'react';
import { useChartContext } from '../context/ChartProvider';
import { AxisConfig, D3ContinuousScale, D3Scale } from '../models/axis';
import { isBandScale, isOrdinalScale } from '../internals/scaleGuards';
import { isInfinity } from '../internals/isInfinity';
import { getScale } from '../internals/getScale';

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
  continuousTickPlacement?: boolean;
}

/*
 * The ratio between the number of ticks in a continuous scale vs an ordinal scale needed to apply the continuous ticks logic.
 */
const CONTINUOUS_TICKS_RATIO = 3;

export function getTicks(options: GetTicksOptions) {
  const {
    scale,
    tickNumber,
    valueFormatter,
    tickInterval,
    tickPlacement: tickPlacementProp,
    tickLabelPlacement: tickLabelPlacementProp,
    isInside,
    continuousTickPlacement = false,
  } = options;

  // ordinal scale with spaced ticks.
  if (isOrdinalScale(scale) && continuousTickPlacement) {
    const domain = scale.domain();
    const range = scale.range();

    const continuousScale = getScale(
      typeof domain[0] === 'number' ? 'linear' : 'time',
      [domain[0], domain[domain.length - 1]],
      [range[0] + scale.bandwidth() / 2, range[1] - scale.bandwidth() / 2],
    );

    const ticks =
      typeof tickInterval === 'object'
        ? tickInterval
        : getDefaultTicks(continuousScale.copy().nice(tickNumber), tickNumber);

    // If the ratio is not met we stop the computation and fallback on the default ordinal ticks computation.
    if (ticks.length * CONTINUOUS_TICKS_RATIO < domain.length) {
      const visibleTicks: TickItemType[] = [];

      let bandIndex = 0;
      let lastAddedBandIndex: number | undefined = undefined;
      for (let i = 0; i < ticks.length; i += 1) {
        while (domain[bandIndex] < ticks[i] && bandIndex < domain.length - 1) {
          bandIndex += 1;
        }
        const tickValue = ticks[i];
        const bandValue = domain[bandIndex];

        // We place tick at start, end or middle of the band depending on the closest position.
        const correctOffset = continuousScale(tickValue);

        const bandStart = scale(bandValue)! - (scale.step() - scale.bandwidth()) / 2;
        let offset = bandStart;
        if (correctOffset > bandStart + 0.25 * scale.step()) {
          offset = bandStart + 0.5 * scale.step();
        }
        if (correctOffset > bandStart + 0.75 * scale.step()) {
          offset = bandStart + scale.step();
        }

        if (
          isInside(correctOffset) ||
          isInside(correctOffset - 2 * scale.step()) ||
          isInside(correctOffset + 2 * scale.step())
        ) {
          const defaultTickLabel = continuousScale.tickFormat(tickNumber)(tickValue);

          if (lastAddedBandIndex !== undefined && bandIndex === lastAddedBandIndex) {
            visibleTicks[visibleTicks.length - 1] = {
              value: bandValue,
              formattedValue:
                valueFormatter?.(bandValue, {
                  location: 'tick',
                  scale,
                  tickNumber,
                  defaultTickLabel,
                }) ?? defaultTickLabel,
              offset,
              labelOffset: 0,
            };
            continue;
          }

          visibleTicks.push({
            value: bandValue,
            formattedValue:
              valueFormatter?.(bandValue, {
                location: 'tick',
                scale,
                tickNumber,
                defaultTickLabel,
              }) ?? defaultTickLabel,
            offset,
            labelOffset: 0,
          });
          lastAddedBandIndex = bandIndex;
        }
      }

      return visibleTicks;
    }
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
    continuousTickPlacement,
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
        continuousTickPlacement,
      }),
    [
      scale,
      tickNumber,
      tickPlacement,
      tickInterval,
      tickLabelPlacement,
      valueFormatter,
      isInside,
      continuousTickPlacement,
    ],
  );
}
