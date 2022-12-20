import * as React from 'react';
import { ponyfillGlobal } from '@mui/utils';
import useEventCallback from '@mui/utils/useEventCallback';
import { MuiDateSectionName } from '../../models/muiPickersAdapter';
import { useUtils } from '../useUtils';
import { FieldBoundaries, FieldSection } from './useField.types';
import {
  applyMeridiemChange,
  changeSectionValueFormat,
  cleanTrailingZeroInNumericSectionValue,
  doesSectionHaveTrailingZeros,
  getDateSectionConfigFromFormatToken,
  getSectionGetterAndSetter,
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

type CharacterEditingApplier<TDate, TSection extends FieldSection> = (
  params: ApplyCharacterEditingParams,
  boundaries: FieldBoundaries<TDate, TSection>,
  activeDate: TDate | null,
) => { sectionValue: string; shouldGoToNextSection: boolean } | null;

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
  ): ReturnType<CharacterEditingApplier<TDate, TSection>> => {
    const cleanKeyPressed = keyPressed.toLowerCase();
    const activeSection = sections[sectionIndex];

    // The current query targets the section being editing
    // We can try to concatenated value
    if (query != null && query.sectionIndex === sectionIndex) {
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
    } else {
      setQuery({
        sectionIndex,
        value: cleanKeyPressed,
        dateSectionName: activeSection.dateSectionName,
      });
    }

    if (isQueryResponseWithoutValue(queryResponse)) {
      return null;
    }
    return queryResponse;
  };

  const applyLetterEditing: CharacterEditingApplier<TDate, TSection> = (params) => {
    const getFirstSectionValueMatchingWithQuery: QueryApplier<TSection> = (
      queryValue,
      activeSection,
    ) => {
      switch (activeSection.dateSectionName) {
        case 'month': {
          const getMonthResponse = (format: string): ReturnType<QueryApplier<TSection>> => {
            const matchingMonths = utils
              .getMonthArray(utils.date()!)
              .map((month) => utils.formatByString(month, format!))
              .filter((month) => month.toLowerCase().startsWith(queryValue));

            if (matchingMonths.length === 0) {
              return { saveQuery: false };
            }

            return {
              sectionValue: matchingMonths[0],
              shouldGoToNextSection: matchingMonths.length === 1,
            };
          };

          if (activeSection.contentType === 'letter') {
            return getMonthResponse(activeSection.formatValue);
          }

          // When editing a digit-format month and the user presses a letter,
          // We can support the letter editing by using the letter-format month and re-formatting the result.
          // We just have to make sure that the default month format is a letter format,
          if (
            getDateSectionConfigFromFormatToken(utils, utils.formats.month).contentType === 'letter'
          ) {
            const monthResponse = getMonthResponse(utils.formats.month);
            if (isQueryResponseWithoutValue(monthResponse)) {
              return { saveQuery: false };
            }

            const formattedValue = changeSectionValueFormat(
              utils,
              monthResponse.sectionValue,
              utils.formats.month,
              activeSection.formatValue,
            );

            return {
              ...monthResponse,
              sectionValue: formattedValue,
            };
          }

          return { saveQuery: false };
        }

        case 'meridiem': {
          const now = utils.date()!;
          const sectionValue = [utils.endOfDay(now), utils.startOfDay(now)]
            .map((date) => utils.formatByString(date, activeSection.formatValue))
            .find((meridiem) => meridiem.toLowerCase().startsWith(queryValue));

          if (sectionValue == null) {
            return { saveQuery: false };
          }

          return { sectionValue, shouldGoToNextSection: true };
        }

        default: {
          return { saveQuery: false };
        }
      }
    };

    return applyQuery(params, getFirstSectionValueMatchingWithQuery);
  };

  const applyLegacyNumericEditing: CharacterEditingApplier<TDate, TSection> = (
    params,
    boundaries,
    activeDate,
  ) => {
    const { keyPressed, sectionIndex } = params;
    const activeSection = sections[sectionIndex];
    const sectionBoundaries = boundaries[activeSection.dateSectionName](activeDate, activeSection);

    const getNewSectionValue = (
      sectionValue: string,
      hasTrailingZeroes: boolean,
    ): ReturnType<CharacterEditingApplier<TDate, TSection>> => {
      // Remove the trailing `0` (`01` => `1`)
      let newSectionValue = Number(`${sectionValue}${keyPressed}`).toString();

      while (newSectionValue.length > 0 && Number(newSectionValue) > sectionBoundaries.maximum) {
        newSectionValue = newSectionValue.slice(1);
      }

      // In the unlikely scenario where max < 9, we could type a single digit that already exceeds the maximum.
      if (newSectionValue.length === 0) {
        newSectionValue = sectionBoundaries.minimum.toString();
      }

      const shouldGoToNextSection = Number(`${newSectionValue}0`) > sectionBoundaries.maximum;

      if (hasTrailingZeroes) {
        newSectionValue = cleanTrailingZeroInNumericSectionValue(
          newSectionValue,
          sectionBoundaries.maximum,
        );
      }

      return { sectionValue: newSectionValue, shouldGoToNextSection };
    };

    if (activeSection.contentType === 'digit') {
      return getNewSectionValue(activeSection.value, activeSection.hasTrailingZeroes);
    }

    // When editing a letter-format month and the user presses a digit,
    // We can support the numeric editing by using the digit-format month and re-formatting the result.
    if (activeSection.dateSectionName === 'month') {
      const sectionValueStr =
        activeSection.value === ''
          ? ''
          : changeSectionValueFormat(utils, activeSection.value, activeSection.formatValue, 'MM');

      const response = getNewSectionValue(
        sectionValueStr,
        doesSectionHaveTrailingZeros(utils, 'digit', 'MM'),
      );

      if (response == null) {
        return null;
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

    return null;
  };

  const applyNumericEditing: CharacterEditingApplier<TDate, TSection> = (
    params,
    boundaries,
    activeDate,
  ) => {
    const getNewSectionValue = (
      queryValue: string,
      activeSection: TSection,
      hasTrailingZeroes: boolean,
    ): ReturnType<QueryApplier<TSection>> => {
      const queryValueNumber = Number(`${queryValue}`);
      const sectionBoundaries = boundaries[activeSection.dateSectionName](
        activeDate,
        activeSection,
      );

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
        newSectionValue = cleanTrailingZeroInNumericSectionValue(
          newSectionValue,
          sectionBoundaries.maximum,
        );
      }

      return { sectionValue: newSectionValue, shouldGoToNextSection };
    };

    const getFirstSectionValueMatchingWithQuery: QueryApplier<TSection> = (
      queryValue,
      activeSection,
    ) => {
      if (activeSection.contentType === 'digit') {
        return getNewSectionValue(queryValue, activeSection, activeSection.hasTrailingZeroes);
      }

      // When editing a letter-format month and the user presses a digit,
      // We can support the numeric editing by using the digit-format month and re-formatting the result.
      if (activeSection.dateSectionName === 'month') {
        const response = getNewSectionValue(
          queryValue,
          activeSection,
          doesSectionHaveTrailingZeros(utils, 'digit', 'MM'),
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

      return { saveQuery: false };
    };

    return applyQuery(params, getFirstSectionValueMatchingWithQuery);
  };

  return useEventCallback((params: ApplyCharacterEditingParams) => {
    const activeSection = sections[params.sectionIndex];
    const isNumericEditing = !Number.isNaN(Number(params.keyPressed));

    let getNewSectionValue: CharacterEditingApplier<TDate, TSection>;
    if (isNumericEditing) {
      // eslint-disable-next-line no-underscore-dangle
      if (ponyfillGlobal.__MUI__PICKERS_ENABLE_QUERY_BASED_NUMERIC_EDITING__) {
        getNewSectionValue = applyNumericEditing;
      } else {
        getNewSectionValue = applyLegacyNumericEditing;
      }
    } else {
      getNewSectionValue = applyLetterEditing;
    }

    updateSectionValue({
      activeSection,
      setSectionValueOnDate: (activeDate, boundaries) => {
        const response = getNewSectionValue(params, boundaries, activeDate);
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

        const { getter, setter } = getSectionGetterAndSetter(utils, activeSection.dateSectionName);

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
      setSectionValueOnSections: (boundaries) => getNewSectionValue(params, boundaries, null),
    });
  });
};
