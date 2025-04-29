import { fireEvent } from '@mui/internal-test-utils/createRenderer';

/**
 * @deprecated Use `pointer` from `@testing-library/user-event` instead.
 */
export function touch(target: Element): void {
  fireEvent.touchStart(target);
  fireEvent.touchEnd(target);
}

/**
 * @param {...any} args The arguments to pass to `fireEvent.mouseDown`, `fireEvent.mouseUp`, and `fireEvent.click`.
 * @deprecated Use `click` from `@testing-library/user-event` instead.
 */
export const mousePress: (...args: Parameters<(typeof fireEvent)['mouseUp']>) => void = (
  target,
  options,
) => {
  fireEvent.mouseDown(target, options);
  fireEvent.mouseUp(target, options);
  fireEvent.click(target, options);
};

/**
 * @deprecated Use `keyboard` or `type` from `@testing-library/user-event` instead.
 */
export function keyPress(target: Element, options: { key: string; [key: string]: any }): void {
  fireEvent.keyDown(target, options);
  fireEvent.keyUp(target, options);
}
