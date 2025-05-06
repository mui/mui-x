'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useDrawingArea } from '../hooks/useDrawingArea';
import type { CommonOverlayProps } from './ChartsOverlay';
import { useChartsLocalization } from '../hooks/useChartsLocalization';

const StyledText = styled('text')(({ theme }) => ({
  ...theme.typography.body2,
  stroke: 'none',
  fill: (theme.vars || theme).palette.text.primary,
  shapeRendering: 'crispEdges',
  textAnchor: 'middle',
  dominantBaseline: 'middle',
}));

export function ChartsLoadingOverlay(props: CommonOverlayProps) {
  const { message, ...other } = props;
  const { top, left, height, width } = useDrawingArea();
  const { localeText } = useChartsLocalization();

  return (
    <StyledText x={left + width / 2} y={top + height / 2} {...other}>
      {message ?? localeText.loading}
    </StyledText>
  );
}
