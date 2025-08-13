import type { GridLocaleText } from '../models/api/gridLocaleTextApi';

export interface Localization {
  components: {
    MuiDataGrid: {
      defaultProps: {
        localeText: Partial<GridLocaleText>;
      };
    };
  };
}

export const getGridLocalization = (gridTranslations: Partial<GridLocaleText>): Localization => ({
  components: {
    MuiDataGrid: {
      defaultProps: {
        localeText: gridTranslations,
      },
    },
  },
});

export const formatNumber = (value: number | string, locale?: string): string => {
  const numValue = typeof value === 'string' ? Number(value) : value;

  if (!Number.isFinite(numValue)) {
    return String(value);
  }

  if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
    try {
      return new Intl.NumberFormat(locale).format(numValue);
    } catch {
      return String(numValue);
    }
  }

  return String(numValue);
};

// Helper to create formatNumber with a specific locale
export const buildLocaleFormat = (locale: string) => {
  return (value: number | string) => formatNumber(value, locale);
};
