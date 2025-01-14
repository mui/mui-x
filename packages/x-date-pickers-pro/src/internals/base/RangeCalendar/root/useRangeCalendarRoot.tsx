import * as React from 'react';
import { useMediaQuery } from '@base-ui-components/react/unstable-use-media-query';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { ValidateDateProps } from '@mui/x-date-pickers/validation';
import {
  DEFAULT_DESKTOP_MODE_MEDIA_QUERY,
  PickerRangeValue,
  RangePosition,
  useUtils,
} from '@mui/x-date-pickers/internals';
// eslint-disable-next-line no-restricted-imports
import { BaseCalendarSection } from '@mui/x-date-pickers/internals/base/utils/base-calendar/utils/types';
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
import { isRangeValid } from '../../../utils/date-utils';
import { useRangePosition, UseRangePositionProps } from '../../../hooks/useRangePosition';
import { RangeCalendarRootContext } from './RangeCalendarRootContext';
import { applySelectedDateOnRange, createPreviewRange, getRoundedRange } from '../utils/range';

const DEFAULT_AVAILABLE_RANGE_POSITIONS: RangePosition[] = ['start', 'end'];

export function useRangeCalendarRoot(parameters: useRangeCalendarRoot.Parameters) {
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
    // Range position props
    rangePosition: rangePositionProp,
    defaultRangePosition: defaultRangePositionProp,
    onRangePositionChange: onRangePositionChangeProp,
    availableRangePositions = DEFAULT_AVAILABLE_RANGE_POSITIONS,
    // Other range-specific parameters
    disableDragEditing = false,
    disableHoverPreview = !isPointerFine,
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

  const getNewValueFromNewSelectedDate = useEventCallback(
    ({
      prevValue,
      selectedDate,
      referenceDate,
      allowRangeFlip,
      section,
    }: useBaseCalendarRoot.GetNewValueFromNewSelectedDateParameters<PickerRangeValue> & {
      allowRangeFlip?: boolean;
    }): useBaseCalendarRoot.GetNewValueFromNewSelectedDateReturnValue<PickerRangeValue> => {
      const changes = applySelectedDateOnRange({
        selectedDate,
        utils,
        range: prevValue,
        position: rangePosition,
        allowRangeFlip: allowRangeFlip ?? false,
        shouldMergeDateAndTime: true,
        referenceDate,
        section,
      });

      const isNextSectionAvailable = availableRangePositions.includes(changes.position);
      if (isNextSectionAvailable) {
        onRangePositionChange(changes.position);
      }

      const isFullRangeSelected = rangePosition === 'end' && isRangeValid(utils, changes.range);

      return {
        value: changes.range,
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
    setValue,
    value,
    referenceDate,
    onRangePositionChange,
    rangePosition,
    disableDragEditing,
    disableHoverPreview,
    getNewValueFromNewSelectedDate,
  });

  const getRootProps = React.useCallback((externalProps: GenericHTMLProps) => {
    return mergeReactProps(externalProps, {});
  }, []);

  const isEmpty = value[0] == null && value[1] == null;

  return React.useMemo(
    () => ({ getRootProps, context, baseContext, isEmpty }),
    [getRootProps, context, baseContext, isEmpty],
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
    /**
     * If `true`, the hover preview is disabled.
     * The cells that would be selected if clicking on the hovered cell won't receive a data-preview attribute.
     * @default useMediaQuery('@media (pointer: fine)')
     */
    disableHoverPreview?: boolean;
  }
}

function useBuildRangeCalendarRootContext(parameters: UseBuildRangeCalendarRootContextParameters) {
  const {
    value,
    setValue,
    referenceDate,
    baseContext,
    rangePosition,
    onRangePositionChange,
    getNewValueFromNewSelectedDate,
    disableDragEditing: disableDragEditingProp,
    disableHoverPreview: disableHoverPreviewProp,
  } = parameters;

  const disableDragEditing = disableDragEditingProp || baseContext.disabled || baseContext.readOnly;
  const disableHoverPreview =
    disableHoverPreviewProp || baseContext.disabled || baseContext.readOnly;

  const utils = useUtils();
  const cellToDateMapRef = React.useRef(new Map<HTMLElement, PickerValidDate>());
  const [dragAndDropState, setDragAndDropState] = React.useState<{
    draggedSection: BaseCalendarSection | null;
    targetDate: PickerValidDate | null;
  }>({
    draggedSection: null,
    targetDate: null,
  });
  const [previewState, setPreviewState] = React.useState<{
    hoveredDate: PickerValidDate;
    section: BaseCalendarSection;
  } | null>(null);

  const registerCell: RangeCalendarRootContext['registerCell'] = useEventCallback(
    (element, valueToRegister) => {
      cellToDateMapRef.current.set(element, valueToRegister);
      return () => {
        cellToDateMapRef.current.delete(element);
      };
    },
  );

  const startDragging: RangeCalendarRootContext['startDragging'] = useEventCallback(
    (position, section) => {
      setDragAndDropState((prev) => ({ ...prev, draggedSection: section }));
      onRangePositionChange(position);
    },
  );

  const stopDragging: RangeCalendarRootContext['stopDragging'] = useEventCallback(() => {
    setDragAndDropState({
      draggedSection: null,
      targetDate: null,
    });
  });

  const selectDateFromDrag: RangeCalendarRootContext['selectDateFromDrag'] = useEventCallback(
    (valueOrElement) => {
      const selectedDate =
        valueOrElement instanceof HTMLElement
          ? cellToDateMapRef.current.get(valueOrElement)
          : valueOrElement;
      if (selectedDate == null || dragAndDropState.draggedSection == null) {
        return;
      }

      const response = getNewValueFromNewSelectedDate({
        prevValue: value,
        selectedDate,
        referenceDate,
        allowRangeFlip: true,
        section: dragAndDropState.draggedSection,
      });

      setValue(response.value, { changeImportance: response.changeImportance, section: 'day' });
    },
  );

  const setHoveredDate: RangeCalendarRootContext['setHoveredDate'] = useEventCallback(
    (date, section) => {
      if (disableHoverPreview) {
        return;
      }
      setPreviewState(date == null ? null : { hoveredDate: date, section });
    },
  );

  const setDragTarget: RangeCalendarRootContext['setDragTarget'] = useEventCallback(
    (valueOrElement) => {
      const newTargetDate =
        valueOrElement instanceof HTMLElement
          ? cellToDateMapRef.current.get(valueOrElement)
          : valueOrElement;

      if (newTargetDate == null || utils.isEqual(newTargetDate, dragAndDropState.targetDate)) {
        return;
      }

      setDragAndDropState((prev) => ({ ...prev, targetDate: newTargetDate }));

      // TODO: Buggy
      if (value[0] && utils.isBeforeDay(newTargetDate, value[0])) {
        onRangePositionChange('start');
      } else if (value[1] && utils.isAfterDay(newTargetDate, value[1])) {
        onRangePositionChange('end');
      }
    },
  );

  const selectedRange = React.useMemo<PickerRangeValue>(() => {
    if (!dragAndDropState.targetDate || dragAndDropState.draggedSection == null) {
      return value;
    }

    const roundedRange = getRoundedRange({
      utils,
      range: value,
      section: dragAndDropState.draggedSection,
    });
    if (roundedRange[0] == null || roundedRange[1] == null) {
      return roundedRange;
    }

    const rangeAfterDragAndDrop = applySelectedDateOnRange({
      utils,
      range: roundedRange,
      selectedDate: dragAndDropState.targetDate,
      position: rangePosition,
      allowRangeFlip: true,
      shouldMergeDateAndTime: false,
      referenceDate,
      section: dragAndDropState.draggedSection,
    }).range;

    return getRoundedRange({
      utils,
      range: rangeAfterDragAndDrop,
      section: dragAndDropState.draggedSection,
    });
  }, [
    rangePosition,
    dragAndDropState.targetDate,
    dragAndDropState.draggedSection,
    utils,
    value,
    referenceDate,
  ]);

  const previewRange = React.useMemo<PickerRangeValue>(() => {
    if (disableHoverPreview || previewState == null) {
      return [null, null];
    }

    return createPreviewRange({
      utils,
      value,
      hoveredDate: previewState.hoveredDate,
      section: previewState.section,
      position: rangePosition,
    });
  }, [utils, rangePosition, value, disableHoverPreview, previewState]);

  const emptyDragImgRef = React.useRef<HTMLImageElement | null>(null);
  React.useEffect(() => {
    // Preload the image - required for Safari support: https://stackoverflow.com/a/40923520/3303436
    emptyDragImgRef.current = document.createElement('img');
    emptyDragImgRef.current.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }, []);

  const draggedSectionRef = React.useRef(dragAndDropState.draggedSection);
  useEnhancedEffect(() => {
    draggedSectionRef.current = dragAndDropState.draggedSection;
  });

  const context: RangeCalendarRootContext = {
    value,
    selectedRange,
    previewRange,
    disableDragEditing,
    draggedSectionRef,
    emptyDragImgRef,
    selectDateFromDrag,
    startDragging,
    stopDragging,
    setDragTarget,
    setHoveredDate,
    registerCell,
  };

  return context;
}

interface UseBuildRangeCalendarRootContextParameters {
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
  rangePosition: RangePosition;
  disableHoverPreview: boolean;
}
