import { fireEvent } from '@mui/internal-test-utils/createRenderer';

function touch(target: Element): void {
  fireEvent.touchStart(target);
  fireEvent.touchEnd(target);
}

const mousePress: (...args: Parameters<(typeof fireEvent)['mouseUp']>) => void = (
  target,
  options,
) => {
  fireEvent.mouseDown(target, options);
  fireEvent.mouseUp(target, options);
  fireEvent.click(target, options);
};

function keyPress(target: Element, options: { key: string; [key: string]: any }): void {
  fireEvent.keyDown(target, options);
  fireEvent.keyUp(target, options);
}

export const fireUserEvent = {
  touch,
  mousePress,
  keyPress,
};
