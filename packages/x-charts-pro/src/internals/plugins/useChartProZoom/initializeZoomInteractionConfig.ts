'use client';

import type {
  ZoomInteractionConfig,
  DefaultizedZoomInteractionConfig,
  AnyInteraction,
  AnyEntry,
} from './ZoomInteractionConfig.types';

export const initializeZoomInteractionConfig = (
  zoomInteractionConfig?: ZoomInteractionConfig,
): DefaultizedZoomInteractionConfig => {
  const defaultizedConfig: DefaultizedZoomInteractionConfig = { zoom: {}, pan: {} };

  if (!zoomInteractionConfig?.zoom) {
    defaultizedConfig.zoom = {
      wheel: { type: 'wheel', requiredKeys: [], mouse: {}, touch: {} },
      pinch: { type: 'pinch', requiredKeys: [], mouse: {}, touch: {} },
    };
  } else {
    defaultizedConfig.zoom = initializeFor('zoom', zoomInteractionConfig.zoom);
  }

  if (!zoomInteractionConfig?.pan) {
    defaultizedConfig.pan = {
      drag: { type: 'drag', requiredKeys: [], mouse: {}, touch: {} },
      wheel: { type: 'wheel', requiredKeys: [], mouse: {}, touch: {}, axesFilter: 'x' },
    };
  } else {
    defaultizedConfig.pan = initializeFor('pan', zoomInteractionConfig.pan);
  }

  return defaultizedConfig;
};

function initializeFor<T extends 'zoom' | 'pan'>(
  interactionType: T,
  zoomInteractionConfig: Exclude<ZoomInteractionConfig[T], undefined>,
): DefaultizedZoomInteractionConfig[T] {
  // We aggregate interactions by type
  const aggregation = zoomInteractionConfig.reduce(
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
        axesFilter: (interaction as any).axesFilter,
      });
      return acc;
    },
    {} as Record<string, AnyInteraction[]>,
  );

  // We then need to generate a usable config by type
  // When a gesture type is provided without options, it means we enable it for all pointer modes
  // Any interaction with a specific pointer mode should be restricted to that mode
  const acc: Record<string, AnyEntry> = {};
  for (const [type, config] of Object.entries(aggregation)) {
    const lastEmpty = config.findLast((item) => !item.pointerMode);
    const lastMouse = config.findLast((item) => item.pointerMode === 'mouse');
    const lastTouch = config.findLast((item) => item.pointerMode === 'touch');

    acc[type] = {
      type,
      pointerMode: lastEmpty
        ? []
        : Array.from(new Set(config.filter((c) => c.pointerMode).map((c) => c.pointerMode!))),
      requiredKeys: lastEmpty?.requiredKeys ?? [],
      mouse: lastMouse
        ? {
            requiredKeys: lastMouse?.requiredKeys ?? [],
          }
        : {},
      touch: lastTouch
        ? {
            requiredKeys: lastTouch?.requiredKeys ?? [],
          }
        : {},
    };

    if (type === 'wheel' && interactionType === 'pan') {
      acc[type].axesFilter = lastEmpty?.axesFilter ?? 'x';
    }
  }
  return acc;
}
