import { beforeAll, afterAll } from 'vitest';
import chai from 'chai';
import chaiDom from 'chai-dom';
import chaiPlugin from '@mui/internal-test-utils/chaiPlugin';

chai.use(chaiDom);
chai.use(chaiPlugin);

// @ts-ignore
globalThis.before = beforeAll;
// @ts-ignore
globalThis.after = afterAll;
