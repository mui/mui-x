type Options = {
  target: Element;
  delay?: number;
  validate?: (mutationList: MutationRecord[], observer: MutationObserver) => boolean;
};

const OBSERVER_CONFIG = {
  subtree: true,
  childList: true,
  attributes: true,
};

const DEFAULT_DELAY = 2000;

export function waitForDOM(options: Options) {
  return new Promise((resolve, reject) => {
    const observer = new MutationObserver((mutationList, observer) => {
      if (!options.validate?.(mutationList, observer)) {
        return;
      }
      cleanup();
      resolve(undefined);
    });

    let timeoutId: ReturnType<typeof setTimeout>;

    const cleanup = () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };

    timeoutId = setTimeout(() => {
      reject(new Error('Timeout'));
    }, options.delay ?? DEFAULT_DELAY);

    observer.observe(options.target, OBSERVER_CONFIG);
  });
}
