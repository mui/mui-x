export interface TranslatePackageConfig {
  englishSource: string;
  englishVariableName: string;
  localesDir: string;
  excludeFiles: string[];
  getLocaleVariableName: (localeCode: string) => string;
}

export const PACKAGE_CONFIGS: Record<string, TranslatePackageConfig> = {
  'x-data-grid': {
    englishSource: 'packages/x-data-grid/src/constants/localeTextConstants.ts',
    englishVariableName: 'GRID_DEFAULT_LOCALE_TEXT',
    localesDir: 'packages/x-data-grid/src/locales',
    excludeFiles: ['index.ts', 'enUS.ts'],
    getLocaleVariableName: (localeCode) => `${localeCode}Grid`,
  },
  'x-date-pickers': {
    englishSource: 'packages/x-date-pickers/src/locales/enUS.ts',
    englishVariableName: 'enUSPickers',
    localesDir: 'packages/x-date-pickers/src/locales',
    excludeFiles: ['index.ts', 'enUS.ts'],
    getLocaleVariableName: (localeCode) => `${localeCode}Pickers`,
  },
  'x-charts': {
    englishSource: 'packages/x-charts/src/locales/enUS.ts',
    englishVariableName: 'enUSLocaleText',
    localesDir: 'packages/x-charts/src/locales',
    excludeFiles: ['index.ts', 'enUS.ts'],
    getLocaleVariableName: (localeCode) => `${localeCode}LocalText`,
  },
  'x-scheduler': {
    englishSource: 'packages/x-scheduler/src/translations/enUS.ts',
    englishVariableName: 'enUS',
    localesDir: 'packages/x-scheduler/src/translations',
    excludeFiles: ['index.ts', 'enUS.ts'],
    getLocaleVariableName: (localeCode) => localeCode,
  },
};
