'use client';
import * as React from 'react';
import { useRtl } from '@mui/system/RtlProvider';
import { useUtils } from '../internals/hooks/useUtils';
import { buildSectionsFromFormat } from '../internals/hooks/useField/buildSectionsFromFormat';
import { getLocalizedDigits } from '../internals/hooks/useField/useField.utils';
import { PickersTimezone, PickerValidDate } from '../models';
import { usePickersTranslations } from './usePickersTranslations';

interface UseFieldPlaceholderParams {
  format: string;
  formatDensity?: 'dense' | 'spacious';
  timezone: PickersTimezone;
  shouldRespectLeadingZeros?: boolean;
}

export const useFieldPlaceholder = <TDate extends PickerValidDate>({
  format,
  formatDensity = 'dense',
  timezone,
  shouldRespectLeadingZeros = false,
}: UseFieldPlaceholderParams) => {
  const utils = useUtils<TDate>();
  const isRtl = useRtl();
  const translations = usePickersTranslations<TDate>();
  const localizedDigits = React.useMemo(() => getLocalizedDigits(utils), [utils]);

  return React.useMemo(() => {
    const sections = buildSectionsFromFormat({
      utils,
      format,
      formatDensity,
      isRtl,
      timezone,
      shouldRespectLeadingZeros,
      localeText: translations,
      localizedDigits,
      date: null,
      // TODO v9: Make sure we still don't reverse in `buildSectionsFromFormat` when using `useFieldPlaceholder`.
      enableAccessibleFieldDOMStructure: false,
    });

    return sections
      .map((section) => `${section.startSeparator}${section.placeholder}${section.endSeparator}`)
      .join('');
  }, [
    utils,
    isRtl,
    translations,
    localizedDigits,
    format,
    formatDensity,
    timezone,
    shouldRespectLeadingZeros,
  ]);
};
