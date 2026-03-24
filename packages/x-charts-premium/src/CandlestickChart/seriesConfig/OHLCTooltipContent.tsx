import * as React from 'react';
import clsx from 'clsx';
import { ChartsTooltipCell, ChartsTooltipRow } from '@mui/x-charts/ChartsTooltip';
import {
  type AxisTooltipContentProps,
  type ItemTooltipContentProps,
} from '@mui/x-charts/internals';
import { useChartsLocalization } from '@mui/x-charts/hooks';
import { useChartsTooltipUtilityClasses } from '@mui/x-charts/internals';
import { type OHLCField } from '../../models';
import { type OHLCTooltipFormattedValue } from './tooltip';
import { useOHLCSeries } from '../../hooks/useOHLCSeries';

const OHLC_FIELDS: OHLCField[] = ['open', 'high', 'low', 'close'];

/**
 * Resolves formatted values for OHLC tooltip items.
 *
 * The item tooltip path (tooltipGetter) provides `formattedValue` as an `OHLCTooltipFormattedValue` object.
 * The axis tooltip path (useAxesTooltip) constructs data generically, so `formattedValue` is not usable.
 * In the latter case, we format each field from the raw series data.
 */
function useFormattedValues(
  value: unknown,
  formattedValue: unknown,
  seriesId: string,
): OHLCTooltipFormattedValue | null {
  const series = useOHLCSeries(seriesId);

  return React.useMemo(() => {
    // Item tooltip path: formattedValue is already a proper object
    if (typeof formattedValue === 'object' && formattedValue !== null && 'open' in formattedValue) {
      return formattedValue as OHLCTooltipFormattedValue;
    }

    // Axis tooltip path: value is the raw OHLCValueType tuple at runtime.
    // Use the series valueFormatter to compute per-field formatted values.
    if (series == null || !Array.isArray(value)) {
      return null;
    }

    const tuple = value as [number, number, number, number];
    return {
      open: series.valueFormatter(tuple[0], { dataIndex: 0, field: 'open' }),
      high: series.valueFormatter(tuple[1], { dataIndex: 0, field: 'high' }),
      low: series.valueFormatter(tuple[2], { dataIndex: 0, field: 'low' }),
      close: series.valueFormatter(tuple[3], { dataIndex: 0, field: 'close' }),
    };
  }, [formattedValue, value, series]);
}

function getSeriesId(
  item: AxisTooltipContentProps<'ohlc'>['item'] | ItemTooltipContentProps<'ohlc'>['item'],
): string {
  if ('identifier' in item) {
    return item.identifier.seriesId;
  }
  return item.seriesId;
}

export function OHLCTooltipContent(
  props: AxisTooltipContentProps<'ohlc'> | ItemTooltipContentProps<'ohlc'>,
) {
  const { item } = props;
  const classes = useChartsTooltipUtilityClasses(props.classes);
  const { localeText } = useChartsLocalization();

  const seriesId = getSeriesId(item);
  const value = 'value' in item ? item.value : null;
  const rawFormattedValue = 'formattedValue' in item ? item.formattedValue : null;
  const formattedValues = useFormattedValues(value, rawFormattedValue, seriesId);

  /* This can only happen if the series is a radar series, but this is a candlestick tooltip,
   * so in practice this will never happen.
   * We can remove this if/when we fix the multiples values in an item tooltip
   * introduced with the radar chart. */
  if ('values' in item) {
    return null;
  }

  if (value == null || formattedValues == null) {
    return null;
  }

  return (
    <React.Fragment>
      {OHLC_FIELDS.map((field) => (
        <ChartsTooltipRow key={field} className={classes.row}>
          <ChartsTooltipCell className={clsx(classes.labelCell, classes.cell)} component="th">
            {localeText[field]}
          </ChartsTooltipCell>
          <ChartsTooltipCell className={clsx(classes.valueCell, classes.cell)} component="td">
            {formattedValues[field]}
          </ChartsTooltipCell>
        </ChartsTooltipRow>
      ))}
    </React.Fragment>
  );
}
