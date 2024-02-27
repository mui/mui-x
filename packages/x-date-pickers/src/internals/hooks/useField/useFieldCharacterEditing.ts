import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { FieldSectionType, FieldSection, PickersTimezone, PickerValidDate } from '../../../models';
import { useUtils } from '../useUtils';
import { FieldSectionsValueBoundaries } from './useField.types';
import {
  changeSectionValueFormat,
  cleanDigitSectionValue,
  doesSectionFormatHaveLeadingZeros,
  getDateSectionConfigFromFormatToken,
  getDaysInWeekStr,
  getLetterEditingOptions,
  applyLocalizedDigits,
  removeLocalizedDigits,
  isStringNumber,
} from './useField.utils';
import { UpdateSectionValueParams } from './useFieldState';

interface CharacterEditingQuery {
  value: string;
  sectionIndex: number;
  sectionType: FieldSectionType;
}

export interface ApplyCharacterEditingParams {
  keyPressed: string;
  sectionIndex: number;
}

interface UseFieldCharacterEditingParams<
  TDate extends PickerValidDate,
  TSection extends FieldSection,
> {
  sections: TSection[];
  updateSectionValue: (params: UpdateSectionValueParams<TSection>) => void;
  sectionsValueBoundaries: FieldSectionsValueBoundaries<TDate>;
  localizedDigits: string[];
  setTempAndroidValueStr: (newValue: string | null) => void;
  timezone: PickersTimezone;
}

export interface UseFieldCharacterEditingResponse {
  applyCharacterEditing: (params: ApplyCharacterEditingParams) => void;
  resetCharacterQuery: () => void;
}

/**
 * The letter editing and the numeric editing each define a `CharacterEditingApplier`.
 * This function decides what the new section value should be and if the focus should switch to the next section.
 *
 * If it returns `null`, then the section value is not updated and the focus does not move.
 */
type CharacterEditingApplier = (
  params: ApplyCharacterEditingParams,
) => { sectionValue: string; shouldGoToNextSection: boolean } | null;

/**
 * Function called by `applyQuery` which decides:
 * - what is the new section value ?
 * - should the query used to get this value be stored for the next key press ?
 *
 * If it returns `{ sectionValue: string; shouldGoToNextSection: boolean }`,
 * Then we store the query and update the section with the new value.
 *
 * If it returns `{ saveQuery: true` },
 * Then we store the query and don't update the section.
 *
 * If it returns `{ saveQuery: false },
 * Then we do nothing.
 */
type QueryApplier<TSection extends FieldSection> = (
  queryValue: string,
  activeSection: TSection,
) => { sectionValue: string; shouldGoToNextSection: boolean } | { saveQuery: boolean };

const QUERY_LIFE_DURATION_MS = 5000;

const isQueryResponseWithoutValue = <TSection extends FieldSection>(
  response: ReturnType<QueryApplier<TSection>>,
): response is { saveQuery: boolean } => (response as { saveQuery: boolean }).saveQuery != null;

/**
 * Update the active section value when the user pressed a key that is not a navigation key (arrow key for example).
 * This hook has two main editing behaviors
 *
 * 1. The numeric editing when the user presses a digit
 * 2. The letter editing when the user presses another key
 */
export const useFieldCharacterEditing = <
  TDate extends PickerValidDate,
  TSection extends FieldSection,
