import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import {
  CalendarOrClockPickerView,
  onSpaceOrEnter,
  useLocaleText,
  UsePickerResponse,
  WrapperVariant,
} from '@mui/x-date-pickers/internals';
import { DateRange } from '../models';

interface UseRangePickerFieldParams<TDate, TView extends CalendarOrClockPickerView>
  extends Pick<UsePickerResponse<DateRange<TDate>, TView, any>, 'open' | 'actions'> {
  wrapperVariant: WrapperVariant;
  readOnly?: boolean;
  disabled?: boolean;
  disableOpenPicker?: boolean;
  Input: React.ElementType;
  externalInputProps?: Record<string, any>;
  onBlur: (() => void) | undefined;
  currentDatePosition: 'start' | 'end';
  onCurrentDatePositionChange: (newPosition: 'start' | 'end') => void;
}

export const useRangePickerInputProps = <TDate, TView extends CalendarOrClockPickerView>({
  wrapperVariant,
  open,
  actions,
  readOnly,
  disabled,
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

  const openRangeStartSelection = (
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => {
    event?.stopPropagation();
    onCurrentDatePositionChange('start');
    if (!readOnly && !disableOpenPicker) {
      actions.onOpen();
    }
  };

  const openRangeEndSelection = (
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => {
    event?.stopPropagation();
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
      focused: open ? currentDatePosition === 'start' : undefined,
      // registering `onClick` listener on the root element as well to correctly handle cases where user is clicking on `label`
      // which has `pointer-events: none` and due to DOM structure the `input` does not catch the click event
      ...(!readOnly && !disabled && { onClick: openRangeStartSelection }),
      inputProps: {
        readOnly: wrapperVariant === 'mobile',
      },
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
      focused: open ? currentDatePosition === 'start' : undefined,
      // registering `onClick` listener on the root element as well to correctly handle cases where user is clicking on `label`
      // which has `pointer-events: none` and due to DOM structure the `input` does not catch the click event
      ...(!readOnly && !disabled && { onClick: openRangeStartSelection }),
      inputProps: {
        readOnly: wrapperVariant === 'mobile',
      },
    },
    // TODO: Pass owner state
    ownerState: {},
  });

  return { startInputProps, endInputProps };
};
