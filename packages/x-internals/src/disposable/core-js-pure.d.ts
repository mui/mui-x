// `core-js-pure` ships no type declarations of its own. The classes its
// per-feature entry points expose are spec-compliant ponyfills of the global
// constructors, so we type them as the platform's own classes.
declare module 'core-js-pure/actual/disposable-stack/index.js' {
  const DisposableStack: typeof globalThis.DisposableStack;
  export default DisposableStack;
}

declare module 'core-js-pure/actual/async-disposable-stack/index.js' {
  const AsyncDisposableStack: typeof globalThis.AsyncDisposableStack;
  export default AsyncDisposableStack;
}
