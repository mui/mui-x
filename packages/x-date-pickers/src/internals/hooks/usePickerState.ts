import * as React from 'react';
import { WrapperVariant } from '../components/wrappers/WrapperVariantContext';
import { useOpenState } from './useOpenState';
import { useUtils } from './useUtils';
import { MuiPickersAdapter } from '../models';
import { PrivateWrapperProps } from '../components/wrappers/WrapperProps';
import { DateInputProps } from '../components/PureDateInput';

export interface PickerStateValueManager<TInputValue, TDateValue> {
  areValuesEqual: (
    utils: MuiPickersAdapter<TDateValue>,
    valueLeft: TDateValue,
    valueRight: TDateValue,
  ) => boolean;
  emptyValue: TDateValue;
  parseInput: (utils: MuiPickersAdapter<TDateValue>, value: TInputValue) => TDateValue;
  valueReducer?: (
    utils: MuiPickersAdapter<TDateValue>,
    prevValue: TDateValue | null,
    value: TDateValue,
  ) => TDateValue;
}

export type PickerSelectionState = 'partial' | 'shallow' | 'finish';

interface DateState<T> {
  /**
   * Date internally used on the picker and displayed in the input.
   * It is updates whenever the user validates a step.
   */
  draft: T;

  /**
   * Last full date provided by the user
   * Is not updated when validating a step of a multistep picker (e.g. validating the date of a date time picker)
   */
  committed: T;

  /**
   * Date that will be used if the pickers tries to reset its value
   */
  resetTarget: T;
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
  internal?: boolean;
}

interface PickerStateProps<TInput, TDateValue> {
  disableCloseOnSelect?: boolean;
  open?: boolean;
  onAccept?: (date: TDateValue) => void;
  onChange: (date: TDateValue, keyboardInputValue?: string) => void;
  onClose?: () => void;
  onOpen?: () => void;
  value: TInput;
}

export const usePickerState = <TInput, TDate>(
  props: PickerStateProps<TInput, TDate>,
  valueManager: PickerStateValueManager<TInput, TDate>,
  /**
   * Wrapper variant currently used
   * It impacts the default "close on select" behavior
   */
  wrapperVariant: WrapperVariant,
) => {
  const { disableCloseOnSelect = wrapperVariant === 'mobile', onAccept, onChange, value } = props;

  const utils = useUtils<TDate>();
  const { isOpen, setIsOpen } = useOpenState(props);

  const parsedDateValue = React.useMemo(
    () => valueManager.parseInput(utils, value),
    [valueManager, utils, value],
  );

  const [lastValidDateValue, setLastValidDateValue] = React.useState<TDate | null>(parsedDateValue);

  const [dateState, setDateState] = React.useState<DateState<TDate>>(() => ({
    committed: parsedDateValue,
    draft: parsedDateValue,
    resetTarget: parsedDateValue,
  }));

  const setDate = React.useCallback(
    (params: DateStateAction<TDate>) => {
      setDateState((prev) => {
        switch (params.action) {
          case 'setAll':
          case 'acceptAndClose': {
            return { draft: params.value, committed: params.value, resetTarget: params.value };
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
        !params.internal &&
        !valueManager.areValuesEqual(utils, dateState.committed, params.value)
      ) {
        onChange(params.value);
      }

      if (params.action === 'acceptAndClose') {
        setIsOpen(false);
        if (onAccept && !valueManager.areValuesEqual(utils, dateState.resetTarget, params.value)) {
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
      setDate({ action: 'setAll', value: parsedDateValue, internal: true });
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Set the draft and committed date to equal the new prop value.
  if (!valueManager.areValuesEqual(utils, dateState.committed, parsedDateValue)) {
    setDate({ action: 'setCommitted', value: parsedDateValue, internal: true });
  }

  const shouldCloseOnSelect = !(disableCloseOnSelect ?? wrapperVariant === 'mobile');

  const wrapperProps = React.useMemo<PrivateWrapperProps>(
    () => ({
      open: isOpen,
      onClear: () => {
        // Reset all date in state to the empty value and close picker
        setDate({ value: valueManager.emptyValue, action: 'acceptAndClose' });
      },
      onAccept: () => {
        // Set all date in state to equal the current draft value and close picker
        setDate({ value: dateState.draft, action: 'acceptAndClose' });
      },
      onDismiss: () => {
        if (shouldCloseOnSelect) {
          // Set all dates in state to equal the last accepted date
          // e.g. Reset the state to the last accepted value
          setDate({ value: dateState.resetTarget, action: 'acceptAndClose' });
        } else {
          // Set all dates in state to equal the last committed date
          // e.g. Reset the state to the last committed value
          setDate({ value: dateState.committed, action: 'acceptAndClose' });
        }
      },
      onReset: () => {
        // Set all dates in state to equal the last accepted date
        // e.g. Reset the state to the last accepted value
        setDate({ value: dateState.resetTarget, action: 'acceptAndClose' });
      },
      onSetToday: () => {
        setDate({ value: utils.date()!, action: 'acceptAndClose' });
      },
    }),
    [setDate, shouldCloseOnSelect, isOpen, utils, dateState, valueManager.emptyValue],
  );

  // Mobile keyboard view is a special case.
  // When it's open picker should work like closed, because we are just showing text field
  const [isMobileKeyboardViewOpen, setMobileKeyboardViewOpen] = React.useState(false);

  const pickerProps = React.useMemo(
    () => ({
      date: dateState.draft,
      isMobileKeyboardViewOpen,
      toggleMobileKeyboardView: () => setMobileKeyboardViewOpen(!isMobileKeyboardViewOpen),
      onDateChange: (
        newDate: TDate,
        _: WrapperVariant,
        selectionState: PickerSelectionState = 'partial',
      ) => {
        switch (selectionState) {
          case 'shallow': {
            // Update the `draft` state but do not fire `onChange`
            return setDate({ action: 'setDraft', value: newDate, internal: true });
          }

          case 'partial': {
            // Update the `draft` state and fire `onChange`
            return setDate({ action: 'setDraft', value: newDate });
          }

          case 'finish': {
            if (shouldCloseOnSelect) {
              return setDate({ value: newDate, action: 'acceptAndClose' });
            }

            return setDate({ value: newDate, action: 'setCommitted' });
          }

          default: {
            throw new Error('MUI: Invalid selectionState passed to `onDateChange`');
          }
        }
      },
    }),
    [shouldCloseOnSelect, setDate, isMobileKeyboardViewOpen, dateState.draft],
  );

  const handleInputChange = React.useCallback(
    (date: TDate, keyboardInputValue?: string) => {
      const cleanDate = valueManager.valueReducer
        ? valueManager.valueReducer(utils, lastValidDateValue, date)
        : date;
      onChange(cleanDate, keyboardInputValue);
    },
    [onChange, valueManager, lastValidDateValue, utils],
  );

  const inputProps = React.useMemo<
    Pick<DateInputProps<TInput, TDate>, 'onChange' | 'open' | 'rawValue' | 'openPicker'>
  >(
    () => ({
      onChange: handleInputChange,
      open: isOpen,
      rawValue: value,
      openPicker: () => setIsOpen(true),
    }),
    [handleInputChange, isOpen, value, setIsOpen],
  );

  const pickerState = { pickerProps, inputProps, wrapperProps };
  React.useDebugValue(pickerState, () => ({
    MuiPickerState: {
      dateState,
      other: pickerState,
    },
  }));

  return pickerState;
};
