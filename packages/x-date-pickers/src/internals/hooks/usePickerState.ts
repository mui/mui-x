import * as React from 'react';
import { WrapperVariant } from '../components/wrappers/WrapperVariantContext';
import { useOpenState } from './useOpenState';
import { useUtils } from './useUtils';
import { MuiPickersAdapter } from '../models';

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
   */
  | 'accept'
  /**
   * Set the draft and committed date to the action value
   */
  | 'commit'
  /**
   * Set the draft date to the action value
   */
  | 'draft';

interface DateStateAction<DraftValue> {
  type: DateStateActionType;
  value: DraftValue;
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

const reducer: React.Reducer<DateState<any>, DateStateAction<any>> = (state, action) => {
  switch (action.type) {
    case 'accept': {
      return { draft: action.value, committed: action.value, resetTarget: action.value };
    }
    case 'commit': {
      return { ...state, draft: action.value, committed: action.value };
    }
    case 'draft': {
      return { ...state, draft: action.value };
    }
    default: {
      return state;
    }
  }
};

export const usePickerState = <TInput, TDateValue>(
  props: PickerStateProps<TInput, TDateValue>,
  valueManager: PickerStateValueManager<TInput, TDateValue>,
  /**
   * Wrapper variant currently used
   * It impacts the default "close on select" behavior
   */
  wrapperVariant: WrapperVariant,
) => {
  const { disableCloseOnSelect = wrapperVariant === 'mobile', onAccept, onChange, value } = props;

  const utils = useUtils<TDateValue>();
  const { isOpen, setIsOpen } = useOpenState(props);

  const parsedDateValue = React.useMemo(
    () => valueManager.parseInput(utils, value),
    [valueManager, utils, value],
  );

  const [lastValidDateValue, setLastValidDateValue] = React.useState<TDateValue | null>(
    parsedDateValue,
  );

  React.useEffect(() => {
    if (parsedDateValue != null) {
      setLastValidDateValue(parsedDateValue);
    }
  }, [parsedDateValue]);

  const [dateState, dispatch] = React.useReducer(
    reducer as React.Reducer<DateState<TDateValue>, DateStateAction<TDateValue>>,
    { committed: parsedDateValue, draft: parsedDateValue, resetTarget: parsedDateValue },
  );

  const setDate = React.useCallback(
    (params: DateStateAction<TDateValue> & { closePicker?: boolean; internal?: boolean }) => {
      dispatch({ type: params.type, value: params.value });

      if (!params.internal) {
        onChange(params.value);
      }

      if (params.closePicker) {
        setIsOpen(false);
        if (onAccept) {
          onAccept(params.value);
        }
      }
    },
    [onAccept, onChange, setIsOpen],
  );

  // Set the draft and committed date to equal the new prop value.
  if (!valueManager.areValuesEqual(utils, dateState.committed, parsedDateValue)) {
    setDate({ type: 'commit', value: parsedDateValue, internal: true });
  }

  // Mobile keyboard view is a special case.
  // When it's open picker should work like closed, because we are just showing text field
  const [isMobileKeyboardViewOpen, setMobileKeyboardViewOpen] = React.useState(false);

  const shouldCloseOnSelect = !(disableCloseOnSelect ?? wrapperVariant === 'mobile');

  const wrapperProps = React.useMemo(
    () => ({
      open: isOpen,
      onClear: () => {
        // Reset all date in state to the empty value and close picker
        setDate({ value: valueManager.emptyValue, type: 'accept', closePicker: true });
      },
      onAccept: () => {
        // Set all date in state to equal the current draft value and close picker
        setDate({ value: dateState.draft, type: 'accept', closePicker: true });
      },
      onDismiss: () => {
        if (shouldCloseOnSelect) {
          // Set all dates in state to equal the last accepted date
          // e.g. Reset the state to the last accepted value
          setDate({ value: dateState.resetTarget, type: 'accept', closePicker: true });
        } else {
          // Set all dates in state to equal the last committed date
          // e.g. Reset the state to the last committed value
          setDate({ value: dateState.committed, type: 'accept', closePicker: true });
        }
      },
      onSetToday: () => {
        if (shouldCloseOnSelect) {
          setDate({ value: utils.date()!, type: 'accept', closePicker: true });
        } else {
          setDate({ value: utils.date()!, type: 'commit' });
        }
      },
    }),
    [setDate, shouldCloseOnSelect, isOpen, utils, dateState, valueManager.emptyValue],
  );

  const pickerProps = React.useMemo(
    () => ({
      date: dateState.draft,
      isMobileKeyboardViewOpen,
      toggleMobileKeyboardView: () => setMobileKeyboardViewOpen(!isMobileKeyboardViewOpen),
      onDateChange: (
        newDate: TDateValue,
        _: WrapperVariant,
        selectionState: PickerSelectionState = 'partial',
      ) => {
        switch (selectionState) {
          case 'shallow': {
            // Update the `draft` state but do not fire `onChange`
            return setDate({ type: 'draft', value: newDate, internal: true });
          }

          case 'partial': {
            // Update the `draft` state and fire `onChange`
            return setDate({ type: 'draft', value: newDate });
          }

          case 'finish': {
            if (shouldCloseOnSelect) {
              return setDate({ value: newDate, type: 'accept', closePicker: true });
            }

            return setDate({ value: newDate, type: 'commit' });
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
    (date: TDateValue, keyboardInputValue?: string) => {
      const cleanDate = valueManager.valueReducer
        ? valueManager.valueReducer(utils, lastValidDateValue, date)
        : date;
      onChange(cleanDate, keyboardInputValue);
    },
    [onChange, valueManager, lastValidDateValue, utils],
  );

  const inputProps = React.useMemo(
    () => ({
      onChange: handleInputChange,
      open: isOpen,
      rawValue: value,
      openPicker: () => {
        // Update all dates in state to equal the current prop value
        setDate({ type: 'accept', value: parsedDateValue, internal: true });
        setIsOpen(true);
      },
    }),
    [setDate, handleInputChange, isOpen, value, setIsOpen, parsedDateValue],
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
