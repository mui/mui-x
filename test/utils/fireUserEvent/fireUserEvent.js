import { fireEvent } from '@mui/internal-test-utils/createRenderer';
/**
 * @deprecated Use `pointer` from `@testing-library/user-event` instead.
 */
export function touch(target) {
    fireEvent.touchStart(target);
    fireEvent.touchEnd(target);
}
/**
 * @param {...any} args The arguments to pass to `fireEvent.mouseDown`, `fireEvent.mouseUp`, and `fireEvent.click`.
 * @deprecated Use `click` from `@testing-library/user-event` instead.
 */
export const mousePress = (target, options) => {
    fireEvent.mouseDown(target, options);
    fireEvent.mouseUp(target, options);
    fireEvent.click(target, options);
};
/**
 * @deprecated Use `keyboard` or `type` from `@testing-library/user-event` instead.
 */
export function keyPress(target, options) {
    fireEvent.keyDown(target, options);
    fireEvent.keyUp(target, options);
}
