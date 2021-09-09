import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { GridMergedOptions } from '../models/gridOptions';

interface LocalizationV4 {
  props: {
    MuiDataGrid: Pick<GridMergedOptions, 'localeText'>;
  };
}

interface LocalizationV5 {
  components: {
    MuiDataGrid: {
      defaultProps: Pick<GridMergedOptions, 'localeText'>;
    };
  };
}

export type Localization = LocalizationV4 | LocalizationV5;

export const getGridLocalization = (
  gridTranslations: Partial<GridLocaleText>,
  coreTranslations?,
): Localization => ({
  components: {
    MuiDataGrid: {
      defaultProps: {
        localeText: {
          ...gridTranslations,
          MuiTablePagination:
              coreTranslations?.components?.MuiTablePagination.defaultProps || {},
        },
      },
    },
  },
});
