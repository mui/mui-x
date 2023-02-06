import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { MuiDateSectionName } from '../../models/muiPickersAdapter';
import { useUtils } from '../useUtils';
import { FieldSectionsValueBoundaries, FieldSection } from './useField.types';
import {
  applyMeridiemChange,
  applyWeekDayChange,
  changeSectionValueFormat,
  cleanTrailingZeroInNumericSectionValue,
  doesSectionHaveTrailingZeros,
  getDateSectionConfigFromFormatToken,
  getDateSectionGetterAndSetter,
  getDaysInWeekStr,
} from './useField.utils';
import { UpdateSectionValueParams } from './useFieldState';

interface CharacterEditingQuery {
  value: string;
  sectionIndex: number;
  dateSectionName: MuiDateSectionName;
}

interface ApplyCharacterEditingParams {
  keyPressed: string;
  sectionIndex: number;
}

interface UseFieldEditingParams<TDate, TSection extends FieldSection> {
  sections: TSection[];
  updateSectionValue: (params: UpdateSectionValueParams<TDate, TSection>) => void;
}

/**
 * The letter editing and the numeric editing each define a `CharacterEditingApplier`.
 * This function decides what the new section value should be and if the focus should switch to the next section.
 *
 * If it returns `null`, then the section value is not updated and the focus does not move.
 */
