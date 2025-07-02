'use client';
import { warnOnce } from '@mui/x-internals/warning';
import type { ZoomConfig, DefaultizedZoomConfig } from './ZoomConfig.types';

export const defaultizeZoomConfig = (zoomConfig?: ZoomConfig): DefaultizedZoomConfig => {
  const defaultizedConfig: DefaultizedZoomConfig = { zoom: {}, pan: {} };

  if (!zoomConfig?.zoom) {
    defaultizedConfig.zoom = {
      onWheel: { type: 'onWheel', mode: 'all', keys: [] },
      onPinch: { type: 'onPinch', mode: 'all', keys: [] },
      onTapAndDrag: { type: 'onTapAndDrag', mode: 'touch', keys: [] },
    };
  } else {
    zoomConfig.zoom.forEach((interaction) => {
      if (typeof interaction === 'string') {
        defaultizedConfig.zoom[interaction] = { type: interaction, mode: 'all', keys: [] };
      } else {
        defaultizedConfig.zoom[interaction.type as string] = {
          type: interaction.type,
          mode: interaction.mode ?? 'all',
          keys: interaction.keys ?? [],
        };
      }
    });
  }

  if (!zoomConfig?.pan) {
    defaultizedConfig.pan = {
      onDrag: { type: 'onDrag', mode: 'all', keys: [] },
    };
  } else {
    zoomConfig.pan.forEach((interaction) => {
      if (typeof interaction === 'string') {
        defaultizedConfig.pan[interaction] = { type: interaction, mode: 'all', keys: [] };
      } else {
        defaultizedConfig.pan[interaction.type as string] = {
          type: interaction.type,
          mode: interaction.mode ?? 'all',
          keys: interaction.keys ?? [],
        };
      }
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    // Currently only the pan interactions can conflict with each other.
    isModeConflict(defaultizedConfig.pan.onDrag, defaultizedConfig.pan.onDoubleDrag);
    isModeConflict(defaultizedConfig.pan.onDrag, defaultizedConfig.pan.onPressAndDrag);
    isModeConflict(defaultizedConfig.pan.onDoubleDrag, defaultizedConfig.pan.onPressAndDrag);
  }

  return defaultizedConfig;
};

function isModeConflict<
  T1 extends { type: string; mode?: any } | undefined,
  T2 extends { type: string; mode?: any } | undefined,
>(a: T1, b: T2): void {
  const hasIssue = a && b && (a.mode === 'all' || b.mode === 'all' || a.mode === b.mode);

  if (hasIssue) {
    warnOnce([
      `MUI X Charts: '${a.type}' should not be used with '${b.type}'.`,
      `It can lead to unexpected behavior when both interactions are enabled with the same mode.`,
    ]);
  }
}
