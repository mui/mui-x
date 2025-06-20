'use client';
import { useLocalizationContext } from '../internals/hooks/useUtils';

export const usePickerAdapter = () => useLocalizationContext().adapter;
