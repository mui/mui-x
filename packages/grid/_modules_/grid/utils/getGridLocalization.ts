import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { GridMergedOptions } from '../models/gridOptions';

export interface Localization {
  components: {
    MuiDataGrid: {
      defaultProps: Pick<GridMergedOptions, 'localeText'>;
    };
  };
}

export const getGridLocalization = (
  gridTranslations: Partial<GridLocaleText>,
  coreTranslations?,
): Localization => ({
  components: {
    MuiDataGrid: {
      defaultProps: {
        localeText: {
          ...gridTranslations,
          MuiTablePagination: coreTranslations?.components?.MuiTablePagination.defaultProps || {},
        },
      },
    },
  },
});
