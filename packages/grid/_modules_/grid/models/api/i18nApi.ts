/**
 * The i18n API interface that is available in the grid [[apiRef]].
 */
export interface I18nApi {
  /**
   * Get grid text.
   * @param key
   * @returns string
   */
  getText: (key: string) => string;
}