>({
  sections,
  updateSectionValue,
  sectionsValueBoundaries,
  localizedDigits,
  setTempAndroidValueStr,
  timezone,
}: UseFieldCharacterEditingParams<TDate, TSection>): UseFieldCharacterEditingResponse => {
  const utils = useUtils<TDate>();

  const [query, setQuery] = React.useState<CharacterEditingQuery | null>(null);

  const resetQuery = useEventCallback(() => setQuery(null));

  React.useEffect(() => {
    if (query != null && sections[query.sectionIndex]?.type !== query.sectionType) {
      resetQuery();
    }
  }, [sections, query, resetQuery]);

  React.useEffect(() => {
    if (query != null) {
      const timeout = setTimeout(() => resetQuery(), QUERY_LIFE_DURATION_MS);

      return () => {
        clearTimeout(timeout);
      };
    }

    return () => {};
  }, [query, resetQuery]);

  const applyQuery = (
    { keyPressed, sectionIndex }: ApplyCharacterEditingParams,
    getFirstSectionValueMatchingWithQuery: QueryApplier<TSection>,
    isValidQueryValue?: (queryValue: string) => boolean,
  ): ReturnType<CharacterEditingApplier> => {
    const cleanKeyPressed = keyPressed.toLowerCase();
    const activeSection = sections[sectionIndex];

    // The current query targets the section being editing
    // We can try to concatenate the value
    if (
      query != null &&
      (!isValidQueryValue || isValidQueryValue(query.value)) &&
      query.sectionIndex === sectionIndex
    ) {
      const concatenatedQueryValue = `${query.value}${cleanKeyPressed}`;

      const queryResponse = getFirstSectionValueMatchingWithQuery(
        concatenatedQueryValue,
        activeSection,
      );
      if (!isQueryResponseWithoutValue(queryResponse)) {
        setQuery({
          sectionIndex,
          value: concatenatedQueryValue,
          sectionType: activeSection.type,
        });
        return queryResponse;
      }
    }

    const queryResponse = getFirstSectionValueMatchingWithQuery(cleanKeyPressed, activeSection);
    if (isQueryResponseWithoutValue(queryResponse) && !queryResponse.saveQuery) {
      resetQuery();
      return null;
    }

    setQuery({
      sectionIndex,
      value: cleanKeyPressed,
      sectionType: activeSection.type,
    });

    if (isQueryResponseWithoutValue(queryResponse)) {
      return null;
    }

    return queryResponse;
  };

  const applyLetterEditing: CharacterEditingApplier = (params) => {
    const findMatchingOptions = (
      format: string,
      options: string[],
      queryValue: string,
    ): ReturnType<QueryApplier<TSection>> => {
      const matchingValues = options.filter((option) =>
        option.toLowerCase().startsWith(queryValue),
      );

      if (matchingValues.length === 0) {
        return { saveQuery: false };
      }

      return {
        sectionValue: matchingValues[0],
        shouldGoToNextSection: matchingValues.length === 1,
      };
    };

    const testQueryOnFormatAndFallbackFormat = (
      queryValue: string,
      activeSection: TSection,
      fallbackFormat?: string,
      formatFallbackValue?: (fallbackValue: string, fallbackOptions: string[]) => string,
    ) => {
      const getOptions = (format: string) =>
        getLetterEditingOptions(utils, timezone, activeSection.type, format);

      if (activeSection.contentType === 'letter') {
        return findMatchingOptions(
          activeSection.format,
          getOptions(activeSection.format),
          queryValue,
        );
      }

      // When editing a digit-format month / weekDay and the user presses a letter,
      // We can support the letter editing by using the letter-format month / weekDay and re-formatting the result.
      // We just have to make sure that the default month / weekDay format is a letter format,
      if (
        fallbackFormat &&
        formatFallbackValue != null &&
        getDateSectionConfigFromFormatToken(utils, fallbackFormat).contentType === 'letter'
      ) {
        const fallbackOptions = getOptions(fallbackFormat);
        const response = findMatchingOptions(fallbackFormat, fallbackOptions, queryValue);
        if (isQueryResponseWithoutValue(response)) {
          return { saveQuery: false };
        }

        return {
          ...response,
          sectionValue: formatFallbackValue(response.sectionValue, fallbackOptions),
        };
      }

      return { saveQuery: false };
    };

    const getFirstSectionValueMatchingWithQuery: QueryApplier<TSection> = (
      queryValue,
      activeSection,
    ) => {
      switch (activeSection.type) {
        case 'month': {
          const formatFallbackValue = (fallbackValue: string) =>
            changeSectionValueFormat(
              utils,
              fallbackValue,
              utils.formats.month,
              activeSection.format,
            );

          return testQueryOnFormatAndFallbackFormat(
            queryValue,
            activeSection,
            utils.formats.month,
            formatFallbackValue,
          );
        }

        case 'weekDay': {
          const formatFallbackValue = (fallbackValue: string, fallbackOptions: string[]) =>
            fallbackOptions.indexOf(fallbackValue).toString();

          return testQueryOnFormatAndFallbackFormat(
            queryValue,
            activeSection,
            utils.formats.weekday,
            formatFallbackValue,
          );
        }

        case 'meridiem': {
          return testQueryOnFormatAndFallbackFormat(queryValue, activeSection);
        }

        default: {
          return { saveQuery: false };
        }
      }
    };

    return applyQuery(params, getFirstSectionValueMatchingWithQuery);
  };

  const applyNumericEditing: CharacterEditingApplier = (params) => {
    const getNewSectionValue = (
      queryValue: string,
      section: Pick<
        FieldSection,
        | 'format'
        | 'type'
        | 'contentType'
        | 'hasLeadingZerosInFormat'
        | 'hasLeadingZerosInInput'
        | 'maxLength'
      >,
    ): ReturnType<QueryApplier<TSection>> => {
      const cleanQueryValue = removeLocalizedDigits(queryValue, localizedDigits);
      const queryValueNumber = Number(cleanQueryValue);
      const sectionBoundaries = sectionsValueBoundaries[section.type]({
        currentDate: null,
        format: section.format,
        contentType: section.contentType,
      });

      if (queryValueNumber > sectionBoundaries.maximum) {
        return { saveQuery: false };
      }

      // If the user types `0` on a month section,
      // It is below the minimum, but we want to store the `0` in the query,
      // So that when he pressed `1`, it will store `01` and move to the next section.
      if (queryValueNumber < sectionBoundaries.minimum) {
        return { saveQuery: true };
      }

      const shouldGoToNextSection =
        queryValueNumber * 10 > sectionBoundaries.maximum ||
        cleanQueryValue.length === sectionBoundaries.maximum.toString().length;

      const newSectionValue = cleanDigitSectionValue(
        utils,
        queryValueNumber,
        sectionBoundaries,
        localizedDigits,
        section,
      );

      return { sectionValue: newSectionValue, shouldGoToNextSection };
    };

    const getFirstSectionValueMatchingWithQuery: QueryApplier<TSection> = (
      queryValue,
      activeSection,
    ) => {
      if (
        activeSection.contentType === 'digit' ||
        activeSection.contentType === 'digit-with-letter'
      ) {
        return getNewSectionValue(queryValue, activeSection);
      }

      // When editing a letter-format month and the user presses a digit,
      // We can support the numeric editing by using the digit-format month and re-formatting the result.
      if (activeSection.type === 'month') {
        const hasLeadingZerosInFormat = doesSectionFormatHaveLeadingZeros(
          utils,
          timezone,
          'digit',
          'month',
          'MM',
        );

        const response = getNewSectionValue(queryValue, {
          type: activeSection.type,
          format: 'MM',
          hasLeadingZerosInFormat,
          hasLeadingZerosInInput: true,
          contentType: 'digit',
          maxLength: 2,
        });

        if (isQueryResponseWithoutValue(response)) {
          return response;
        }

        const formattedValue = changeSectionValueFormat(
          utils,
          response.sectionValue,
          'MM',
          activeSection.format,
        );

        return {
          ...response,
          sectionValue: formattedValue,
        };
      }

      // When editing a letter-format weekDay and the user presses a digit,
      // We can support the numeric editing by returning the nth day in the week day array.
      if (activeSection.type === 'weekDay') {
        const response = getNewSectionValue(queryValue, activeSection);
        if (isQueryResponseWithoutValue(response)) {
          return response;
        }

        const formattedValue = getDaysInWeekStr(utils, timezone, activeSection.format)[
          Number(response.sectionValue) - 1
        ];
        return {
          ...response,
          sectionValue: formattedValue,
        };
      }

      return { saveQuery: false };
    };

    return applyQuery(params, getFirstSectionValueMatchingWithQuery, (queryValue) =>
      isStringNumber(queryValue, localizedDigits),
    );
  };

  const applyCharacterEditing = useEventCallback((params: ApplyCharacterEditingParams) => {
    const activeSection = sections[params.sectionIndex];
    const isNumericEditing = isStringNumber(params.keyPressed, localizedDigits);
    const response = isNumericEditing
      ? applyNumericEditing({
          ...params,
          keyPressed: applyLocalizedDigits(params.keyPressed, localizedDigits),
        })
      : applyLetterEditing(params);
    if (response == null) {
      setTempAndroidValueStr(null);
      return;
    }

    updateSectionValue({
      activeSection,
      newSectionValue: response.sectionValue,
      shouldGoToNextSection: response.shouldGoToNextSection,
    });
  });

  return {
    applyCharacterEditing,
    resetCharacterQuery: resetQuery,
  };
};
