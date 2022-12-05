import { PickersLocaleText } from './pickersLocaleTextApi';

export const getPickersLocalization = (pickersTranslations: Partial<PickersLocaleText<any>>) => {
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
