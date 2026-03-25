'use client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { getValueToPositionMapper } from '../hooks/getValueToPositionMapper';
import { useStore } from '../internals/store/useStore';
import {
  selectorChartsHighlightXAxisValue,
  selectorChartsHighlightYAxisValue,
  selectorChartXAxis,
  selectorChartYAxis,
  type UseChartCartesianAxisSignature,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { useDrawingArea } from '../hooks';
import { type AxisId } from '../models/axis';
import { utcFormatter } from '../ChartsTooltip/utils';
import type { UseChartBrushSignature } from '../internals/plugins/featurePlugins/useChartBrush';
import { useChartsLayerContainerRef } from '../hooks/useChartsLayerContainerRef';

export type ChartsAxisValueTooltipPosition = 'start' | 'end' | 'both' | 'none';

export interface ChartsAxisValueTooltipProps {
  /**
   * The axis direction.
   */
  axisDirection: 'x' | 'y';
  /**
   * The id of the axis.
   * If not provided, defaults to the first axis.
   */
  axisId?: AxisId;
  /**
   * The position of the label relative to the drawing area.
   * - `'start'`: at the beginning of the drawing area (top for x-axis, left for y-axis).
   * - `'end'`: at the end of the drawing area (bottom for x-axis, right for y-axis).
   * - `'both'`: at both positions.
   * - `'none'`: no label is displayed.
   * @default 'end'
   */
  labelPosition?: ChartsAxisValueTooltipPosition;
  /**
   * The value to display.
   * If not defined, tracks the axis highlight value from user interaction.
   */
  value?: number | Date | string | null;
  /**
   * A function to format the displayed value.
   * If not provided, uses the axis `valueFormatter`, or falls back to a default formatter.
   * @param {number | Date | string} value The value to format.
   * @returns {string} The formatted string.
   */
  valueFormatter?: (value: number | Date | string) => string;
}

const ChartsAxisValueTooltipText = styled('text', {
  name: 'MuiChartsAxisValueTooltip',
  slot: 'Root',
})(({ theme }) => ({
  ...theme.typography.caption,
  fill: (theme.vars || theme).palette.text.primary,
  pointerEvents: 'none',
}));

type AxisHighlightItem = {
  axisId: AxisId;
  value: number | Date | string;
};

type ComputedAxis = {
  scaleType: string;
  scale: any;
  valueFormatter?: (value: any, context: any) => string;
};

function getAxisValueFormatter(
  axis: ComputedAxis,
  valueFormatter?: (value: number | Date | string) => string,
): (value: number | Date | string) => string {
  if (valueFormatter) {
    return valueFormatter;
  }

  if (axis.valueFormatter) {
    return (v: number | Date | string) =>
      axis.valueFormatter!(v as any, { location: 'tooltip', scale: axis.scale });
  }

  return (v: number | Date | string) =>
    axis.scaleType === 'utc' ? utcFormatter(v) : `${v instanceof Date ? v.toLocaleString() : v}`;
}

function ChartsXAxisValueTooltipContent(
  props: Omit<ChartsAxisValueTooltipProps, 'axisDirection'>,
) {
  const { axisId, labelPosition = 'end', value, valueFormatter } = props;

  const { top, height } = useDrawingArea();

  const store = useStore<[UseChartCartesianAxisSignature, UseChartBrushSignature]>();
  const axisHighlightValues = store.use(selectorChartsHighlightXAxisValue);
  const xAxes = store.use(selectorChartXAxis);

  let items: AxisHighlightItem[];

  if (value !== undefined && value !== null) {
    const targetAxisId = axisId ?? xAxes.axisIds[0];
    items = [{ axisId: targetAxisId, value }];
  } else {
    items = axisHighlightValues
      .filter(
        (item) => (axisId === undefined || item.axisId === axisId) && item.value !== undefined,
      )
      .map((item) => ({ axisId: item.axisId, value: item.value }));
  }

  if (items.length === 0 || labelPosition === 'none') {
    return null;
  }

  return items.map(({ axisId: itemAxisId, value: itemValue }) => {
    const axis = xAxes.axis[itemAxisId];
    if (!axis) {
      return null;
    }

    const xScale = axis.scale;
    const xPosition = getValueToPositionMapper(xScale)(itemValue);

    if (!Number.isFinite(xPosition)) {
      return null;
    }

    const format = getAxisValueFormatter(axis, valueFormatter);
    const formattedValue = format(itemValue);

    return (
      <React.Fragment key={`${itemAxisId}-${String(itemValue)}`}>
        {(labelPosition === 'start' || labelPosition === 'both') && (
          <ChartsAxisValueTooltipText
            x={xPosition}
            y={top}
            textAnchor="middle"
            dominantBaseline="auto"
          >
            {formattedValue}
          </ChartsAxisValueTooltipText>
        )}
        {(labelPosition === 'end' || labelPosition === 'both') && (
          <ChartsAxisValueTooltipText
            x={xPosition}
            y={top + height}
            textAnchor="middle"
            dominantBaseline="hanging"
          >
            {formattedValue}
          </ChartsAxisValueTooltipText>
        )}
      </React.Fragment>
    );
  });
}

function ChartsYAxisValueTooltipContent(
  props: Omit<ChartsAxisValueTooltipProps, 'axisDirection'>,
) {
  const { axisId, labelPosition = 'end', value, valueFormatter } = props;

  const { left, width } = useDrawingArea();

  const store = useStore<[UseChartCartesianAxisSignature, UseChartBrushSignature]>();
  const axisHighlightValues = store.use(selectorChartsHighlightYAxisValue);
  const yAxes = store.use(selectorChartYAxis);

  let items: AxisHighlightItem[];

  if (value !== undefined && value !== null) {
    const targetAxisId = axisId ?? yAxes.axisIds[0];
    items = [{ axisId: targetAxisId, value }];
  } else {
    items = axisHighlightValues
      .filter(
        (item) => (axisId === undefined || item.axisId === axisId) && item.value !== undefined,
      )
      .map((item) => ({ axisId: item.axisId, value: item.value }));
  }

  if (items.length === 0 || labelPosition === 'none') {
    return null;
  }

  return items.map(({ axisId: itemAxisId, value: itemValue }) => {
    const axis = yAxes.axis[itemAxisId];
    if (!axis) {
      return null;
    }

    const yScale = axis.scale;
    const yPosition = getValueToPositionMapper(yScale)(itemValue);

    if (!Number.isFinite(yPosition)) {
      return null;
    }

    const format = getAxisValueFormatter(axis, valueFormatter);
    const formattedValue = format(itemValue);

    return (
      <React.Fragment key={`${itemAxisId}-${String(itemValue)}`}>
        {(labelPosition === 'start' || labelPosition === 'both') && (
          <ChartsAxisValueTooltipText
            x={left}
            y={yPosition}
            textAnchor="end"
            dominantBaseline="central"
          >
            {formattedValue}
          </ChartsAxisValueTooltipText>
        )}
        {(labelPosition === 'end' || labelPosition === 'both') && (
          <ChartsAxisValueTooltipText
            x={left + width}
            y={yPosition}
            textAnchor="start"
            dominantBaseline="central"
          >
            {formattedValue}
          </ChartsAxisValueTooltipText>
        )}
      </React.Fragment>
    );
  });
}

/**
 * A tooltip component that displays the axis value at the edge of the drawing area,
 * aligned with the current axis highlight position.
 *
 * Renders as a portal into the ChartsLayerContainer, appearing as the last child.
 *
 * Demos:
 *
 * - [Custom components](https://mui.com/x/react-charts/components/)
 *
 * API:
 *
 * - [ChartsAxisValueTooltip API](https://mui.com/x/api/charts/charts-axis-value-tooltip/)
 */
function ChartsAxisValueTooltip(props: ChartsAxisValueTooltipProps) {
  const { axisDirection, ...rest } = props;
  const chartsLayerContainerRef = useChartsLayerContainerRef();

  const content =
    axisDirection === 'x' ? (
      <ChartsXAxisValueTooltipContent {...rest} />
    ) : (
      <ChartsYAxisValueTooltipContent {...rest} />
    );

  if (!chartsLayerContainerRef.current) {
    return content;
  }

  return ReactDOM.createPortal(
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      {content}
    </svg>,
    chartsLayerContainerRef.current,
  );
}

ChartsAxisValueTooltip.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The axis direction.
   */
  axisDirection: PropTypes.oneOf(['x', 'y']).isRequired,
  /**
   * The id of the axis.
   * If not provided, defaults to the first axis.
   */
  axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * The position of the label relative to the drawing area.
   * - `'start'`: at the beginning of the drawing area (top for x-axis, left for y-axis).
   * - `'end'`: at the end of the drawing area (bottom for x-axis, right for y-axis).
   * - `'both'`: at both positions.
   * - `'none'`: no label is displayed.
   * @default 'end'
   */
  labelPosition: PropTypes.oneOf(['both', 'end', 'none', 'start']),
  /**
   * The value to display.
   * If not defined, tracks the axis highlight value from user interaction.
   */
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string]),
  /**
   * A function to format the displayed value.
   * If not provided, uses the axis `valueFormatter`, or falls back to a default formatter.
   * @param {number | Date | string} value The value to format.
   * @returns {string} The formatted string.
   */
  valueFormatter: PropTypes.func,
} as any;

export { ChartsAxisValueTooltip };
