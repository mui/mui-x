'use client';
import { useLocalizationContext } from '../internals/hooks/useUtils';

export const usePickersTranslations = () => useLocalizationContext().localeText;
