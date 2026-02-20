'use client';
import type { CommonOverlayProps } from './ChartsOverlay';
import OverlayText from './OverlayText';

export function ChartsNoDataOverlay(props: CommonOverlayProps) {
  return <OverlayText state="noData" {...props} />;
}
