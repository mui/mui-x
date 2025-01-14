import { PickersLocaleText } from './pickersLocaleTextApi';

export const getPickersLocalization = (pickersTranslations: Partial<PickersLocaleText>) => {
  return {
    components: {
      MuiLocalizationProvider: {
        defaultProps: {
          localeText: { ...pickersTranslations },
        },
      },
    },
  };
};
