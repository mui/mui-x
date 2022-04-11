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
}

export type PickerSelectionState = 'partial' | 'shallow' | 'finish';

interface DateState<T> {
  draft: T;
  committed: T;
  accepted: T;
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

export const usePickerState = <TInput, TDateValue>(
  props: PickerStateProps<TInput, TDateValue>,
  valueManager: PickerStateValueManager<TInput, TDateValue>,
) => {
  const { disableCloseOnSelect, onAccept, onChange, value } = props;

  const utils = useUtils<TDateValue>();
  const { isOpen, setIsOpen } = useOpenState(props);

  const parsedDateValue = valueManager.parseInput(utils, value);
  const [dateState, dispatch] = React.useReducer<
    React.Reducer<DateState<TDateValue>, DateStateAction<TDateValue>>
  >(
    (state, action) => {
      switch (action.type) {
        case 'accept': {
          return { draft: action.value, committed: action.value, accepted: action.value };
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
    },
    { committed: parsedDateValue, draft: parsedDateValue, accepted: parsedDateValue },
  );

  if (!valueManager.areValuesEqual(utils, dateState.committed, parsedDateValue)) {
    dispatch({ type: 'commit', value: parsedDateValue });
  }

  // Mobile keyboard view is a special case.
  // When it's open picker should work like closed, because we are just showing text field
  const [isMobileKeyboardViewOpen, setMobileKeyboardViewOpen] = React.useState(false);

  const updateDate = React.useCallback(
    (params: DateStateAction<TDateValue> & { closePicker: boolean }) => {
      dispatch({ type: params.type, value: params.value });
      onChange(params.value);

      if (params.closePicker) {
        setIsOpen(false);
        if (onAccept) {
          onAccept(params.value);
        }
      }
    },
    [onAccept, onChange, setIsOpen],
  );

  const wrapperProps = React.useMemo(
    () => ({
      open: isOpen,
      onClear: () =>
        updateDate({
          value: valueManager.emptyValue,
          type: 'accept',
          closePicker: true,
        }),
      onAccept: () =>
        updateDate({
          value: dateState.draft,
          type: 'accept',
          closePicker: true,
        }),
      onDismiss: () => {
        const shouldCloseOnSelect = !disableCloseOnSelect; // ?? wrapperVariant === 'mobile');
        if (shouldCloseOnSelect) {
          // Reset to the last accepted date
          updateDate({ value: dateState.accepted, type: 'accept', closePicker: true });
        } else {
          // Accept the last committed date
          updateDate({ value: dateState.committed, type: 'accept', closePicker: true });
        }
      },
      onSetToday: () => {
        // TODO: Fix the default value
        const shouldCloseOnSelect = !disableCloseOnSelect; // ?? wrapperVariant === 'mobile');
        if (shouldCloseOnSelect) {
          updateDate({ value: utils.date()!, type: 'accept', closePicker: true });
        } else {
          updateDate({ value: utils.date()!, type: 'commit', closePicker: false });
        }
      },
    }),
    [updateDate, disableCloseOnSelect, isOpen, utils, dateState, valueManager.emptyValue],
  );

  const pickerProps = React.useMemo(
    () => ({
      date: dateState.draft,
      isMobileKeyboardViewOpen,
      toggleMobileKeyboardView: () => setMobileKeyboardViewOpen(!isMobileKeyboardViewOpen),
      onDateChange: (
        newDate: TDateValue,
        wrapperVariant: WrapperVariant,
        selectionState: PickerSelectionState = 'partial',
      ) => {
        if (selectionState === 'partial') {
          updateDate({ type: 'draft', value: newDate, closePicker: false });
        } else if (selectionState === 'finish') {
          const shouldCloseOnSelect = !(disableCloseOnSelect ?? wrapperVariant === 'mobile');
          if (shouldCloseOnSelect) {
            updateDate({ value: newDate, type: 'accept', closePicker: true });
          } else {
            updateDate({ value: newDate, type: 'commit', closePicker: false });
          }
        } else if (selectionState === 'shallow') {
          dispatch({ type: 'draft', value: newDate });
        }

        // if selectionState === "shallow" do nothing (we already update the draft state)
      },
    }),
    [updateDate, disableCloseOnSelect, isMobileKeyboardViewOpen, dateState.draft],
  );

  const inputProps = React.useMemo(
    () => ({
      onChange,
      open: isOpen,
      rawValue: value,
      openPicker: () => {
        dispatch({ type: 'accept', value: parsedDateValue });
        setIsOpen(true);
      },
    }),
    [onChange, isOpen, value, setIsOpen, parsedDateValue],
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
