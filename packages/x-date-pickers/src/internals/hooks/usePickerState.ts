import * as React from 'react';
import { WrapperVariant } from '../components/wrappers/WrapperVariantContext';
import { useOpenState } from './useOpenState';
import { useUtils } from './useUtils';
import { MuiPickersAdapter } from '../models';

export interface PickerStateValueManager<TInputValue, TValue, TDate> {
  areValuesEqual: (
    utils: MuiPickersAdapter<TDate>,
    valueLeft: TValue,
    valueRight: TValue,
  ) => boolean;
  emptyValue: TValue;
  getTodayValue: (utils: MuiPickersAdapter<TDate>) => TValue;
  parseInput: (utils: MuiPickersAdapter<TDate>, value: TInputValue) => TValue;
  valueReducer?: (utils: MuiPickersAdapter<TDate>, prevValue: TValue, value: TValue) => TValue;
}

export type PickerSelectionState = 'partial' | 'shallow' | 'finish';

interface PickerDateState<TValue> {
  /**
   * Date internally used on the picker and displayed in the input.
   * It is updates whenever the user validates a step.
   */
  draft: TValue;
  /**
   * Last full date provided by the user
   * Is not updated when validating a step of a multistep picker (e.g. validating the date of a date time picker)
   */
  committed: TValue;
  /**
   * Date that will be used if the pickers tries to reset its value
   */
  resetFallback: TValue;
}

type DateStateActionType =
  /**
   * Set the draft, committed and accepted dates to the action value
   * Closes the picker
   */
  | 'acceptAndClose'
  /**
   * Set the draft, committed and accepted dates to the action value
   */
  | 'setAll'
  /**
   * Set the draft and committed date to the action value
   */
  | 'setCommitted'
  /**
   * Set the draft date to the action value
   */
  | 'setDraft';

interface DateStateAction<DraftValue> {
  action: DateStateActionType;
  value: DraftValue;
  /**
   * If `true`, do not fire the `onChange` callback
   * @default false
   */
  skipOnChangeCall?: boolean;
}

interface PickerStateProps<TInputValue, TValue> {
  closeOnSelect?: boolean;
  open?: boolean;
  onAccept?: (date: TValue) => void;
  onChange: (date: TValue, keyboardInputValue?: string) => void;
  onClose?: () => void;
  onOpen?: () => void;
  value: TInputValue;
}

interface PickerStateInputProps<TInputValue, TValue> {
  onChange: (date: TValue, keyboardInputValue?: string) => void;
  open: boolean;
  rawValue: TInputValue;
  openPicker: () => void;
}

interface PickerStatePickerProps<TValue> {
  // TODO: Rename `value`, for the date range it make no sense to call it `date`
  date: TValue;
  isMobileKeyboardViewOpen: boolean;
  toggleMobileKeyboardView: () => void;
  onDateChange: (
    newDate: TValue,
    wrapperVariant: WrapperVariant,
    selectionState?: PickerSelectionState,
  ) => void;
}

export interface PickerStateWrapperProps {
  onAccept: () => void;
  onClear: () => void;
  onDismiss: () => void;
  onCancel: () => void;
  onSetToday: () => void;
  open: boolean;
}

interface PickerState<TInputValue, TValue> {
  inputProps: PickerStateInputProps<TInputValue, TValue>;
  pickerProps: PickerStatePickerProps<TValue>;
  wrapperProps: PickerStateWrapperProps;
}

