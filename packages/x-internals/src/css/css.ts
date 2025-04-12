import type { CSSObject } from '@mui/system';
import { CSSMeta } from './base';

export function css<T extends Record<string, CSSObject>>(_prefix: string, _styles: T): CSSMeta<T> {
  throw new Error(`The \`css()\` utility should never be called.`);
}
