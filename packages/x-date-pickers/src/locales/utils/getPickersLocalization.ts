import { AdapterFormats, MuiPickersAdapter, PickerValidDate } from '../../models';
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

export const buildGetOpenDialogAriaText = (params: {
  utils: MuiPickersAdapter;
  formatKey: keyof AdapterFormats;
  contextTranslation: (formattedValue: string | null) => string;
  propsTranslation: ((formattedValue: string | null) => string) | undefined;
}) => {
  const { utils, formatKey, contextTranslation, propsTranslation } = params;

  return (value: PickerValidDate | null) => {
    const formattedValue =
      value !== null && utils.isValid(value) ? utils.format(value, formatKey) : null;
    const translation = propsTranslation ?? contextTranslation;
    return translation(formattedValue);
  };
};
