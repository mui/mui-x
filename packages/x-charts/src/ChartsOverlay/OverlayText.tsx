'use client';
import { styled } from '@mui/material/styles';
import type { CommonOverlayProps } from './ChartsOverlay';
import { useChartsLocalization, useDrawingArea } from '../hooks';

export const StyledText = styled('text', {
  slot: 'internal',
  shouldForwardProp: undefined,
})(({ theme }) => ({
  ...theme.typography.body2,
  stroke: 'none',
  fill: (theme.vars || theme).palette.text.primary,
  shapeRendering: 'crispEdges',
  textAnchor: 'middle',
  dominantBaseline: 'middle',
}));

function OverlayText(props: CommonOverlayProps & { state: 'loading' | 'noData' }) {
  const { message, state, ...other } = props;
  const { top, left, height, width } = useDrawingArea();
  const { localeText } = useChartsLocalization();

  return (
    <StyledText x={left + width / 2} y={top + height / 2} {...other}>
      {message ?? (state === 'loading' ? localeText.loading : localeText.noData)}
    </StyledText>
  );
}

export default OverlayText;
