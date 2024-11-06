'use client';
import { useLocalizationContext } from '../internals/hooks/useUtils';

export const usePickerTranslations = () => useLocalizationContext().localeText;
