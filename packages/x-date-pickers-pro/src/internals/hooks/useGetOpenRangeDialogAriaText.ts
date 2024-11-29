import { usePickerTranslations } from '@mui/x-date-pickers/hooks';
import { PickerRangeValue, useUtils } from '@mui/x-date-pickers/internals';
import { AdapterFormats } from '@mui/x-date-pickers/models';

export const useGetOpenRangeDialogAriaText = (params: {
  formatKey: keyof AdapterFormats;
  translationKey: 'openDateRangePickerDialogue' | 'openTimeRangePickerDialogue';
}) => {
  const utils = useUtils();
  const translations = usePickerTranslations();
  const { formatKey, translationKey } = params;

  return (value: PickerRangeValue) => {
    const formattedValue = [
      value[0] !== null && utils.isValid(value[0]) ? utils.format(value[0], formatKey) : null,
      value[1] !== null && utils.isValid(value[1]) ? utils.format(value[1], formatKey) : null,
    ] as const;
    return translations[translationKey](formattedValue);
  };
};
