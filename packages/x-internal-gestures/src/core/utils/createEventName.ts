import { GesturePhase } from '../Gesture';

/**
 * Creates the event name for a specific gesture and phase
 */
export function createEventName(gesture: string, phase: GesturePhase): string {
  return `${gesture}${phase === 'ongoing' ? '' : phase.charAt(0).toUpperCase() + phase.slice(1)}`;
}
