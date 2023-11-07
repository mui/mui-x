import * as React from 'react';
import clsx from 'clsx';
import { styled, alpha } from '@mui/material/styles';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';

interface ProgressBarProps {
  value: number;
}

const Root = styled('div')(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: 24,
  borderRadius: 4,
  fontWeight: theme.typography.fontWeightMedium,
  '&.low': {
    backgroundColor: alpha(theme.palette.error.main, 0.1),
  },
  '&.medium': {
    backgroundColor: alpha(theme.palette.warning.main, 0.1),
  },
  '&.high': {
    backgroundColor: alpha(theme.palette.success.main, 0.1),
  },
}));

const Value = styled('div')({
  position: 'absolute',
  lineHeight: '24px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
});

const Bar = styled('div')(({ theme }) => ({
  height: '100%',
  '&.low': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.error.light, 0.8)
        : alpha(theme.palette.error.dark, 0.5),
  },
  '&.medium': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.warning.light, 0.8)
        : alpha(theme.palette.warning.dark, 0.5),
  },
  '&.high': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.success.light, 0.8)
        : alpha(theme.palette.success.dark, 0.5),
  },
}));

const ProgressBar = React.memo(function ProgressBar(props: ProgressBarProps) {
  const { value } = props;
  const valueInPercent = value * 100;
  const className = clsx({
    low: valueInPercent < 30,
    medium: valueInPercent >= 30 && valueInPercent <= 70,
    high: valueInPercent > 70,
  });

  return (
    <Root className={className}>
      <Value>{`${valueInPercent.toLocaleString()} %`}</Value>
      <Bar className={className} style={{ maxWidth: `${valueInPercent}%` }} />
    </Root>
  );
});

export function renderProgress(params: GridRenderCellParams<any, number, any>) {
  if (params.value == null) {
    return '';
  }

  // If the aggregated value does not have the same unit as the other cell
  // Then we fall back to the default rendering based on `valueGetter` instead of rendering a progress bar.
  if (params.aggregation && !params.aggregation.hasCellUnit) {
    return null;
  }

  return <ProgressBar value={params.value} />;
}
