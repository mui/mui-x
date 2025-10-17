import { xVitestConfig } from '../vitest.shared.mts';

export default xVitestConfig('jsdom', { url: import.meta.url });
