'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import {
  useChartsContext,
  useChartsSlots,
  selectorChartRawXAxis,
  selectorChartXAxisWithDomains,
  selectorChartZoomOptionsLookup,
} from '@mui/x-charts/internals';
import type {
  ChartsSlotProps,
  UseChartCartesianAxisSignature,
  AxisId,
} from '@mui/x-charts/internals';
import { useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import type { RenderProp } from '@mui/x-internals/useComponentRenderer';
import {
  selectorChartAxisZoomData,
  selectorChartCanZoomOut,
} from '../internals/plugins/useChartProZoom';
import type { UseChartProZoomSignature } from '../internals/plugins/useChartProZoom';
import { getRangeButtonDomainParams, rangeButtonValueToZoom } from './rangeButtonValueToZoom';
import type { RangeButtonValue } from './rangeButtonValueToZoom';

export interface ChartsToolbarRangeButtonTriggerProps {
  /**
   * A function to customize the rendering of the component.
   */
  render?: RenderProp<ChartsSlotProps['baseToggleButton']>;
  /**
   * The range value. Specifies how far back from the end of the data to zoom.
   *
   * - `{ unit, step }` — A calendar interval from the end of the data (e.g., `{ unit: 'month', step: 3 }` for 3 months).
   * - `[start, end]` — An absolute date range, or a range between two ordinal (band/point) axis values.
   * - `(params) => { start, end }` — A function that receives axis context (`scaleType`, `data`, `domain`) and returns zoom percentages (0-100).
   * - `null` — Resets zoom to show all data.
   */
  value: RangeButtonValue;
  /**
   * The axis ID to apply the range to.
   * Defaults to the first x-axis with zoom enabled.
   */
  axisId?: AxisId;
  /**
   * The label used to identify the button for active-state tracking.
   */
  label: string;
  /**
   * The size of the button.
   * @default 'small'
   */
  size?: 'small' | 'medium' | 'large';
}

/**
 * A button that sets the chart zoom to a predefined range.
 * It renders the `baseToggleButton` slot.
 */
const ChartsToolbarRangeButtonTrigger = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<ChartsToolbarRangeButtonTriggerProps>
>(function ChartsToolbarRangeButtonTrigger(
  { render, value, axisId: axisIdProp, label, size = 'small', ...other },
  ref,
) {
  const { slots, slotProps } = useChartsSlots();
  const { instance, store } =
    useChartsContext<[UseChartCartesianAxisSignature, UseChartProZoomSignature]>();
  const canZoomOut = store.use(selectorChartCanZoomOut);
  const zoomOptionsLookup = store.use(selectorChartZoomOptionsLookup);
  const rawXAxes = store.use(selectorChartRawXAxis);
  const { domains } = store.use(selectorChartXAxisWithDomains);

  // Resolve the target axis ID: use the prop, or find the first zoomable x-axis.
  const resolvedAxisId = React.useMemo(() => {
    if (axisIdProp !== undefined) {
      return axisIdProp;
    }
    if (!rawXAxes) {
      return undefined;
    }
    return rawXAxes.find((axis) => zoomOptionsLookup[axis.id] !== undefined)?.id;
  }, [axisIdProp, rawXAxes, zoomOptionsLookup]);

  const currentAxisZoom = store.use(selectorChartAxisZoomData, resolvedAxisId as AxisId);

  const resolvedAxis = React.useMemo(
    () => rawXAxes?.find((axis) => axis.id === resolvedAxisId),
    [rawXAxes, resolvedAxisId],
  );
  // Use isValueNull instead of value === null to avoid unnecessary re-renders when value is a new function/object on each render.
  const isValueNull = value === null;

  // Build the range conversion params for the target axis, ignoring the current zoom.
  const domainParams = React.useMemo(() => {
    if (resolvedAxisId === undefined || resolvedAxis === undefined) {
      return undefined;
    }
    return getRangeButtonDomainParams(resolvedAxis, domains[resolvedAxisId]?.domain);
  }, [resolvedAxisId, resolvedAxis, domains]);

  // Destructure so that returning a new object from rangeButtonValueToZoom doesn't cause unnecessary re-renders in handleClick.
  const { start: startZoom, end: endZoom } = React.useMemo(() => {
    if (domainParams === undefined) {
      return { start: undefined, end: undefined };
    }
    return rangeButtonValueToZoom(value, domainParams);
  }, [domainParams, value]);

  const handleClick = React.useCallback(() => {
    if (resolvedAxisId === undefined || startZoom === undefined || endZoom === undefined) {
      return;
    }
    instance.setAxisZoomData(resolvedAxisId, {
      axisId: resolvedAxisId,
      start: startZoom,
      end: endZoom,
    });
  }, [resolvedAxisId, startZoom, endZoom, instance]);

  // A button is selected when the current zoom range matches its computed range.
  const isActive = React.useMemo(() => {
    if (startZoom === undefined || endZoom === undefined) {
      return isValueNull && !canZoomOut;
    }
    const start = currentAxisZoom?.start ?? 0;
    const end = currentAxisZoom?.end ?? 100;
    const epsilon = 0.01;
    return Math.abs(start - startZoom) < epsilon && Math.abs(end - endZoom) < epsilon;
  }, [startZoom, endZoom, isValueNull, currentAxisZoom, canZoomOut]);

  const element = useComponentRenderer(slots.baseToggleButton, render, {
    ...slotProps.baseToggleButton,
    onClick: handleClick,
    selected: isActive,
    value: label,
    size,
    ...other,
    ref,
  });

  return <React.Fragment>{element}</React.Fragment>;
});

ChartsToolbarRangeButtonTrigger.propTypes /* remove-proptypes */ = {
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
   * The label used to identify the button for active-state tracking.
   */
  label: PropTypes.string.isRequired,
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
   * - `[start, end]` — An absolute date range, or a range between two ordinal (band/point) axis values.
   * - `(params) => { start, end }` — A function that receives axis context (`scaleType`, `data`, `domain`) and returns zoom percentages (0-100).
   * - `null` — Resets zoom to show all data.
   */
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.instanceOf(Date).isRequired),
    PropTypes.arrayOf(PropTypes.string.isRequired),
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
