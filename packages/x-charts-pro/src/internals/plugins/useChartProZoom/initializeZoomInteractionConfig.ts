'use client';

import type { AxisId, DefaultizedZoomOptions } from '@mui/x-charts/internals';
import type {
  ZoomInteractionConfig,
  DefaultizedZoomInteractionConfig,
  AnyInteraction,
  AnyEntry,
} from './ZoomInteractionConfig.types';

export const initializeZoomInteractionConfig = (
  zoomInteractionConfig?: ZoomInteractionConfig,
  optionsLookup?: Record<AxisId, DefaultizedZoomOptions>,
): DefaultizedZoomInteractionConfig => {
  const defaultizedConfig: DefaultizedZoomInteractionConfig = { zoom: {}, pan: {} };

  // Config for zoom
  if (!zoomInteractionConfig?.zoom) {
    defaultizedConfig.zoom = {
      wheel: { type: 'wheel', requiredKeys: [], mouse: {}, touch: {} },
      pinch: { type: 'pinch', requiredKeys: [], mouse: {}, touch: {} },
    };
  } else {
    defaultizedConfig.zoom = initializeFor('zoom', zoomInteractionConfig.zoom);
  }

  // Config for pan
  if (!zoomInteractionConfig?.pan) {
    defaultizedConfig.pan = {
      drag: { type: 'drag', requiredKeys: [], mouse: {}, touch: {} },
    };

    let hasXZoom = false;
    let hasYZoom = false;
    if (optionsLookup) {
      Object.values(optionsLookup).forEach((options) => {
        if (options.axisDirection === 'x') {
          hasXZoom = true;
        }
        if (options.axisDirection === 'y') {
          hasYZoom = true;
        }
      });
    }

    // Only add pan on wheel if the x-axis can pan (has zoom enabled) but the y-axis cannot
    // This provides a consistent horizontal panning experience that aligns with typical scrolling behavior
    // When both axes can pan, we avoid wheel interactions to prevent conflicts with vertical scrolling
    if (hasXZoom && !hasYZoom) {
      defaultizedConfig.pan.wheel = {
        type: 'wheel',
        requiredKeys: [],
        allowedDirection: 'x',
        mouse: {},
        touch: {},
      };
    }
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
        allowedDirection: (interaction as any).allowedDirection,
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
      acc[type].allowedDirection = lastEmpty?.allowedDirection ?? 'x';
    }
  }
  return acc;
}
