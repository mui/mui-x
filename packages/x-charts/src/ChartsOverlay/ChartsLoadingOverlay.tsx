'use client';
import type { CommonOverlayProps } from './ChartsOverlay';
import OverlayText from './OverlayText';

export function ChartsLoadingOverlay(props: CommonOverlayProps) {
  return <OverlayText state="loading" {...props} />;
}
