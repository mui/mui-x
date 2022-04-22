import * as React from 'react';
import { WrapperVariant } from '../components/wrappers/WrapperVariantContext';
import { useOpenState } from './useOpenState';
import { useUtils } from './useUtils';
import { MuiPickersAdapter } from '../models';

export interface PickerStateValueManager<TValue, TInputValue> {
  areValuesEqual: (
    utils: MuiPickersAdapter<TValue>,
    valueLeft: TValue,
    valueRight: TValue,
  ) => boolean;
  emptyValue: TValue;
  parseInput: (utils: MuiPickersAdapter<TValue>, value: TInputValue) => TValue;
  valueReducer?: (
    utils: MuiPickersAdapter<TValue>,
    prevValue: TValue | null,
    value: TValue | null,
  ) => TValue;
}

export type PickerSelectionState = 'partial' | 'shallow' | 'finish';

interface Draftable<T> {
  committed: T;
  draft: T;
}

interface DraftAction<DraftValue> {
  type: 'update' | 'reset';
  payload: DraftValue;
}

interface PickerStateProps<TValue, TInputValue> {
  disableCloseOnSelect?: boolean;
  open?: boolean;
  onAccept?: (value: TValue) => void;
  onChange: (value: TValue, keyboardInputValue?: string) => void;
  onClose?: () => void;
  onOpen?: () => void;
  value: TInputValue;
}

export const usePickerState = <TValue, TInputValue>(
  props: PickerStateProps<TValue, TInputValue>,
  valueManager: PickerStateValueManager<TValue, TInputValue>,
) => {
  const { disableCloseOnSelect, onAccept, onChange, value } = props;

  const utils = useUtils<TValue>();
  const { isOpen, setIsOpen } = useOpenState(props);

  function initDraftableDate(date: TValue): Draftable<TValue> {
    return { committed: date, draft: date };
  }

  const parsedDateValue = React.useMemo(
    () => valueManager.parseInput(utils, value),
    [valueManager, utils, value],
  );

  const [lastValidDateValue, setLastValidDateValue] = React.useState<TValue | null>(
    parsedDateValue,
  );

  React.useEffect(() => {
    if (parsedDateValue != null) {
      setLastValidDateValue(parsedDateValue);
    }
  }, [parsedDateValue]);

  const [draftState, dispatch] = React.useReducer(
    (state: Draftable<TValue>, action: DraftAction<TValue>): Draftable<TValue> => {
      switch (action.type) {
        case 'reset':
          return initDraftableDate(action.payload);
        case 'update':
          return {
            ...state,
            draft: action.payload,
          };
        default:
          return state;
      }
    },
    parsedDateValue,
    initDraftableDate,
  );
  if (!valueManager.areValuesEqual(utils, draftState.committed, parsedDateValue)) {
    dispatch({ type: 'reset', payload: parsedDateValue });
  }

  const [initialDate, setInitialDate] = React.useState<TValue>(draftState.committed);

  // Mobile keyboard view is a special case.
  // When it's open picker should work like closed, because we are just showing text field
  const [isMobileKeyboardViewOpen, setMobileKeyboardViewOpen] = React.useState(false);

  const acceptDate = React.useCallback(
    (acceptedDate: TValue, needClosePicker: boolean) => {
      onChange(acceptedDate);

      if (needClosePicker) {
        setIsOpen(false);
        setInitialDate(acceptedDate);
        if (onAccept) {
          onAccept(acceptedDate);
        }
      }
    },
    [onAccept, onChange, setIsOpen],
  );

  const wrapperProps = React.useMemo(
    () => ({
      open: isOpen,
      onClear: () => acceptDate(valueManager.emptyValue, true),
      onAccept: () => acceptDate(draftState.draft, true),
      onDismiss: () => acceptDate(initialDate, true),
      onSetToday: () => {
        const now = utils.date()!;
        dispatch({ type: 'update', payload: now });
        acceptDate(now, !disableCloseOnSelect);
      },
    }),
    [
      acceptDate,
      disableCloseOnSelect,
      isOpen,
      utils,
      draftState.draft,
      valueManager.emptyValue,
      initialDate,
    ],
  );

  const pickerProps = React.useMemo(
    () => ({
      date: draftState.draft,
      isMobileKeyboardViewOpen,
      toggleMobileKeyboardView: () => setMobileKeyboardViewOpen(!isMobileKeyboardViewOpen),
      onDateChange: (
        newValue: TValue,
        wrapperVariant: WrapperVariant,
        selectionState: PickerSelectionState = 'partial',
      ) => {
        dispatch({ type: 'update', payload: newValue });
        if (selectionState === 'partial') {
          acceptDate(newValue, false);
        }

        if (selectionState === 'finish') {
          const shouldCloseOnSelect = !(disableCloseOnSelect ?? wrapperVariant === 'mobile');
          acceptDate(newValue, shouldCloseOnSelect);
        }

        // if selectionState === "shallow" do nothing (we already update the draft state)
      },
    }),
    [acceptDate, disableCloseOnSelect, isMobileKeyboardViewOpen, draftState.draft],
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

  const inputProps = React.useMemo(
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
      pickerDraft: draftState,
      other: pickerState,
    },
  }));

  return pickerState;
};
