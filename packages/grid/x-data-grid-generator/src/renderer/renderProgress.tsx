import * as React from 'react';
import clsx from 'clsx';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';
import { styled, alpha } from '@mui/material/styles';

interface ProgressBarProps {
  value: number;
}

const Root = styled('div')({
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: 26,
  borderRadius: 3,
  '&.low': {
    backgroundColor: alpha('#FF505F', 0.1),
    ' .progress-bar': {
      backgroundColor: '#FF505F',
    },
  },
  '&.medium': {
    backgroundColor: alpha('#F4C000', 0.2),
    '.progress-bar': {
      backgroundColor: '#F4C000',
    },
  },
  '&.high': {
    backgroundColor: alpha('#21CC66', 0.1),
    ' .progress-bar': {
      backgroundColor: '#21CC66',
    },
  },
});

const Value = styled('div')({
  position: 'absolute',
  lineHeight: '24px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
});

const Bar = styled('div')({
  height: '100%',
});

const ProgressBar = React.memo(function ProgressBar(props: ProgressBarProps) {
  const { value } = props;
  const valueInPercent = value * 100;

  return (
    <Root
      className={clsx({
        low: valueInPercent < 30,
        medium: valueInPercent >= 30 && valueInPercent <= 70,
        high: valueInPercent > 70,
      })}
    >
      <Value>{`${valueInPercent.toLocaleString()} %`}</Value>
      <Bar className="progress-bar" style={{ maxWidth: `${valueInPercent}%` }} />
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
