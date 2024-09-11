import { beforeAll, afterAll } from 'vitest';
import 'test/utils/addChaiAssertions';

// @ts-ignore
globalThis.before = beforeAll;
// @ts-ignore
globalThis.after = afterAll;
