// TODO v10: remove. Published `@mui/x-*` 9.0.0 to 9.14.0 import this entry point.
// https://github.com/mui/mui-x/issues/23905
import { platform } from '@base-ui/utils/platform';

export const isFirefox = platform.engine.gecko;
export const isJSDOM = platform.env.jsdom;
export const iOSMediaQuery = platform.mediaQuery.iOS;
