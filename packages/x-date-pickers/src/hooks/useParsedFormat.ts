'use client';
import * as React from 'react';
import { useRtl } from '@mui/system/RtlProvider';
import { useUtils } from '../internals/hooks/useUtils';
import { buildSectionsFromFormat } from '../internals/hooks/useField/buildSectionsFromFormat';
import { getLocalizedDigits } from '../internals/hooks/useField/useField.utils';
import { usePickerTranslations } from './usePickerTranslations';
import { useNullablePickerContext } from '../internals/hooks/useNullablePickerContext';

interface UseParsedFormatParameters {
  /**
   * Format to parse.
   * @default the format provided by the picker.
   */
  format?: string;
}

/**
 * Returns the parsed format to be rendered in the field when there is no value or in other parts of the Picker.
 * This format is localized (for example `AAAA` for the year with the French locale) and cannot be parsed by your date library.
 * @param {object} The parameters needed to build the placeholder.
 * @param {string} params.format Format to parse.
 * @returns
 */
export const useParsedFormat = (parameters: UseParsedFormatParameters = {}) => {
  const pickerContext = useNullablePickerContext();
  const utils = useUtils();
  const isRtl = useRtl();
  const translations = usePickerTranslations();
  const localizedDigits = React.useMemo(() => getLocalizedDigits(utils), [utils]);
  const { format = pickerContext?.fieldFormat ?? utils.formats.fullDate } = parameters;

  return React.useMemo(() => {
    const sections = buildSectionsFromFormat({
      utils,
      format,
      formatDensity: 'dense',
      isRtl,
      shouldRespectLeadingZeros: true,
      localeText: translations,
      localizedDigits,
      date: null,
      // TODO v9: Make sure we still don't reverse in `buildSectionsFromFormat` when using `useParsedFormat`.
      enableAccessibleFieldDOMStructure: false,
    });

    return sections
      .map((section) => `${section.startSeparator}${section.placeholder}${section.endSeparator}`)
      .join('');
  }, [utils, isRtl, translations, localizedDigits, format]);
};
