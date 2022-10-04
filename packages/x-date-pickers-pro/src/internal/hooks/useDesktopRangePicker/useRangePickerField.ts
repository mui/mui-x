import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import { onSpaceOrEnter, UsePickerResponse } from '@mui/x-date-pickers/internals';
import { DateRange } from '../../models';

interface UseRangePickerFieldParams<TDate>
  extends Pick<UsePickerResponse<DateRange<TDate>>, 'open' | 'actions'> {
  readOnly?: boolean;
  disableOpenPicker?: boolean;
  Input: React.ElementType;
  externalInputProps?: Record<string, any>;
  onBlur: () => void;
}

export const useRangePickerField = <TDate>({
  open,
  actions,
  readOnly,
  disableOpenPicker,
  Input,
  externalInputProps,
  onBlur,
}: UseRangePickerFieldParams<TDate>) => {
  const startRef = React.useRef<HTMLInputElement>(null);
  const endRef = React.useRef<HTMLInputElement>(null);

  const [currentlySelectingRangeEnd, setCurrentlySelectingRangeEnd] = React.useState<
    'start' | 'end'
  >('start');

  React.useEffect(() => {
    if (!open) {
      return;
    }

    if (currentlySelectingRangeEnd === 'start') {
      startRef.current?.focus();
    } else if (currentlySelectingRangeEnd === 'end') {
      endRef.current?.focus();
    }
  }, [currentlySelectingRangeEnd, open]);

  const openRangeStartSelection = () => {
    setCurrentlySelectingRangeEnd('start');
    if (!readOnly && !disableOpenPicker) {
      actions.onOpen();
    }
  };

  const openRangeEndSelection = () => {
    setCurrentlySelectingRangeEnd('end');
    if (!readOnly && !disableOpenPicker) {
      actions.onOpen();
    }
  };

  const focusOnRangeStart = () => {
    if (open) {
      setCurrentlySelectingRangeEnd('start');
    }
  };

  const focusOnRangeEnd = () => {
    if (open) {
      setCurrentlySelectingRangeEnd('end');
    }
  };

  const startInputProps = useSlotProps({
    elementType: Input,
    externalSlotProps: externalInputProps,
    additionalProps: {
      onBlur,
      onClick: openRangeStartSelection,
      onKeyDown: onSpaceOrEnter(openRangeStartSelection),
      onFocus: focusOnRangeStart,
    },
    // TODO: Pass owner state
    ownerState: {},
  });

  const endInputProps = useSlotProps({
    elementType: Input,
    externalSlotProps: externalInputProps,
    additionalProps: {
      onBlur,
      onClick: openRangeEndSelection,
      onKeyDown: onSpaceOrEnter(openRangeEndSelection),
      onFocus: focusOnRangeEnd,
    },
    // TODO: Pass owner state
    ownerState: {},
  });

  const inputProps = ({ position }: { position: 'start' | 'end' }) =>
    position === 'start' ? startInputProps : endInputProps;

  return { inputProps };
};
