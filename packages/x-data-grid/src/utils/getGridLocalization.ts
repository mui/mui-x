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
