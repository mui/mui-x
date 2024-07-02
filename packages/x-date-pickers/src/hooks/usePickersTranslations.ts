import { PickerValidDate } from '../models';
import { useLocalizationContext } from '../internals/hooks/useUtils';

export const usePickersTranslations = <TDate extends PickerValidDate>() =>
  useLocalizationContext<TDate>().localeText;
