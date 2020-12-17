import { LocaleText } from '../gridOptions';

export type LocaleTextValue = string | React.ReactNode | Function;

export type TranslationKeys = keyof LocaleText;

/**
 * The grid localeText API [[apiRef]].
 */
export interface LocaleTextApi {
  /**
   * Get grid text.
   * @param key
   * @returns LocaleTextValue
   */
  getLocaleText: <T extends TranslationKeys>(key: T) => LocaleText[T];
}