export const usePickerState = <TInputValue, TValue, TDate>(
  props: PickerStateProps<TInputValue, TValue>,
  valueManager: PickerStateValueManager<TInputValue, TValue, TDate>,
): PickerState<TInputValue, TValue> => {
  const { onAccept, onChange, value, closeOnSelect } = props;

  const utils = useUtils<TDate>();
  const { isOpen, setIsOpen } = useOpenState(props);

  const parsedDateValue = React.useMemo(
    () => valueManager.parseInput(utils, value),
    [valueManager, utils, value],
  );

  const [lastValidDateValue, setLastValidDateValue] = React.useState<TValue>(parsedDateValue);

  const [dateState, setDateState] = React.useState<PickerDateState<TValue>>(() => ({
    committed: parsedDateValue,
    draft: parsedDateValue,
    resetFallback: parsedDateValue,
  }));

  const setDate = React.useCallback(
    (params: DateStateAction<TValue>) => {
      setDateState((prev) => {
        switch (params.action) {
          case 'setAll':
          case 'acceptAndClose': {
            return { draft: params.value, committed: params.value, resetFallback: params.value };
          }
          case 'setCommitted': {
            return { ...prev, draft: params.value, committed: params.value };
          }
          case 'setDraft': {
            return { ...prev, draft: params.value };
          }
          default: {
            return prev;
          }
        }
      });

      if (
        !params.skipOnChangeCall &&
        !valueManager.areValuesEqual(utils, dateState.committed, params.value)
      ) {
        onChange(params.value);
      }

      if (params.action === 'acceptAndClose') {
        setIsOpen(false);
        if (
          onAccept &&
          !valueManager.areValuesEqual(utils, dateState.resetFallback, params.value)
        ) {
          onAccept(params.value);
        }
      }
    },
    [onAccept, onChange, setIsOpen, dateState, utils, valueManager],
  );

  React.useEffect(() => {
    if (parsedDateValue != null) {
      setLastValidDateValue(parsedDateValue);
    }
  }, [parsedDateValue]);

  React.useEffect(() => {
    if (isOpen) {
      // Update all dates in state to equal the current prop value
      setDate({ action: 'setAll', value: parsedDateValue, skipOnChangeCall: true });
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Set the draft and committed date to equal the new prop value.
  if (!valueManager.areValuesEqual(utils, dateState.committed, parsedDateValue)) {
    setDate({ action: 'setCommitted', value: parsedDateValue, skipOnChangeCall: true });
  }

  const wrapperProps = React.useMemo<PickerStateWrapperProps>(
    () => ({
      open: isOpen,
      onClear: () => {
        // Reset all date in state to the empty value and close picker.
        setDate({ value: valueManager.emptyValue, action: 'acceptAndClose' });
      },
      onAccept: () => {
        // Set all date in state to equal the current draft value and close picker.
        setDate({ value: dateState.draft, action: 'acceptAndClose' });
      },
      onDismiss: () => {
        // Set all dates in state to equal the last committed date.
        // e.g. Reset the state to the last committed value.
        setDate({ value: dateState.committed, action: 'acceptAndClose' });
      },
      onCancel: () => {
        // Set all dates in state to equal the last accepted date and close picker.
        // e.g. Reset the state to the last accepted value
        setDate({ value: dateState.resetFallback, action: 'acceptAndClose' });
      },
      onSetToday: () => {
        // Set all dates in state to equal today and close picker.
        setDate({ value: valueManager.getTodayValue(utils), action: 'acceptAndClose' });
      },
    }),
    [setDate, isOpen, utils, dateState, valueManager],
  );

  // Mobile keyboard view is a special case.
  // When it's open picker should work like closed, because we are just showing text field
  const [isMobileKeyboardViewOpen, setMobileKeyboardViewOpen] = React.useState(false);

  const pickerProps = React.useMemo<PickerStatePickerProps<TValue>>(
    () => ({
      date: dateState.draft,
      isMobileKeyboardViewOpen,
      toggleMobileKeyboardView: () => setMobileKeyboardViewOpen(!isMobileKeyboardViewOpen),
      onDateChange: (
        newDate: TValue,
        wrapperVariant: WrapperVariant,
        selectionState: PickerSelectionState = 'partial',
      ) => {
        switch (selectionState) {
          case 'shallow': {
            // Update the `draft` state but do not fire `onChange`
            return setDate({ action: 'setDraft', value: newDate, skipOnChangeCall: true });
          }

          case 'partial': {
            // Update the `draft` state and fire `onChange`
            return setDate({ action: 'setDraft', value: newDate });
          }

          case 'finish': {
            if (closeOnSelect ?? wrapperVariant === 'desktop') {
              // Set all dates in state to equal the new date and close picker.
              return setDate({ value: newDate, action: 'acceptAndClose' });
            }

            // Updates the `committed` state and fire `onChange`
            return setDate({ value: newDate, action: 'setCommitted' });
          }

          default: {
            throw new Error('MUI: Invalid selectionState passed to `onDateChange`');
          }
        }
      },
    }),
    [setDate, isMobileKeyboardViewOpen, dateState.draft, closeOnSelect],
  );

  const handleInputChange = React.useCallback(
    (date: TValue, keyboardInputValue?: string) => {
      const cleanDate = valueManager.valueReducer
        ? valueManager.valueReducer(utils, lastValidDateValue, date)
        : date;
      onChange(cleanDate, keyboardInputValue);
    },
    [onChange, valueManager, lastValidDateValue, utils],
  );

  const inputProps = React.useMemo<PickerStateInputProps<TInputValue, TValue>>(
    () => ({
      onChange: handleInputChange,
      open: isOpen,
      rawValue: value,
      openPicker: () => setIsOpen(true),
    }),
    [handleInputChange, isOpen, value, setIsOpen],
  );

  const pickerState: PickerState<TInputValue, TValue> = { pickerProps, inputProps, wrapperProps };
  React.useDebugValue(pickerState, () => ({
    MuiPickerState: {
      dateState,
      other: pickerState,
    },
  }));

  return pickerState;
};
