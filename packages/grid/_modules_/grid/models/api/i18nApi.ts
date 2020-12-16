import { DEFAULT_LOCALE_TEXT } from '../../constants/i18nConstants';

export type LocaleTextValue = string | React.ReactNode | Function;

export type Translations = typeof DEFAULT_LOCALE_TEXT;
export type TranslationKeys = keyof Translations;

/**
 * The i18n API interface that is available in the grid [[apiRef]].
 */
export interface I18nApi {
  /**
   * Get grid text.
   * @param key
   * @returns LocaleTextValue
   */
  getText: <T extends TranslationKeys>(key: T) => Translations[T];
}
