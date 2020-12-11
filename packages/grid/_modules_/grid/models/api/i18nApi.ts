export type LocaleTextValue = string | React.ReactNode | Function;

/**
 * The i18n API interface that is available in the grid [[apiRef]].
 */
export interface I18nApi {
  /**
   * Get grid text.
   * @param key
   * @returns LocaleTextValue
   */
  getText: (key: string) => LocaleTextValue;
}
