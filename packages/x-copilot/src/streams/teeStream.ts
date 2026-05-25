/**
 * Tee a readable stream into two independent branches. Both branches drain
 * lazily; consumers must handle backpressure on each branch.
 *
 * The copilot adapter uses this to split the model's response stream into:
 *   - the executor branch (drives the dispatch loop)
 *   - the chat branch (rendered by ChatRoot, with approval-aware orchestration)
 */
export function teeStream<T>(source: ReadableStream<T>): [ReadableStream<T>, ReadableStream<T>] {
  const [a, b] = source.tee();
  return [a, b];
}
