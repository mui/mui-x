import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { PickerRangeValue, RangePosition, useUtils } from '@mui/x-date-pickers/internals';
// eslint-disable-next-line no-restricted-imports
import { BaseCalendarSection } from '@mui/x-date-pickers/internals/base/utils/base-calendar/utils/types';
// eslint-disable-next-line no-restricted-imports
import { BaseCalendarRootContext } from '@mui/x-date-pickers/internals/base/utils/base-calendar/root/BaseCalendarRootContext';
import { RangeCalendarRootContext } from './RangeCalendarRootContext';
import { applySelectedDateOnRange, getRoundedRange } from '../utils/range';

export function useBuildRangeCalendarRootContext(
  parameters: useBuildRangeCalendarRootContext.Parameters,
) {
  const {
    value,
    baseContext,
    rangePosition,
    onRangePositionChange,
    onSelectDateFromDrag,
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

      onSelectDateFromDrag(selectedDate, dragAndDropState.draggedSection);
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
    if (
      !dragAndDropState.targetDate ||
      dragAndDropState.draggedSection == null ||
      value[0] == null ||
      value[1] == null
    ) {
      return value;
    }

    const roundedRange = getRoundedRange({
      utils,
      range: value,
      section: dragAndDropState.draggedSection,
    });

    const rangeAfterDragAndDrop = applySelectedDateOnRange({
      utils,
      range: roundedRange,
      selectedDate: dragAndDropState.targetDate,
      rangePosition,
      allowRangeFlip: true,
      section: dragAndDropState.draggedSection,
    }).range;

    return getRoundedRange({
      utils,
      range: rangeAfterDragAndDrop,
      section: dragAndDropState.draggedSection,
    });
  }, [rangePosition, dragAndDropState.targetDate, dragAndDropState.draggedSection, utils, value]);

  const previewRange = React.useMemo<PickerRangeValue>(() => {
    if (disableHoverPreview || previewState == null) {
      return [null, null];
    }

    const roundedValue = getRoundedRange({
      utils,
      range: value,
      section: previewState.section,
    });

    const [start, end] = roundedValue;
    const changes = applySelectedDateOnRange({
      utils,
      section: previewState.section,
      rangePosition,
      range: value,
      selectedDate: previewState.hoveredDate,
      allowRangeFlip: false,
    });

    if (!start || !end) {
      return changes.range;
    }

    const [previewStart, previewEnd] = changes.range;
    return rangePosition === 'end' ? [end, previewEnd] : [previewStart, start];
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
    baseContext: BaseCalendarRootContext;
    disableDragEditing: boolean;
    disableHoverPreview: boolean;
    onSelectDateFromDrag: (selectedDate: PickerValidDate, section: BaseCalendarSection) => void;
    onRangePositionChange: (position: RangePosition) => void;
    rangePosition: RangePosition;
  }
}
