import { InteractionMode } from './ZoomConfig.types';

export const isGestureEnabledForPointer = (
  event: PointerEvent,
  mode?: InteractionMode,
): boolean => {
  if (!mode || mode === 'all') {
    return true;
  }

  if (mode === 'touch' && event.pointerType === 'touch') {
    return true;
  }

  if (mode === 'mouse' && event.pointerType === 'mouse') {
    return true;
  }

  return false;
};
