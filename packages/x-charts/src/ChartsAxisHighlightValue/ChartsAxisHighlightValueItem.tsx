'use client';
import * as React from 'react';
import { styled, type SxProps } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system/createStyled';
import { useUtilityClasses } from './chartsAxisHighlightValueClasses';

const ChartsAxisHighlightValueText = styled('div', {
  name: 'MuiChartsAxisHighlightValue',
  slot: 'Root',

  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'position',
})<Pick<ChartsAxisHighlightValueItemProps, 'position'>>(({ theme }) => ({
  ...theme.typography.caption,
  padding: theme.spacing(0.5, 1),
  border: `solid ${theme.palette.divider} 1px`,
  backgroundColor: theme.palette.background.paper,
  '--clamped-offset': 'calc(-1*min(var(--min),max(calc(100% - var(--max)),50%)))',
  variants: [
    {
      props: { position: 'top' },
      style: {
        translate: 'var(--clamped-offset) -100%',
      },
    },
    {
      props: { position: 'bottom' },
      style: {
        translate: 'var(--clamped-offset) 0',
      },
    },
    {
      props: { position: 'left' },
      style: {
        translate: '-100% var(--clamped-offset)',
      },
    },
    {
      props: { position: 'right' },
      style: {
        translate: '0 var(--clamped-offset)',
      },
    },
  ],
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
      position={position}
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
