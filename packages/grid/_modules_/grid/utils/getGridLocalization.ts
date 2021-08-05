import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { GridOptions } from '../models/gridOptions';
import { getMuiVersion } from './utils';

interface LocalizationV4 {
  props: {
    MuiDataGrid: Pick<GridOptions, 'localeText'>;
  };
}

interface LocalizationV5 {
  components: {
    MuiDataGrid: {
      defaultProps: Pick<GridOptions, 'localeText'>;
    };
  };
}

export type Localization = LocalizationV4 | LocalizationV5;

export const getGridLocalization = (
  gridTranslations: Partial<GridLocaleText>,
  coreTranslations?,
): Localization => {
  if (getMuiVersion() === 'v5') {
    return {
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
    };
  }

  return {
    props: {
      MuiDataGrid: {
        localeText: {
          ...gridTranslations,
          MuiTablePagination: coreTranslations?.props?.MuiTablePagination || {},
        },
      },
    },
  };
};
