import { beforeAll, afterAll } from 'vitest';

globalThis.before = beforeAll;
globalThis.after = afterAll;
