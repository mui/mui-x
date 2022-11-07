import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import {
  CalendarOrClockPickerView,
  onSpaceOrEnter,
  useLocaleText,
  UsePickerResponse,
} from '@mui/x-date-pickers/internals';
import { DateRange } from '../../models';

interface UseRangePickerFieldParams<TDate, TView extends CalendarOrClockPickerView>
  extends Pick<UsePickerResponse<DateRange<TDate>, TView, any>, 'open' | 'actions'> {
  readOnly?: boolean;
  disableOpenPicker?: boolean;
  Input: React.ElementType;
  externalInputProps?: Record<string, any>;
  onBlur: () => void;
  currentDatePosition: 'start' | 'end';
  onCurrentDatePositionChange: (newPosition: 'start' | 'end') => void;
}

export const useRangePickerField = <TDate, TView extends CalendarOrClockPickerView>({
  open,
  actions,
  readOnly,
  disableOpenPicker,
  Input,
  externalInputProps,
  onBlur,
  currentDatePosition,
  onCurrentDatePositionChange,
}: UseRangePickerFieldParams<TDate, TView>) => {
  const localeText = useLocaleText();

  const startRef = React.useRef<HTMLInputElement>(null);
  const endRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    if (currentDatePosition === 'start') {
      startRef.current?.focus();
    } else if (currentDatePosition === 'end') {
      endRef.current?.focus();
    }
  }, [currentDatePosition, open]);

  const openRangeStartSelection = () => {
    onCurrentDatePositionChange('start');
    if (!readOnly && !disableOpenPicker) {
      actions.onOpen();
    }
  };

  const openRangeEndSelection = () => {
    onCurrentDatePositionChange('end');
    if (!readOnly && !disableOpenPicker) {
      actions.onOpen();
    }
  };

  const focusOnRangeStart = () => {
    if (open) {
      onCurrentDatePositionChange('start');
    }
  };

  const focusOnRangeEnd = () => {
    if (open) {
      onCurrentDatePositionChange('end');
    }
  };

  const startInputProps = useSlotProps({
    elementType: Input,
    externalSlotProps: externalInputProps,
    additionalProps: {
      label: localeText.start,
      onBlur,
      onClick: openRangeStartSelection,
      onKeyDown: onSpaceOrEnter(openRangeStartSelection),
      onFocus: focusOnRangeStart,
      focused: open && currentDatePosition === 'start',
    },
    // TODO: Pass owner state
    ownerState: {},
  });

  const endInputProps = useSlotProps({
    elementType: Input,
    externalSlotProps: externalInputProps,
    additionalProps: {
      label: localeText.end,
      onBlur,
      onClick: openRangeEndSelection,
      onKeyDown: onSpaceOrEnter(openRangeEndSelection),
      onFocus: focusOnRangeEnd,
      focused: open && currentDatePosition === 'end',
    },
    // TODO: Pass owner state
    ownerState: {},
  });

  return { startInputProps, endInputProps };
};
