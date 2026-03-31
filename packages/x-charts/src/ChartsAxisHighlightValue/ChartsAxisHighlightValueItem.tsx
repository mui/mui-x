'use client';
import * as React from 'react';
import { styled, type SxProps } from '@mui/material/styles';
import {
  chartsAxisHighlightValueClasses,
  useUtilityClasses,
} from './chartsAxisHighlightValueClasses';

const ChartsAxisHighlightValueText = styled('div', {
  name: 'MuiChartsAxisHighlightValue',
  slot: 'Root',
})(({ theme }) => ({
  ...theme.typography.caption,
  padding: theme.spacing(0.5, 1),
  border: `solid ${theme.palette.divider} 1px`,
  backgroundColor: theme.palette.background.paper,

  '--gap': 'calc(-1*min(var(--min),max(calc(100% - var(--max)),50%)))',
  [`&.${chartsAxisHighlightValueClasses.top}`]: {
    transform: `translate(var(--gap), -100%)`,
  },
  [`&.${chartsAxisHighlightValueClasses.bottom}`]: {
    transform: 'translate(var(--gap), 0)',
  },
  [`&.${chartsAxisHighlightValueClasses.left}`]: {
    transform: 'translate(-100%, var(--gap))',
  },
  [`&.${chartsAxisHighlightValueClasses.right}`]: {
    transform: 'translate(0,var(--gap))',
  },
}));

export interface ChartsAxisHighlightValueItemProps {
  x: number;
  y: number;
  formattedValue: string;
  position: 'top' | 'right' | 'bottom' | 'left';
  minCoord: number;
  maxCoord: number;
  space: number;
  sx?: SxProps;
}

function ChartsAxisHighlightValueItem(props: ChartsAxisHighlightValueItemProps) {
  const { x, y, position, formattedValue, minCoord, maxCoord, space, sx } = props;

  const classes = useUtilityClasses({ position });

  const isXAxis = position === 'top' || position === 'bottom';
  return (
    <ChartsAxisHighlightValueText
      className={classes.root}
      style={
        {
          position: 'absolute',
          top: y,
          left: x,
          '--min': `${isXAxis ? x - minCoord : y - minCoord}px`,
          '--max': `${isXAxis ? maxCoord - x : maxCoord - y}px`,
          '--space': `${space}px`,
        } as React.CSSProperties
      }
      sx={sx}
    >
      {formattedValue}
    </ChartsAxisHighlightValueText>
  );
}

export { ChartsAxisHighlightValueItem };
