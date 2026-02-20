'use client';
import { useDrawingArea } from '../hooks/useDrawingArea';
import type { CommonOverlayProps } from './ChartsOverlay';
import { useChartsLocalization } from '../hooks/useChartsLocalization';
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
