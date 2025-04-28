import type { CSSObject } from '@mui/system';

export function css<T extends Record<string, CSSObject>>(
  _prefix: string,
  _styles: T,
): {
  [K in keyof T]: string;
} {
  throw new Error(`This function body should never be called. \`css()\` calls are transpiled by \`babel-plugin-mui-css\` both in runtime and build time.`);
}
