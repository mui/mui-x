import * as React from 'react';
import { useMediaQuery } from '@base-ui-components/react/unstable-use-media-query';
import useEventCallback from '@mui/utils/useEventCallback';
import useControlled from '@mui/utils/useControlled';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { ValidateDateProps } from '@mui/x-date-pickers/validation';
import {
  DEFAULT_DESKTOP_MODE_MEDIA_QUERY,
  mergeDateAndTime,
  PickerRangeValue,
  RangePosition,
  useUtils,
} from '@mui/x-date-pickers/internals';
// eslint-disable-next-line no-restricted-imports
import {
  useAddDefaultsToBaseDateValidationProps,
  useBaseCalendarRoot,
} from '@mui/x-date-pickers/internals/base/utils/base-calendar/root/useBaseCalendarRoot';
// eslint-disable-next-line no-restricted-imports
import { mergeReactProps } from '@mui/x-date-pickers/internals/base/base-utils/mergeReactProps';
// eslint-disable-next-line no-restricted-imports
import { GenericHTMLProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
import { DateRangeValidationError } from '../../../../models';
import { useDateRangeManager } from '../../../../managers';
import {
  ValidateDateRangeProps,
  ExportedValidateDateRangeProps,
} from '../../../../validation/validateDateRange';
import { isRangeValid } from '../../../utils/date-utils';
import { UseRangePositionProps } from '../../../hooks/useRangePosition';
import { applySelectedDateOnRange } from '../utils/range';
import { useBuildRangeCalendarRootContext } from './useBuildRangeCalendarRootContext';

const DEFAULT_AVAILABLE_RANGE_POSITIONS: RangePosition[] = ['start', 'end'];

export function useRangeCalendarRoot(parameters: useRangeCalendarRoot.Parameters) {
  const utils = useUtils();
  const manager = useDateRangeManager();
  const isPointerFine = useMediaQuery(DEFAULT_DESKTOP_MODE_MEDIA_QUERY, {
    defaultMatches: false,
  });

  const {
    // Validation props
    minDate,
    maxDate,
    disablePast,
    disableFuture,
    shouldDisableDate,
    // Children
    children: childrenProp,
    // Range position props
    rangePosition: rangePositionProp,
    defaultRangePosition,
    onRangePositionChange,
    availableRangePositions = DEFAULT_AVAILABLE_RANGE_POSITIONS,
    // Other range-specific parameters
    disableDragEditing = false,
    disableHoverPreview = !isPointerFine,
    // Parameters forwarded to `useBaseCalendarRoot`
    ...baseParameters
  } = parameters;

  // TODO: Add support for range position from the context when implementing the Picker Base UI X component.
  const [rangePosition, setRangePosition] = useControlled({
    name: 'useRangeCalendarRoot',
    state: 'rangePosition',
    controlled: rangePositionProp,
    default: defaultRangePosition ?? 'start',
  });

  const handleRangePositionChange = useEventCallback((newRangePosition: RangePosition) => {
    onRangePositionChange?.(newRangePosition);
    setRangePosition(newRangePosition);
  });

  const baseDateValidationProps = useAddDefaultsToBaseDateValidationProps({
    minDate,
    maxDate,
    disablePast,
    disableFuture,
  });

  const shouldDisableDateForSingleDateValidation = React.useMemo(() => {
    if (!shouldDisableDate) {
      return undefined;
    }

    return (dayToTest: PickerValidDate) => shouldDisableDate(dayToTest, rangePosition);
  }, [shouldDisableDate, rangePosition]);

  const dateValidationProps = React.useMemo<ValidateDateProps>(
    () => ({
      ...baseDateValidationProps,
      shouldDisableDate: shouldDisableDateForSingleDateValidation,
    }),
    [baseDateValidationProps, shouldDisableDateForSingleDateValidation],
  );

  const valueValidationProps = React.useMemo<ValidateDateRangeProps>(
    () => ({
      ...baseDateValidationProps,
      shouldDisableDate,
    }),
    [baseDateValidationProps, shouldDisableDate],
  );

  const handleSelectDate = useEventCallback(
    ({
      setValue,
      prevValue,
      selectedDate,
      referenceDate,
      allowRangeFlip,
      section,
    }: useBaseCalendarRoot.OnSelectDateParameters<PickerRangeValue> & {
      allowRangeFlip?: boolean;
    }) => {
      let cleanSelectedDate = selectedDate;
      // If there is a date already selected, then we want to keep its time
      // Otherwise, we want to use the reference date's time
      if (prevValue[0] && rangePosition === 'start') {
        cleanSelectedDate = mergeDateAndTime(utils, selectedDate, prevValue[0]);
      } else if (prevValue[1] && rangePosition === 'end') {
        cleanSelectedDate = mergeDateAndTime(utils, selectedDate, prevValue[1]);
      } else {
        cleanSelectedDate = mergeDateAndTime(utils, selectedDate, referenceDate);
      }

      const changes = applySelectedDateOnRange({
        selectedDate: cleanSelectedDate,
        utils,
        range: prevValue,
        rangePosition,
        allowRangeFlip: allowRangeFlip ?? false,
        section,
      });

      const isNextSectionAvailable = availableRangePositions.includes(changes.rangePosition);
      if (isNextSectionAvailable) {
        handleRangePositionChange(changes.rangePosition);
      }

      const isFullRangeSelected = rangePosition === 'end' && isRangeValid(utils, changes.range);

      setValue(changes.range, {
        section,
        changeImportance: isFullRangeSelected || !isNextSectionAvailable ? 'set' : 'accept',
      });
    },
  );

  const calendarValueManager = React.useMemo<
    useBaseCalendarRoot.ValueManager<PickerRangeValue>
  >(() => {
    return {
      getDateToUseForReferenceDate: (value) => value[0] ?? value[1],
      getCurrentDateFromValue: (value) => (rangePosition === 'start' ? value[0] : value[1]),
      onSelectDate: handleSelectDate,
      getSelectedDatesFromValue: (value) => value.filter((date) => date != null),
    };
  }, [rangePosition, handleSelectDate]);

  const {
    value,
    referenceDate,
    setValue,
    setVisibleDate,
    isDateCellVisible,
    visibleDateContext,
    context: baseContext,
  } = useBaseCalendarRoot({
    ...baseParameters,
    manager,
    valueValidationProps,
    dateValidationProps,
    calendarValueManager,
  });

  const [prevState, setPrevState] = React.useState<{
    value: PickerRangeValue;
    rangePosition: RangePosition;
  }>({ value, rangePosition });
  if (prevState.value !== value || prevState.rangePosition !== rangePosition) {
    setPrevState({ value, rangePosition });
    if (rangePosition === 'start' && utils.isValid(value[0]) && !isDateCellVisible(value[0])) {
      setVisibleDate(value[0]);
    } else if (rangePosition === 'end' && utils.isValid(value[1]) && !isDateCellVisible(value[1])) {
      setVisibleDate(value[1]);
    }
  }

  const context = useBuildRangeCalendarRootContext({
    baseContext,
    value,
    onRangePositionChange: handleRangePositionChange,
    rangePosition,
    disableDragEditing,
    disableHoverPreview,
    onSelectDateFromDrag: (selectedDate, section) =>
      handleSelectDate({
        section,
        setValue,
        referenceDate,
        selectedDate,
        prevValue: value,
        allowRangeFlip: true,
      }),
  });

  const getRootProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      let children: React.ReactNode;
      if (!React.isValidElement(childrenProp) && typeof childrenProp === 'function') {
        children = childrenProp({ visibleDate: visibleDateContext.visibleDate });
      } else {
        children = childrenProp;
      }
      return mergeReactProps(externalProps, { children });
    },
    [childrenProp, visibleDateContext.visibleDate],
  );

  const isEmpty = value[0] == null && value[1] == null;

  return React.useMemo(
    () => ({ getRootProps, context, baseContext, visibleDateContext, isEmpty }),
    [getRootProps, context, baseContext, visibleDateContext, isEmpty],
  );
}

namespace useRangeCalendarRoot {
  export interface Parameters
    extends useBaseCalendarRoot.PublicParameters<PickerRangeValue, DateRangeValidationError>,
      ExportedValidateDateRangeProps,
      UseRangePositionProps {
    /**
     * Range positions available for selection.
     * This list is checked against when checking if a next range position can be selected.
     *
     * Used on Date Time Range pickers with current `rangePosition` to force a `finish` selection after just one range position selection.
     * @default ['start', 'end']
     */
    availableRangePositions?: RangePosition[];
    /**
     * If `true`, editing dates by dragging is disabled.
     * @default false
     */
    disableDragEditing?: boolean;
    /**
     * If `true`, the hover preview is disabled.
     * The cells that would be selected if clicking on the hovered cell won't receive a data-preview attribute.
     * @default useMediaQuery('@media (pointer: fine)')
     */
    disableHoverPreview?: boolean;
    /**
     * The children of the calendar.
     * If a function is provided, it will be called with the public context as its parameter.
     */
    children?: React.ReactNode | ((parameters: ChildrenParameters) => React.ReactNode);
  }

  export interface ChildrenParameters {
    visibleDate: PickerValidDate;
  }
}
