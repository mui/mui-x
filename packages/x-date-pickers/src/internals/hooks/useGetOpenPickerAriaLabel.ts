import { usePickerTranslations } from '../../hooks';
import { AdapterFormats, PickerValidDate } from '../../models';
import { useUtils } from './useUtils';

export const useGetOpenDialogAriaText = (params: {
  formatKey: keyof AdapterFormats;
  translationKey: 'openDatePickerDialogue' | 'openTimePickerDialogue';
}) => {
  const utils = useUtils();
  const translations = usePickerTranslations();
  const { formatKey, translationKey } = params;

  return (value: PickerValidDate | null) => {
    const formattedValue =
      value !== null && utils.isValid(value) ? utils.format(value, formatKey) : null;
    return translations[translationKey](formattedValue);
  };
};
