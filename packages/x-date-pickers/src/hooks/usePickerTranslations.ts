'use client';
import { useLocalizationContext } from './usePickerAdapter';

export const usePickerTranslations = () => useLocalizationContext().localeText;
