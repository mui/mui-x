import { fireEvent } from '@mui/internal-test-utils';

export function firePointerEvent(
  target: Element,
  type: 'pointerstart' | 'pointermove' | 'pointerend',
  options: Pick<PointerEventInit, 'clientX' | 'clientY'>,
): void {
  const originalGetBoundingClientRect = target.getBoundingClientRect;
  target.getBoundingClientRect = () => ({
    x: 0,
    y: 0,
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    toJSON() {
      return {
        x: 0,
        y: 0,
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
      };
    },
  });
  const event = new window.PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    composed: true,
    isPrimary: true,
    ...options,
  });

  fireEvent(target, event);
  target.getBoundingClientRect = originalGetBoundingClientRect;
}
