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
  type AxisId,
} from '@mui/x-charts/internals';
import { type RenderProp, useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import {
  type UseChartProZoomSignature,
  selectorChartAxisZoomData,
  selectorChartCanZoomOut,
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

  // Determine if the resolved axis is ordinal (band/point) to use index-based domain.
  const resolvedAxis = React.useMemo(
    () => rawXAxes?.find((axis) => axis.id === resolvedAxisId),
    [rawXAxes, resolvedAxisId],
  );
  const isOrdinal = resolvedAxis?.scaleType === 'band' || resolvedAxis?.scaleType === 'point';

  // Get the full domain for the target axis, ignoring the current zoom.
  // For ordinal axes (band/point), use index-based range since domain values are categories.
  const axisDomain = React.useMemo(() => {
    if (resolvedAxisId === undefined) {
      return undefined;
    }
    const domainDef = domains[resolvedAxisId];
    if (!domainDef || domainDef.domain.length < 2) {
      return undefined;
    }
    if (isOrdinal) {
      return { min: 0, max: domainDef.domain.length - 1 };
    }
    const min = domainDef.domain[0];
    const max = domainDef.domain[domainDef.domain.length - 1];
    return { min: Number(min), max: Number(max) };
  }, [resolvedAxisId, domains, isOrdinal]);

  const handleClick = React.useCallback(() => {
    if (resolvedAxisId === undefined || !axisDomain) {
      return;
    }
    const zoom = rangeButtonValueToZoom(value, {
      scaleType: resolvedAxis?.scaleType ?? 'linear',
      data: resolvedAxis?.data,
      domain: axisDomain,
    });
    instance.setAxisZoomData(resolvedAxisId, {
      axisId: resolvedAxisId,
      start: zoom.start,
      end: zoom.end,
    });
  }, [resolvedAxisId, resolvedAxis, axisDomain, value, instance]);

  // A button is selected when the current zoom range matches its computed range.
  const isActive = React.useMemo(() => {
    if (axisDomain === undefined) {
      return value === null && !canZoomOut;
    }
    const target = rangeButtonValueToZoom(value, {
      scaleType: resolvedAxis?.scaleType ?? 'linear',
      data: resolvedAxis?.data,
      domain: axisDomain,
    });
    const start = currentAxisZoom?.start ?? 0;
    const end = currentAxisZoom?.end ?? 100;
    const epsilon = 0.01;
    return Math.abs(start - target.start) < epsilon && Math.abs(end - target.end) < epsilon;
  }, [axisDomain, value, resolvedAxis, currentAxisZoom, canZoomOut]);

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
   * - `[start, end]` — An absolute date range.
   * - `(params) => { start, end }` — A function that receives axis context (`scaleType`, `data`, `domain`) and returns zoom percentages (0-100).
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
