// Polyfills `Symbol.dispose`, `Symbol.asyncDispose`, `DisposableStack`, and
// `AsyncDisposableStack` for environments that don't yet ship the TC39 explicit
// resource management proposal. Imported as a side effect from any file that
// uses these APIs.
import 'core-js/proposals/explicit-resource-management';