type CharacterEditingApplier<TDate> = (
  params: ApplyCharacterEditingParams,
  sectionsValueBoundaries: FieldSectionsValueBoundaries<TDate>,
  activeDate: TDate | null,
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
export const useFieldCharacterEditing = <TDate, TSection extends FieldSection>({
  sections,
  updateSectionValue,
}: UseFieldEditingParams<TDate, TSection>) => {
  const utils = useUtils<TDate>();

  const [query, setQuery] = React.useState<CharacterEditingQuery | null>(null);

  React.useEffect(() => {
    if (query != null && sections[query.sectionIndex]?.dateSectionName !== query.dateSectionName) {
      setQuery(null);
    }
  }, [sections, query]);

  React.useEffect(() => {
    if (query != null) {
      const timeout = setTimeout(() => setQuery(null), QUERY_LIFE_DURATION_MS);

      return () => {
        window.clearTimeout(timeout);
      };
    }

    return () => {};
  }, [query]);

  const applyQuery = (
    { keyPressed, sectionIndex }: ApplyCharacterEditingParams,
    getFirstSectionValueMatchingWithQuery: QueryApplier<TSection>,
    isValidQueryValue?: (queryValue: string) => boolean,
  ): ReturnType<CharacterEditingApplier<TDate>> => {
    const cleanKeyPressed = keyPressed.toLowerCase();
    const activeSection = sections[sectionIndex];

    // The current query targets the section being editing
    // We can try to concatenated value
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
          dateSectionName: activeSection.dateSectionName,
        });
        return queryResponse;
      }
    }

    const queryResponse = getFirstSectionValueMatchingWithQuery(cleanKeyPressed, activeSection);
    if (isQueryResponseWithoutValue(queryResponse) && !queryResponse.saveQuery) {
      setQuery(null);
      return null;
    }

    setQuery({
      sectionIndex,
      value: cleanKeyPressed,
      dateSectionName: activeSection.dateSectionName,
    });

    if (isQueryResponseWithoutValue(queryResponse)) {
      return null;
    }

    return queryResponse;
  };

  const applyLetterEditing: CharacterEditingApplier<TDate> = (params) => {
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
      getOptions: (format: string) => string[],
      fallbackFormat?: string,
      formatFallbackValue?: (fallbackValue: string, fallbackOptions: string[]) => string,
    ) => {
      if (activeSection.contentType === 'letter') {
        return findMatchingOptions(
          activeSection.formatValue,
          getOptions(activeSection.formatValue),
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
      switch (activeSection.dateSectionName) {
        case 'month': {
          const getOptions = (format: string) =>
            utils.getMonthArray(utils.date()!).map((month) => utils.formatByString(month, format!));

          const formatFallbackValue = (fallbackValue: string) =>
            changeSectionValueFormat(
              utils,
              fallbackValue,
              utils.formats.month,
              activeSection.formatValue,
            );

          return testQueryOnFormatAndFallbackFormat(
            queryValue,
            activeSection,
            getOptions,
            utils.formats.month,
            formatFallbackValue,
          );
        }

        case 'weekDay': {
          const getOptions = (format: string) => getDaysInWeekStr(utils, format);

          const formatFallbackValue = (fallbackValue: string, fallbackOptions: string[]) =>
            fallbackOptions.indexOf(fallbackValue).toString();

          return testQueryOnFormatAndFallbackFormat(
            queryValue,
            activeSection,
            getOptions,
            utils.formats.weekday,
            formatFallbackValue,
          );
        }

        case 'meridiem': {
          const getOptions = (format: string) => {
            const now = utils.date()!;
            return [utils.endOfDay(now), utils.startOfDay(now)].map((date) =>
              utils.formatByString(date, format),
            );
          };

          return testQueryOnFormatAndFallbackFormat(queryValue, activeSection, getOptions);
        }

        default: {
          return { saveQuery: false };
        }
      }
    };

    return applyQuery(params, getFirstSectionValueMatchingWithQuery);
  };

  const applyNumericEditing: CharacterEditingApplier<TDate> = (
    params,
    sectionsValueBoundaries,
    activeDate,
  ) => {
    const getNewSectionValue = (
      queryValue: string,
      dateSectionName: MuiDateSectionName,
      format: string,
      hasTrailingZeroes: boolean,
      contentType: 'digit' | 'letter',
    ): ReturnType<QueryApplier<TSection>> => {
      const queryValueNumber = Number(`${queryValue}`);
      const sectionBoundaries = sectionsValueBoundaries[dateSectionName]({
        currentDate: activeDate,
        format,
        contentType,
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
        Number(`${queryValue}0`) > sectionBoundaries.maximum ||
        queryValue.length === sectionBoundaries.maximum.toString().length;

      // queryValue without trailing `0` (`01` => `1`)
      let newSectionValue = queryValueNumber.toString();
      if (hasTrailingZeroes) {
        newSectionValue = cleanTrailingZeroInNumericSectionValue(utils, format, newSectionValue);
      }

      return { sectionValue: newSectionValue, shouldGoToNextSection };
    };

    const getFirstSectionValueMatchingWithQuery: QueryApplier<TSection> = (
      queryValue,
      activeSection,
    ) => {
      if (activeSection.contentType === 'digit') {
        return getNewSectionValue(
          queryValue,
          activeSection.dateSectionName,
          activeSection.formatValue,
          activeSection.hasTrailingZeroes,
          activeSection.contentType,
        );
      }

      // When editing a letter-format month and the user presses a digit,
      // We can support the numeric editing by using the digit-format month and re-formatting the result.
      if (activeSection.dateSectionName === 'month') {
        const response = getNewSectionValue(
          queryValue,
          activeSection.dateSectionName,
          'MM',
          doesSectionHaveTrailingZeros(utils, 'digit', 'month', 'MM'),
          'digit',
        );

        if (isQueryResponseWithoutValue(response)) {
          return response;
        }

        const formattedValue = changeSectionValueFormat(
          utils,
          response.sectionValue,
          'MM',
          activeSection.formatValue,
        );
        return {
          ...response,
          sectionValue: formattedValue,
        };
      }

      // When editing a letter-format weekDay and the user presses a digit,
      // We can support the numeric editing by returning the nth day in the week day array.
      if (activeSection.dateSectionName === 'weekDay') {
        const response = getNewSectionValue(
          queryValue,
          activeSection.dateSectionName,
          activeSection.formatValue,
          activeSection.hasTrailingZeroes,
          activeSection.contentType,
        );
        if (isQueryResponseWithoutValue(response)) {
          return response;
        }

        const formattedValue = getDaysInWeekStr(utils, activeSection.formatValue)[
          Number(response.sectionValue) - 1
        ];
        return {
          ...response,
          sectionValue: formattedValue,
        };
      }

      return { saveQuery: false };
    };

    return applyQuery(
      params,
      getFirstSectionValueMatchingWithQuery,
      (queryValue) => !Number.isNaN(Number(queryValue)),
    );
  };

  return useEventCallback((params: ApplyCharacterEditingParams) => {
    const activeSection = sections[params.sectionIndex];
    const isNumericEditing = !Number.isNaN(Number(params.keyPressed));

    const getNewSectionValue = isNumericEditing ? applyNumericEditing : applyLetterEditing;

    updateSectionValue({
      activeSection,
      setSectionValueOnDate: (activeDate, sectionsValueBoundaries) => {
        const response = getNewSectionValue(params, sectionsValueBoundaries, activeDate);
        if (response == null) {
          return null;
        }

        if (activeSection.dateSectionName === 'meridiem') {
          const newDate = applyMeridiemChange(utils, activeDate, response.sectionValue);

          return {
            date: newDate,
            shouldGoToNextSection: true,
          };
        }

        if (activeSection.dateSectionName === 'weekDay') {
          const newDate = applyWeekDayChange(
            utils,
            activeDate,
            activeSection.formatValue,
            response.sectionValue,
          );

          return {
            date: newDate,
            shouldGoToNextSection: response.shouldGoToNextSection,
          };
        }

        const { getter, setter } = getDateSectionGetterAndSetter(
          utils,
          activeSection.dateSectionName,
        );

        let newSectionValue: number;
        // We can't parse the day on the current date, otherwise we might try to parse `31` on a 30-days month.
        // So we take for granted that for days, the digit rendered is always 1-indexed, just like the digit stored in the date.
        if (activeSection.contentType === 'digit' && activeSection.dateSectionName === 'day') {
          newSectionValue = Number(response.sectionValue);
        } else {
          // The month is stored as 0-indexed in the date (0 = January, 1 = February, ...).
          // But it is often rendered as 1-indexed in the input (1 = January, 2 = February, ...).
          // This parsing makes sure that we store the digit according to the date index and not the input index.
          const sectionDate = utils.parse(response.sectionValue, activeSection.formatValue)!;
          newSectionValue = getter(sectionDate);
        }

        const newDate = setter(activeDate, newSectionValue);

        return {
          date: newDate,
          shouldGoToNextSection: response.shouldGoToNextSection,
        };
      },
      setSectionValueOnSections: (sectionsValueBoundaries) =>
        getNewSectionValue(params, sectionsValueBoundaries, null),
    });
  });
};
