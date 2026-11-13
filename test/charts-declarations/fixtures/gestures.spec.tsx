import { GestureManager, PanGesture, TapGesture } from '@mui/x-internal-gestures/core';

const manager = new GestureManager({
  gestures: [new PanGesture<'pan'>({ name: 'pan' }), new TapGesture<'tap'>({ name: 'tap' })],
});
const element = manager.registerElement(['pan', 'tap'], document.body);
element.addEventListener('panStart', (event) => {
  const delta: number = event.detail.deltaX;
  const active: boolean = event.detail.activeGestures.tap;
  return { delta, active };
});
element.addEventListener('tap', (event) => {
  // @ts-expect-error A tap event must not acquire pan-specific data.
  return event.detail.deltaX;
});
manager.setGestureOptions('pan', document.body, { threshold: 5 });
manager.setGestureState('pan', document.body, { totalDeltaX: 10 });
// @ts-expect-error Pan options retain their value types.
manager.setGestureOptions('pan', document.body, { threshold: 'invalid' });
// @ts-expect-error A tap has no mutable state.
manager.setGestureState('tap', document.body, {});
// @ts-expect-error A single-phase gesture has no typed start event.
element.addEventListener('tapStart', (event) => event.detail);
