import { AdapterFormats, MuiPickersAdapter, PickerValidDate } from '../../models';
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

export const buildGetOpenDialogAriaText = <TDate extends PickerValidDate>(params: {
  utils: MuiPickersAdapter<TDate>;
  formatKey: keyof AdapterFormats;
  contextTranslation: (
    date: TDate | null,
    utils: MuiPickersAdapter<TDate>,
    formattedValue: string | null,
  ) => string;
  propsTranslation:
    | ((
        date: TDate | null,
        utils: MuiPickersAdapter<TDate>,
        formattedValue: string | null,
      ) => string)
    | undefined;
}) => {
  const { utils, formatKey, contextTranslation, propsTranslation } = params;

  return (value: TDate | null) => {
    const formattedValue =
      value !== null && utils.isValid(value) ? utils.format(value, formatKey) : null;
    const translation = propsTranslation ?? contextTranslation;
    return translation(value, utils, formattedValue);
  };
};
