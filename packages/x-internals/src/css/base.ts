import type { CSSObject } from '@mui/system';

export type CSSStyles = Record<string, CSSObject>;

export type CSSMeta<T extends CSSStyles> = {
  [K in keyof T]: string;
};
