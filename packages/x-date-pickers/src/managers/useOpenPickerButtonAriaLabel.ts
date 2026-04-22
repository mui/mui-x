'use client';
import * as React from 'react';
import type { MuiPickersAdapter } from '../models';
import type { PickerValidValue } from '../internals/models';
import { usePickerAdapter, usePickerTranslations } from '../hooks';

type AriaLabelTranslationKey =
  | 'openDatePickerDialogue'
  | 'openTimePickerDialogue'
  | 'openRangePickerDialogue';

export function createUseOpenPickerButtonAriaLabel<TValue extends PickerValidValue>({
  formatValue,
  translationKey,
}: {
  formatValue: (adapter: MuiPickersAdapter, value: TValue) => string | null;
  translationKey: AriaLabelTranslationKey;
}) {
  return function useOpenPickerButtonAriaLabel(value: TValue) {
    const adapter = usePickerAdapter();
    const translations = usePickerTranslations();
    return React.useMemo(
      () => translations[translationKey](formatValue(adapter, value)),
      [value, translations, adapter],
    );
  };
}
