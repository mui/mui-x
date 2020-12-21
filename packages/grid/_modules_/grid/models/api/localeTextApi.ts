/**
 * Set the types of the texts in the grid.
 */
export interface LocaleText {
  // Density selector toolbar button text
  toolbarDensity: React.ReactNode;
  toolbarDensityLabel: string;
  toolbarDensityCompact: string;
  toolbarDensityStandard: string;
  toolbarDensityComfortable: string;
}

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
