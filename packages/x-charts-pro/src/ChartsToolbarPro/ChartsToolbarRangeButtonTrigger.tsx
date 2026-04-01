'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import {
  useChartsContext,
  type ChartsSlotProps,
  useChartsSlots,
  type UseChartCartesianAxisSignature,
  selectorChartRawXAxis,
  selectorChartXAxisWithDomains,
  selectorChartZoomOptionsLookup,
  selectorChartZoomMap,
  type AxisId,
} from '@mui/x-charts/internals';
import { type RenderProp, useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import useId from '@mui/utils/useId';
import {
  type UseChartProZoomSignature,
  selectorChartActiveRangeButtonKey,
} from '../internals/plugins/useChartProZoom';
import { type RangeButtonValue, rangeButtonValueToZoom } from './rangeButtonValueToZoom';

export interface ChartsToolbarRangeButtonTriggerProps {
  /**
   * A function to customize the rendering of the component.
   */
  render?: RenderProp<ChartsSlotProps['baseToggleButton']>;
  /**
   * The range value. Specifies how far back from the end of the data to zoom.
   *
   * - `{ unit, step }` — A calendar interval from the end of the data (e.g., `{ unit: 'month', step: 3 }` for 3 months).
   * - `[start, end]` — An absolute date range.
   * - `(domainMin, domainMax, zoomedMin, zoomedMax) => { start, end }` — A function that receives the full axis domain bounds and the current zoomed-in bounds (as timestamps) and returns zoom percentages.
   * - `null` — Resets zoom to show all data.
   */
  value: RangeButtonValue;
  /**
   * The axis ID to apply the range to.
   * Defaults to the first x-axis with zoom enabled.
   */
  axisId?: AxisId;
  /**
   * The size of the button.
   * @default 'small'
   */
  size?: 'small' | 'medium' | 'large';
}

/**
 * A button that sets the chart zoom to a predefined time range.
 * It renders the `baseButton` slot.
 */
const ChartsToolbarRangeButtonTrigger = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<ChartsToolbarRangeButtonTriggerProps>
>(function ChartsToolbarRangeButtonTrigger(
  { render, value, axisId: axisIdProp, size = 'small', ...other },
  ref,
) {
  const { slots, slotProps } = useChartsSlots();
  const { instance, store } =
    useChartsContext<[UseChartCartesianAxisSignature, UseChartProZoomSignature]>();

  const buttonKey = useId();
  const zoomOptionsLookup = store.use(selectorChartZoomOptionsLookup);
  const rawXAxes = store.use(selectorChartRawXAxis);
  const { domains } = store.use(selectorChartXAxisWithDomains);
  const zoomMap = store.use(selectorChartZoomMap);
  const activeRangeButtonKey = store.use(selectorChartActiveRangeButtonKey);

  // Resolve the target axis ID: use the prop, or find the first time-scale x-axis with zoom enabled.
  const resolvedAxisId = React.useMemo(() => {
    if (axisIdProp !== undefined) {
      return axisIdProp;
    }
    if (!rawXAxes) {
      return undefined;
    }
    const timeAxis = rawXAxes.find(
      (axis) =>
        (axis.scaleType === 'time' || axis.scaleType === 'utc') &&
        zoomOptionsLookup[axis.id] !== undefined,
    );
    return timeAxis?.id;
  }, [axisIdProp, rawXAxes, zoomOptionsLookup]);

  // Get the full (unzoomed) domain for the target axis.
  const axisDomain = React.useMemo(() => {
    if (resolvedAxisId === undefined) {
      return undefined;
    }
    const domainDef = domains[resolvedAxisId];
    if (!domainDef || domainDef.domain.length < 2) {
      return undefined;
    }
    const min = domainDef.domain[0];
    const max = domainDef.domain[domainDef.domain.length - 1];
    return { min: Number(min), max: Number(max) };
  }, [resolvedAxisId, domains]);

  // Compute zoomed-in bounds from current zoom percentages and full domain.
  const currentZoom = resolvedAxisId !== undefined ? zoomMap?.get(resolvedAxisId) : undefined;
  const zoomedBounds = React.useMemo(() => {
    if (!axisDomain || !currentZoom) {
      return undefined;
    }
    const range = axisDomain.max - axisDomain.min;
    return {
      min: axisDomain.min + (currentZoom.start / 100) * range,
      max: axisDomain.min + (currentZoom.end / 100) * range,
    };
  }, [axisDomain, currentZoom]);

  const isActive = activeRangeButtonKey === buttonKey;

  const handleClick = React.useCallback(() => {
    if (resolvedAxisId === undefined || !axisDomain || !zoomedBounds || !buttonKey) {
      return;
    }
    const zoom = rangeButtonValueToZoom(
      value,
      axisDomain.min,
      axisDomain.max,
      zoomedBounds.min,
      zoomedBounds.max,
    );
    // setAxisZoomData clears activeRangeButtonKey, then we set it back.
    instance.setAxisZoomData(resolvedAxisId, {
      axisId: resolvedAxisId,
      start: zoom.start,
      end: zoom.end,
    });
    instance.setActiveRangeButtonKey(buttonKey);
  }, [resolvedAxisId, axisDomain, zoomedBounds, value, instance, buttonKey]);

  const element = useComponentRenderer(slots.baseToggleButton, render, {
    ...slotProps.baseToggleButton,
    onClick: handleClick,
    selected: isActive,
    value: buttonKey,
    size,
    style: {
      fontSize: '0.75rem',
      minWidth: 'unset',
      border: 'none',
    },
    ...other,
    ref,
  });

  return <React.Fragment>{element}</React.Fragment>;
});

ChartsToolbarRangeButtonTrigger.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The axis ID to apply the range to.
   * Defaults to the first x-axis with zoom enabled.
   */
  axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * A function to customize the rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  /**
   * The size of the button.
   * @default 'small'
   */
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  /**
   * The range value. Specifies how far back from the end of the data to zoom.
   *
   * - `{ unit, step }` — A calendar interval from the end of the data (e.g., `{ unit: 'month', step: 3 }` for 3 months).
   * - `[start, end]` — An absolute date range.
   * - `(domainMin, domainMax, zoomedMin, zoomedMax) => { start, end }` — A function that receives the full axis domain bounds and the current zoomed-in bounds (as timestamps) and returns zoom percentages.
   * - `null` — Resets zoom to show all data.
   */
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.instanceOf(Date).isRequired),
    PropTypes.func,
    PropTypes.shape({
      step: PropTypes.number,
      unit: PropTypes.oneOf([
        'day',
        'hour',
        'microsecond',
        'millisecond',
        'minute',
        'month',
        'second',
        'week',
        'year',
      ]).isRequired,
    }),
  ]),
} as any;

export { ChartsToolbarRangeButtonTrigger };
