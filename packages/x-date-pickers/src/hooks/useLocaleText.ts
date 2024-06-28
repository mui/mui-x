import { PickerValidDate } from '../models';
import { useLocalizationContext } from '../internals/hooks/useUtils';

export const useLocaleText = <TDate extends PickerValidDate>() =>
  useLocalizationContext<TDate>().localeText;
