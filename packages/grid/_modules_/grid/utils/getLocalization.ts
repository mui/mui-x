import { LocaleText } from '../models/api/localeTextApi';
import { GridOptions } from '../models/gridOptions';
import { isMuiV5 } from './utils';

export interface LocalizationV4 {
  props: {
    MuiDataGrid: Pick<GridOptions, 'localeText'>;
  };
}

export interface LocalizationV5 {
  components: {
    MuiDataGrid: {
      defaultProps: Pick<GridOptions, 'localeText'>;
    };
  };
}

export type Localization = LocalizationV4 | LocalizationV5;

export const getLocalization = (translations: Partial<LocaleText>): Localization => {
  if (isMuiV5()) {
    return {
      components: {
        MuiDataGrid: {
          defaultProps: {
            localeText: translations,
          },
        },
      },
    };
  }

  return {
    props: {
      MuiDataGrid: {
        localeText: translations,
      },
    },
  };
};
