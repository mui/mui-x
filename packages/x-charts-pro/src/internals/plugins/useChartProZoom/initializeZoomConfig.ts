'use client';

import type { ZoomConfig, DefaultizedZoomConfig, AnyInteraction } from './ZoomConfig.types';

export const initializeZoomConfig = (zoomConfig?: ZoomConfig): DefaultizedZoomConfig => {
  const defaultizedConfig: DefaultizedZoomConfig = { zoom: {}, pan: {} };

  if (!zoomConfig?.zoom) {
    defaultizedConfig.zoom = {
      onWheel: { type: 'onWheel', requiredKeys: [], mouse: {}, touch: {} },
      onPinch: { type: 'onPinch', requiredKeys: [], mouse: {}, touch: {} },
    };
  } else {
    defaultizedConfig.zoom = initializeFor<'zoom'>(zoomConfig.zoom);
  }

  if (!zoomConfig?.pan) {
    defaultizedConfig.pan = {
      onDrag: { type: 'onDrag', requiredKeys: [], mouse: {}, touch: {} },
    };
  } else {
    defaultizedConfig.pan = initializeFor<'pan'>(zoomConfig.pan);
  }

  return defaultizedConfig;
};

function initializeFor<T extends 'zoom' | 'pan'>(
  zoomConfig: Exclude<ZoomConfig[T], undefined>,
): DefaultizedZoomConfig[T] {
  // We aggregate interactions by type
  const aggregation = zoomConfig.reduce(
    (acc, interaction) => {
      if (typeof interaction === 'string') {
        if (!acc[interaction]) {
          acc[interaction] = [];
        }
        acc[interaction].push({ type: interaction, requiredKeys: [] });
        return acc;
      }

      const type = interaction.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push({
        type,
        pointerMode: interaction.pointerMode,
        requiredKeys: interaction.requiredKeys,
      });
      return acc;
    },
    {} as Record<string, AnyInteraction[]>,
  );

  // We then need to generate a usable config by type
  // When a gesture type is provided without options, it means we enable it for all pointer modes
  // Any interaction with a specific pointer mode should be restricted to that mode
  const acc: DefaultizedZoomConfig['zoom'] | DefaultizedZoomConfig['pan'] = {};
  for (const [type, config] of Object.entries(aggregation)) {
    const lastEmpty = config.findLast((item) => !item.pointerMode);
    const lastMouse = config.findLast((item) => item.pointerMode === 'mouse');
    const lastTouch = config.findLast((item) => item.pointerMode === 'touch');

    acc[type] = {
      type,
      pointerMode: lastEmpty ? [] : Array.from(new Set(config.map((c) => c.pointerMode))),
      requiredKeys: lastEmpty?.requiredKeys ?? [],
      mouse: lastMouse
        ? {
            requiredKeys: lastMouse?.requiredKeys,
          }
        : {},
      touch: lastTouch
        ? {
            requiredKeys: lastTouch?.requiredKeys,
          }
        : {},
    };
  }
  return acc;
}
