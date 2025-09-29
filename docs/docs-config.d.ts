declare module 'docs/config' {
  export const LANGUAGES: string[];
  export const LANGUAGES_SSR: string[];
  export const LANGUAGES_IN_PROGRESS: string[];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export function LANGUAGES_IGNORE_PAGES(params: string): boolean;
}
