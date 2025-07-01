'use client';

import type { ZoomConfig, DefaultizedZoomConfig } from './ZoomConfig.types';

export const initializeZoomConfig = (zoomConfig?: ZoomConfig): DefaultizedZoomConfig => {
  const defaultizedConfig: DefaultizedZoomConfig = { zoom: {}, pan: {} };

  if (!zoomConfig?.zoom) {
    defaultizedConfig.zoom = {
      onWheel: { type: 'onWheel', mode: 'all', keys: [] },
      onPinch: { type: 'onPinch', mode: 'all', keys: [] },
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

  return defaultizedConfig;
};
