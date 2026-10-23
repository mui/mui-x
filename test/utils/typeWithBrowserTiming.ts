// Types one character with the event timing of a real browser.
// `user.keyboard` and `fireEvent` wrap each event in `act()`, which renders all pending updates between the events.
// A real browser only runs the microtasks between `keydown` and the text insertion.
// Use this helper to find bugs that depend on when React renders an update.

declare global {
  // eslint-disable-next-line vars-on-top
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

const MICROTASK_ROUNDS = 10;

async function flushMicrotasks() {
  for (let i = 0; i < MICROTASK_ROUNDS; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await Promise.resolve();
  }
}

function insertText(element: Element | null, text: string) {
  if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {
    return;
  }
  const prototype = Object.getPrototypeOf(element);
  const setValue = Object.getOwnPropertyDescriptor(prototype, 'value')!.set!;
  setValue.call(element, `${element.value}${text}`);
  element.dispatchEvent(
    new InputEvent('input', { bubbles: true, data: text, inputType: 'insertText' }),
  );
}

/**
 * Sends `keydown`, the text insertion, and `keyup` without `act()`.
 * The browser inserts the text into the element that has the focus after the `keydown` listeners.
 * Requires a real browser. jsdom does not support this timing.
 */
export async function typeWithBrowserTiming(target: Element, key: string) {
  const previousActEnvironment = globalThis.IS_REACT_ACT_ENVIRONMENT;
  globalThis.IS_REACT_ACT_ENVIRONMENT = false;
  try {
    const keyDown = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
    target.dispatchEvent(keyDown);
    await flushMicrotasks();
    if (!keyDown.defaultPrevented) {
      insertText(document.activeElement, key);
    }
    await flushMicrotasks();
    (document.activeElement ?? target).dispatchEvent(
      new KeyboardEvent('keyup', { key, bubbles: true }),
    );
    // Let React render the remaining updates.
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  } finally {
    globalThis.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
  }
}
