import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { PickerRangeValue, RangePosition, useUtils } from '@mui/x-date-pickers/internals';
// eslint-disable-next-line no-restricted-imports
import { BaseCalendarSection } from '@mui/x-date-pickers/internals/base/utils/base-calendar/utils/types';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarRoot } from '@mui/x-date-pickers/internals/base/utils/base-calendar/root/useBaseCalendarRoot';
// eslint-disable-next-line no-restricted-imports
import { BaseCalendarRootContext } from '@mui/x-date-pickers/internals/base/utils/base-calendar/root/BaseCalendarRootContext';
import { RangeCalendarRootContext } from './RangeCalendarRootContext';
import { applySelectedDateOnRange, createPreviewRange, getRoundedRange } from '../utils/range';

export function useBuildRangeCalendarRootContext(
  parameters: useBuildRangeCalendarRootContext.Parameters,
) {
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

export namespace useBuildRangeCalendarRootContext {
  export interface Parameters {
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
}
