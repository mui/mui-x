/// <reference types="@vitest/browser/providers/playwright" />
import { xVitestConfig } from '../../vitest.shared.mts';

export default xVitestConfig('browser', { url: import.meta.url });
