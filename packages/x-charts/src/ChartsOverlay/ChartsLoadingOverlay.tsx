'use client';
import { styled } from '@mui/material/styles';
import type { CommonOverlayProps } from './ChartsOverlay';
import { useChartsLocalization, useDrawingArea } from '../hooks';
import { StyledText } from './common';

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
