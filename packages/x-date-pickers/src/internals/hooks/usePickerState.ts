import * as React from 'react';
import { WrapperVariant } from '../components/wrappers/WrapperVariantContext';
import { useOpenState } from './useOpenState';
import { useUtils } from './useUtils';
import { MuiPickersAdapter } from '../models';

export interface PickerStateValueManager<TValue, TDate, TError> {
  /**
   * Determines if two values are equal.
   * @template TDate, TValue
   * @param {MuiPickersAdapter<TDate>} utils The adapter.
   * @param {TValue} valueLeft The first value to compare.
   * @param {TValue} valueRight The second value to compare.
   * @returns {boolean} A boolean indicating if the two values are equal.
   */
  areValuesEqual: (
    utils: MuiPickersAdapter<TDate>,
    valueLeft: TValue,
    valueRight: TValue,
  ) => boolean;
  /**
   * Value to set when clicking the "Clear" button.
   */
  emptyValue: TValue;
  /**
   * Method returning the value to set when clicking the "Today" button
   * @template TDate, TValue
   * @param {MuiPickersAdapter<TDate>} utils The adapter.
   * @returns {TValue} The value to set when clicking the "Today" button.
   */
  getTodayValue: (utils: MuiPickersAdapter<TDate>) => TValue;
  /**
   * Method parsing the input value to replace all invalid dates by `null`.
   * @template TDate, TValue
   * @param {MuiPickersAdapter<TDate>} utils The adapter.
   * @param {TValue} value The value to parse.
   * @returns {TValue} The value without invalid date.
   */
  cleanValue: (utils: MuiPickersAdapter<TDate>, value: TValue) => TValue;
  /**
   * Generates the new value, given the previous value and the new proposed value.
   * @template TDate, TValue
   * @param {MuiPickersAdapter<TDate>} utils The adapter.
   * @param {TValue} lastValidDateValue The last valid value.
   * @param {TValue} value The proposed value.
   * @returns {TValue} The new value.
   */
  valueReducer?: (
    utils: MuiPickersAdapter<TDate>,
    lastValidDateValue: TValue,
    value: TValue,
  ) => TValue;
  /**
   * Compare two errors to know if they are equal.
   * @template TError
   * @param {TError} error The new error
   * @param {TError | null} prevError The previous error
   * @returns {boolean} `true` if the new error is different from the previous one.
   */
  isSameError: (error: TError, prevError: TError | null) => boolean;
  /**
   * The value identifying no error, used to initialise the error state.
   */
  defaultErrorState: TError;
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
  /**
   * If `true`, force firing the `onChange` callback
   * This field takes precedence over `skipOnChangeCall`
   * @default false
   */
  forceOnChangeCall?: boolean;
}

export interface PickerStateProps<TValue> {
  /**
   * If `true` the popup or dialog will immediately close after submitting full date.
   * @default `true` for Desktop, `false` for Mobile (based on the chosen wrapper and `desktopModeMediaQuery` prop).
   */
  closeOnSelect?: boolean;
  /**
   * Control the popup or dialog open state.
   */
  open?: boolean;
  /**
   * Callback fired when date is accepted @DateIOType.
   * @template TValue
   * @param {TValue} value The value that was just accepted.
   */
  onAccept?: (value: TValue) => void;
  /**
   * Callback fired when the value (the selected date) changes @DateIOType.
   * @template TValue
   * @param {TValue} value The new value.
   * @param {string} keyboardInputValue The current value of the keyboard input.
   */
  onChange: (value: TValue, keyboardInputValue?: string) => void;
  /**
   * Callback fired when the popup requests to be closed.
   * Use in controlled mode (see open).
   */
  onClose?: () => void;
  /**
   * Callback fired when the popup requests to be opened.
   * Use in controlled mode (see open).
   */
  onOpen?: () => void;
  /**
   * The value of the picker.
   */
  value: TValue;
}

