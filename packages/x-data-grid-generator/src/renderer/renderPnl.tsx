import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';

const Value = styled('div')(({ theme }) => ({
  width: '100%',
  fontVariantNumeric: 'tabular-nums',
  '&.positive': {
    color: theme.palette.success.light,
    ...theme.applyStyles('light', {
      color: theme.palette.success.dark,
    }),
  },
  '&.negative': {
    color: theme.palette.error.light,
    ...theme.applyStyles('light', {
      color: theme.palette.error.dark,
    }),
  },
}));

function pnlFormatter(value: number) {
  return value < 0 ? `(${Math.abs(value).toLocaleString()})` : value.toLocaleString();
}

interface PnlProps {
  value: number;
}

const Pnl = React.memo(function Pnl(props: PnlProps) {
  const { value } = props;

  return (
    <Value
      className={clsx({
        positive: value > 0,
        negative: value < 0,
      })}
    >
      {pnlFormatter(value)}
    </Value>
  );
});

export function renderPnl(params: GridRenderCellParams<any, number, any>) {
  if (params.value == null) {
    return '';
  }

  return <Pnl value={params.value} />;
}
