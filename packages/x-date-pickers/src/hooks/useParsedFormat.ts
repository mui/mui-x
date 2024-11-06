'use client';
import * as React from 'react';
import { useRtl } from '@mui/system/RtlProvider';
import { useUtils } from '../internals/hooks/useUtils';
import { buildSectionsFromFormat } from '../internals/hooks/useField/buildSectionsFromFormat';
import { getLocalizedDigits } from '../internals/hooks/useField/useField.utils';
import { usePickerTranslations } from './usePickerTranslations';
import type { UseFieldInternalProps } from '../internals/hooks/useField';

interface UseParsedFormatParameters
  extends Pick<
    UseFieldInternalProps<any, any, any, any>,
    'format' | 'formatDensity' | 'shouldRespectLeadingZeros'
  > {}

/**
 * Returns the parsed format to be rendered in the field when there is no value or in other parts of the Picker.
 * This format is localized (e.g: `AAAA` for the year with the French locale) and cannot be parsed by your date library.
 * @param {object} The parameters needed to build the placeholder.
 * @param {string} params.format Format of the date to use.
 * @param {'dense' | 'spacious'} params.formatDensity Density of the format (setting `formatDensity` to `"spacious"` will add a space before and after each `/`, `-` and `.` character).
 * @param {boolean} params.shouldRespectLeadingZeros If `true`, the format will respect the leading zeroes, if `false`, the format will always add leading zeroes.
 * @returns
 */
export const useParsedFormat = (parameters: UseParsedFormatParameters) => {
  const { format, formatDensity = 'dense', shouldRespectLeadingZeros = false } = parameters;
  const utils = useUtils();
  const isRtl = useRtl();
  const translations = usePickerTranslations();
  const localizedDigits = React.useMemo(() => getLocalizedDigits(utils), [utils]);

  return React.useMemo(() => {
    const sections = buildSectionsFromFormat({
      utils,
      format,
      formatDensity,
      isRtl,
      shouldRespectLeadingZeros,
      localeText: translations,
      localizedDigits,
      date: null,
      // TODO v9: Make sure we still don't reverse in `buildSectionsFromFormat` when using `useParsedFormat`.
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
    shouldRespectLeadingZeros,
  ]);
};
