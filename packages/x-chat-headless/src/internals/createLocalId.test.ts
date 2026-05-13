import { afterEach, describe, expect, it, vi } from 'vitest';
import { createLocalId } from './createLocalId';

describe('createLocalId', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a valid UUID when crypto.randomUUID is available', () => {
    const id = createLocalId();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

    expect(id).toMatch(uuidRegex);
  });

  it('returns unique ids across 100 calls', () => {
    const ids = new Set(Array.from({ length: 100 }, () => createLocalId()));

    expect(ids.size).toBe(100);
  });

  it('returns local-{timestamp}-{counter} fallback when crypto.randomUUID is unavailable', () => {
    vi.stubGlobal('crypto', { randomUUID: undefined });

    const id = createLocalId();

    expect(id).toMatch(/^local-\d+-\d+$/);
  });

  it('increments counter in fallback mode', () => {
    vi.stubGlobal('crypto', { randomUUID: undefined });

    const id1 = createLocalId();
    const id2 = createLocalId();

    const counter1 = Number(id1.split('-').pop());
    const counter2 = Number(id2.split('-').pop());

    expect(counter2).toBeGreaterThan(counter1);
  });
});
