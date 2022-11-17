import * as React from 'react';
import {
  DateOrTimeView,
  onSpaceOrEnter,
  useLocaleText,
  UsePickerResponse,
  WrapperVariant,
} from '@mui/x-date-pickers/internals';
import { DateRange } from '../models';

interface UseRangePickerFieldParams<TDate, TView extends DateOrTimeView>
  extends Pick<UsePickerResponse<DateRange<TDate>, TView, any>, 'open' | 'actions'> {
  wrapperVariant: WrapperVariant;
  readOnly?: boolean;
  disabled?: boolean;
  disableOpenPicker?: boolean;
  onBlur?: () => void;
  currentDatePosition: 'start' | 'end';
  onCurrentDatePositionChange: (newPosition: 'start' | 'end') => void;
}

export const useRangePickerInputProps = <TDate, TView extends DateOrTimeView>({
  wrapperVariant,
  open,
  actions,
  readOnly,
  disabled,
  disableOpenPicker,
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

  const startInputProps = {
    inputRef: startRef,
    label: localeText.start,
    onKeyDown: onSpaceOrEnter(openRangeStartSelection),
    onFocus: focusOnRangeStart,
    focused: open ? currentDatePosition === 'start' : undefined,
    // registering `onClick` listener on the root element as well to correctly handle cases where user is clicking on `label`
    // which has `pointer-events: none` and due to DOM structure the `input` does not catch the click event
    ...(!readOnly && !disabled && { onClick: openRangeStartSelection }),
    inputProps: {
      readOnly: wrapperVariant === 'mobile',
    },
  };

  const endInputProps = {
    inputRef: endRef,
    label: localeText.end,
    onKeyDown: onSpaceOrEnter(openRangeEndSelection),
    onFocus: focusOnRangeEnd,
    focused: open ? currentDatePosition === 'end' : undefined,
    // registering `onClick` listener on the root element as well to correctly handle cases where user is clicking on `label`
    // which has `pointer-events: none` and due to DOM structure the `input` does not catch the click event
    ...(!readOnly && !disabled && { onClick: openRangeEndSelection }),
    inputProps: {
      readOnly: wrapperVariant === 'mobile',
    },
  };

  const rootProps = {
    onBlur,
  };

  return { startInput: startInputProps, endInput: endInputProps, root: rootProps };
};
