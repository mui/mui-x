import { Localization as CoreLocalization } from '@mui/material/locale';
import type {
  GridLocaleText,
  MuiTablePaginationLocalizedProps,
} from '../models/api/gridLocaleTextApi';

export interface Localization {
  components: {
    MuiDataGrid: {
      defaultProps: {
        localeText: Partial<GridLocaleText>;
      };
    };
  };
}

export const getGridLocalization = (
  gridTranslations: Partial<GridLocaleText>,
  coreTranslations?: CoreLocalization,
): Localization => ({
  components: {
    MuiDataGrid: {
      defaultProps: {
        localeText: {
          ...gridTranslations,
          MuiTablePagination:
            (coreTranslations?.components?.MuiTablePagination
              ?.defaultProps as MuiTablePaginationLocalizedProps) || {},
        },
      },
    },
  },
});