interface PickerStateInputProps<TValue> {
  onChange: (value: TValue, keyboardInputValue?: string) => void;
  open: boolean;
  value: TValue;
  openPicker: () => void;
}

export interface PickerStatePickerProps<TValue> {
  value: TValue;
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

interface PickerState<TValue> {
  inputProps: PickerStateInputProps<TValue>;
  pickerProps: PickerStatePickerProps<TValue>;
  wrapperProps: PickerStateWrapperProps;
}

export const usePickerState = <TValue, TDate, TError>(
  props: PickerStateProps<TValue>,
  valueManager: PickerStateValueManager<TValue, TDate, TError>,
): PickerState<TValue> => {
  const { onAccept, onChange, value: rawValue, closeOnSelect } = props;

  const utils = useUtils<TDate>();
  const { isOpen, setIsOpen } = useOpenState(props);

  const value = React.useMemo(
    () => valueManager.cleanValue(utils, rawValue),
    [valueManager, utils, rawValue],
  );

  const [lastValidDateValue, setLastValidDateValue] = React.useState<TValue>(value);

  const [dateState, setDateState] = React.useState<PickerDateState<TValue>>(() => ({
    committed: value,
    draft: value,
    resetFallback: value,
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
        params.forceOnChangeCall ||
        (!params.skipOnChangeCall &&
          !valueManager.areValuesEqual(utils, dateState.committed, params.value))
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
    if (utils.isValid(value)) {
      setLastValidDateValue(value);
    }
  }, [utils, value]);

  React.useEffect(() => {
    if (isOpen) {
      // Update all dates in state to equal the current prop value
      setDate({ action: 'setAll', value, skipOnChangeCall: true });
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Set the draft and committed date to equal the new prop value.
  if (!valueManager.areValuesEqual(utils, dateState.committed, value)) {
    setDate({ action: 'setCommitted', value, skipOnChangeCall: true });
  }

  const wrapperProps = React.useMemo<PickerStateWrapperProps>(
    () => ({
      open: isOpen,
      onClear: () => {
        // Reset all date in state to the empty value and close picker.
        setDate({
          value: valueManager.emptyValue,
          action: 'acceptAndClose',
          // force `onChange` in cases like input (value) === `Invalid date`
          forceOnChangeCall: !valueManager.areValuesEqual(utils, rawValue, valueManager.emptyValue),
        });
      },
      onAccept: () => {
        // Set all date in state to equal the current draft value and close picker.
        setDate({
          value: dateState.draft,
          action: 'acceptAndClose',
          forceOnChangeCall: !valueManager.areValuesEqual(utils, rawValue, value),
        });
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
    [setDate, isOpen, utils, dateState, valueManager, value, rawValue],
  );

  // Mobile keyboard view is a special case.
  // When it's open picker should work like closed, because we are just showing text field
  const [isMobileKeyboardViewOpen, setMobileKeyboardViewOpen] = React.useState(false);

  const pickerProps = React.useMemo<PickerStatePickerProps<TValue>>(
    () => ({
      value: dateState.draft,
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
    (newDate: TValue, keyboardInputValue?: string) => {
      const cleanParsedValue = valueManager.valueReducer
        ? valueManager.valueReducer(utils, lastValidDateValue, newDate)
        : newDate;
      onChange(cleanParsedValue, keyboardInputValue);
    },
    [onChange, valueManager, lastValidDateValue, utils],
  );

  const inputProps = React.useMemo<PickerStateInputProps<TValue>>(
    () => ({
      onChange: handleInputChange,
      open: isOpen,
      value: rawValue,
      openPicker: () => setIsOpen(true),
    }),
    [handleInputChange, isOpen, setIsOpen, rawValue],
  );

  const pickerState: PickerState<TValue> = { pickerProps, inputProps, wrapperProps };
  React.useDebugValue(pickerState, () => ({
    MuiPickerState: {
      dateState,
      other: pickerState,
    },
  }));

  return pickerState;
};
