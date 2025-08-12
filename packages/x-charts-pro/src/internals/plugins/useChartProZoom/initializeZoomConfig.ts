'use client';

import type {
  ZoomConfig,
  DefaultizedZoomConfig,
  ZoomInteraction,
  PanInteraction,
} from './ZoomConfig.types';

export const initializeZoomConfig = (zoomConfig?: ZoomConfig): DefaultizedZoomConfig => {
  const defaultizedConfig: DefaultizedZoomConfig = { zoom: {}, pan: {} };

  if (!zoomConfig?.zoom) {
    defaultizedConfig.zoom = {
      onWheel: { type: 'onWheel', requiredKeys: [] },
      onPinch: { type: 'onPinch', requiredKeys: [] },
    };
  } else {
    zoomConfig.zoom.forEach((interaction) => {
      if (typeof interaction === 'string') {
        defaultizedConfig.zoom[interaction] = { type: interaction, requiredKeys: [] };
      } else {
        const type = interaction.type;
        defaultizedConfig.zoom[type] = {
          type,
          pointerMode: interaction.pointerMode,
          requiredKeys: interaction.requiredKeys ?? [],
        } as Required<ZoomInteraction>;
      }
    });
  }

  if (!zoomConfig?.pan) {
    defaultizedConfig.pan = {
      onDrag: { type: 'onDrag', requiredKeys: [] },
    };
  } else {
    zoomConfig.pan.forEach((interaction) => {
      if (typeof interaction === 'string') {
        defaultizedConfig.pan[interaction] = { type: interaction, requiredKeys: [] };
      } else {
        const type = interaction.type;
        defaultizedConfig.pan[type] = {
          type,
          pointerMode: interaction.pointerMode,
          requiredKeys: interaction.requiredKeys ?? [],
        } as Required<PanInteraction>;
      }
    });
  }

  return defaultizedConfig;
};
