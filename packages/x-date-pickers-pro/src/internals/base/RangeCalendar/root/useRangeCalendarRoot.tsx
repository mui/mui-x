import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { ValidateDateProps } from '@mui/x-date-pickers/validation';
import { PickerRangeValue, RangePosition, useUtils } from '@mui/x-date-pickers/internals';
// eslint-disable-next-line no-restricted-imports
import {
  useAddDefaultsToBaseDateValidationProps,
  useBaseCalendarRoot,
} from '@mui/x-date-pickers/internals/base/utils/base-calendar/root/useBaseCalendarRoot';
// eslint-disable-next-line no-restricted-imports
import { BaseCalendarRootContext } from '@mui/x-date-pickers/internals/base/utils/base-calendar/root/BaseCalendarRootContext';
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
import { calculateRangeChange } from '../../../utils/date-range-manager';
import { isRangeValid } from '../../../utils/date-utils';
import { useRangePosition, UseRangePositionProps } from '../../../hooks/useRangePosition';
import { RangeCalendarRootContext } from './RangeCalendarRootContext';
import { RangeCalendarRootDragContext } from './RangeCalendarRootDragContext';

const DEFAULT_AVAILABLE_RANGE_POSITIONS: RangePosition[] = ['start', 'end'];

export function useRangeCalendarRoot(parameters: useRangeCalendarRoot.Parameters) {
  const {
    // Validation props
    minDate,
    maxDate,
    disablePast,
    disableFuture,
    shouldDisableDate,
    // Range position props
    rangePosition: rangePositionProp,
    defaultRangePosition: defaultRangePositionProp,
    onRangePositionChange: onRangePositionChangeProp,
    availableRangePositions = DEFAULT_AVAILABLE_RANGE_POSITIONS,
    // Other range-specific parameters
    disableDragEditing = false,
    // Parameters forwarded to `useBaseCalendarRoot`
    ...baseParameters
  } = parameters;
  const utils = useUtils();
  const manager = useDateRangeManager();

  // TODO: Add support for range position from the context when implementing the Picker Base UI X component.
  const { rangePosition, onRangePositionChange } = useRangePosition({
    rangePosition: rangePositionProp,
    defaultRangePosition: defaultRangePositionProp,
    onRangePositionChange: onRangePositionChangeProp,
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

    return (dayToTest: PickerValidDate) =>
      // TODO: Add correct range position.
      shouldDisableDate(dayToTest, rangePosition /* draggingDatePosition || rangePosition */);
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

  const getNewValueFromNewSelectedDate = useEventCallback(
    ({
      prevValue,
      selectedDate,
      referenceDate,
      allowRangeFlip,
    }: useBaseCalendarRoot.GetNewValueFromNewSelectedDateParameters<PickerRangeValue> & {
      allowRangeFlip?: boolean;
    }): useBaseCalendarRoot.GetNewValueFromNewSelectedDateReturnValue<PickerRangeValue> => {
      const { nextSelection, newRange } = calculateRangeChange({
        newDate: selectedDate,
        utils,
        range: prevValue,
        rangePosition,
        allowRangeFlip,
        shouldMergeDateAndTime: true,
        referenceDate,
      });

      const isNextSectionAvailable = availableRangePositions.includes(nextSelection);
      if (isNextSectionAvailable) {
        onRangePositionChange(nextSelection);
      }

      const isFullRangeSelected = rangePosition === 'end' && isRangeValid(utils, newRange);

      return {
        value: newRange,
        changeImportance: isFullRangeSelected || !isNextSectionAvailable ? 'set' : 'accept',
      };
    },
  );

  const calendarValueManager = React.useMemo<
    useBaseCalendarRoot.ValueManager<PickerRangeValue>
  >(() => {
    return {
      getDateToUseForReferenceDate: (value) => value[0] ?? value[1],
      getCurrentDateFromValue: (value) => (rangePosition === 'start' ? value[0] : value[1]),
      getNewValueFromNewSelectedDate,
      getSelectedDatesFromValue: (value) => value.filter((date) => date != null),
    };
  }, [rangePosition, getNewValueFromNewSelectedDate]);

  const {
    value,
    referenceDate,
    setValue,
    setVisibleDate,
    isDateCellVisible,
    context: baseContext,
  } = useBaseCalendarRoot({
    ...baseParameters,
    manager,
    valueValidationProps,
    dateValidationProps,
    calendarValueManager,
  });

  // // Range going for the start of the start day to the end of the end day.
  // // This makes sure that `isWithinRange` works with any time in the start and end day.
  // const valueDayRange = React.useMemo<PickerRangeValue>(
  //   () => [
  //     !utils.isValid(value[0]) ? value[0] : utils.startOfDay(value[0]),
  //     !utils.isValid(value[1]) ? value[1] : utils.endOfDay(value[1]),
  //   ],
  //   [value, utils],
  // );

  // TODO: Apply some logic based on the range position.
  const [prevValue, setPrevValue] = React.useState<PickerRangeValue>(value);
  if (value !== prevValue) {
    setPrevValue(value);
    let targetDate: PickerValidDate | null = null;
    if (utils.isValid(value[0])) {
      targetDate = value[0];
    } else if (utils.isValid(value[1])) {
      targetDate = value[1];
    }
    if (targetDate != null && isDateCellVisible(targetDate)) {
      setVisibleDate(targetDate);
    }
  }

  const { dragContext, draggingDatePosition } = useRangeCalendarDragEditing({
    baseContext,
    setValue,
    value,
    referenceDate,
    onRangePositionChange,
    disableDragEditing,
    getNewValueFromNewSelectedDate,
  });

  const context: RangeCalendarRootContext = React.useMemo(
    () => ({
      value,
    }),
    [value],
  );

  const getRootProps = React.useCallback((externalProps: GenericHTMLProps) => {
    return mergeReactProps(externalProps, {});
  }, []);

  return React.useMemo(
    () => ({ getRootProps, context, baseContext, dragContext }),
    [getRootProps, context, baseContext, dragContext],
  );
}

export namespace useRangeCalendarRoot {
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
  }
}

function useRangeCalendarDragEditing(parameters: UseRangeCalendarDragEditingParameters) {
  const {
    value,
    setValue,
    referenceDate,
    baseContext,
    onRangePositionChange,
    getNewValueFromNewSelectedDate,
    disableDragEditing: disableDragEditingProp,
  } = parameters;
  const utils = useUtils();
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragTarget, setDragTarget] = React.useState<PickerValidDate | null>(null);

  const selectDayFromDrag = useEventCallback((selectedDate: PickerValidDate) => {
    const response = getNewValueFromNewSelectedDate({
      prevValue: value,
      selectedDate,
      referenceDate,
      allowRangeFlip: true,
    });

    setValue(response.value, { changeImportance: response.changeImportance, section: 'day' });
  });

  const disableDragEditing = disableDragEditingProp || baseContext.disabled || baseContext.readOnly;

  const isDraggingRef = React.useRef(isDragging);
  useEnhancedEffect(() => {
    isDraggingRef.current = isDragging;
  });

  const emptyDragImgRef = React.useRef<HTMLImageElement | null>(null);
  React.useEffect(() => {
    // Preload the image - required for Safari support: https://stackoverflow.com/a/40923520/3303436
    emptyDragImgRef.current = document.createElement('img');
    emptyDragImgRef.current.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }, []);

  const startDragging = useEventCallback((position: RangePosition) => {
    setIsDragging(true);
    onRangePositionChange(position);
  });

  const stopDragging = useEventCallback(() => setIsDragging(false));

  const handleDragTargetChange = useEventCallback((newDragTarget: PickerValidDate | null) => {
    if (utils.isEqual(newDragTarget, dragTarget)) {
      return;
    }

    setDragTarget(newDragTarget);
  });

  const draggingDatePosition: RangePosition | null = React.useMemo(() => {
    const [start, end] = value;
    if (dragTarget) {
      if (start && utils.isBefore(dragTarget, start)) {
        return 'start';
      }
      if (end && utils.isAfter(dragTarget, end)) {
        return 'end';
      }
    }
    return null;
  }, [value, dragTarget, utils]);

  const dragContext: RangeCalendarRootDragContext = {
    disableDragEditing,
    isDraggingRef,
    emptyDragImgRef,
    selectDayFromDrag,
    startDragging,
    stopDragging,
    setDragTarget: handleDragTargetChange,
  };

  return { dragContext, draggingDatePosition };
}

interface UseRangeCalendarDragEditingParameters {
  value: PickerRangeValue;
  referenceDate: PickerValidDate;
  setValue: useBaseCalendarRoot.ReturnValue<PickerRangeValue>['setValue'];
  baseContext: BaseCalendarRootContext;
  disableDragEditing: boolean;
  getNewValueFromNewSelectedDate: (
    parameters: useBaseCalendarRoot.GetNewValueFromNewSelectedDateParameters<PickerRangeValue> & {
      allowRangeFlip?: boolean;
    },
  ) => useBaseCalendarRoot.GetNewValueFromNewSelectedDateReturnValue<PickerRangeValue>;
  onRangePositionChange: (position: RangePosition) => void;
}
