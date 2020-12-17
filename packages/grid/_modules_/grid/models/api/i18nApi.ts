import { LocaleText } from '../gridOptions';

export type LocaleTextValue = string | React.ReactNode | Function;

export type TranslationKeys = keyof LocaleText;

/**
 * The grid i18n API [[apiRef]].
 */
export interface I18nApi {
  /**
   * Get grid text.
   * @param key
   * @returns LocaleTextValue
   */
  getLocaleText: <T extends TranslationKeys>(key: T) => LocaleText[T];
}
