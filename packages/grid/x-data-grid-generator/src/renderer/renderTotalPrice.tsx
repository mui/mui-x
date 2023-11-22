import * as React from 'react';
import clsx from 'clsx';
import { alpha, styled } from '@mui/material/styles';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';

const Value = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  lineHeight: '100%',
  paddingRight: 8,
  fontVariantNumeric: 'tabular-nums',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  '&.good': {
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.success.mainChannel} /  0.3)`
      : alpha(theme.palette.success.main, 0.3),
  },
  '&.bad': {
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.error.mainChannel} /  0.3)`
      : alpha(theme.palette.error.main, 0.3),
  },
}));

interface TotalPriceProps {
  value: number;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const TotalPrice = React.memo(function TotalPrice(props: TotalPriceProps) {
  const { value } = props;
  return (
    <Value
      className={clsx({
        good: value > 1000000,
        bad: value < 1000000,
      })}
    >
      {currencyFormatter.format(value)}
    </Value>
  );
});

export function renderTotalPrice(params: GridRenderCellParams<any, number>) {
  if (params.value == null) {
    return '';
  }

  // If the aggregated value does not have the same unit as the other cell
  // Then we fall back to the default rendering based on `valueGetter` instead of rendering the total price UI.
  if (params.aggregation && !params.aggregation.hasCellUnit) {
    return null;
  }

  return <TotalPrice value={params.value} />;
}
