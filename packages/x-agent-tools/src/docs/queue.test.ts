import { describe, expect, it } from 'vitest';
import { createDocsQueue, DEFAULT_DOCS_CONCURRENCY } from './queue';

describe('createDocsQueue', () => {
  it('builds a bounded queue at the default concurrency', () => {
    expect(createDocsQueue().concurrency).toBe(DEFAULT_DOCS_CONCURRENCY);
  });

  it('honours a custom concurrency', () => {
    expect(createDocsQueue(3).concurrency).toBe(3);
  });
});
