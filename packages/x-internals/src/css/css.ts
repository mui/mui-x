import type { CSSObject } from '@mui/system';

export function css<T extends Record<string, CSSObject>>(
  _prefix: string,
  _styles: T,
): {
  [K in keyof T]: string;
} {
  throw new Error(`The \`css()\` utility should never be called.`);
}
