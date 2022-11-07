import * as React from 'react';
import { useControlled } from '@mui/material/utils';
import useEventCallback from '@mui/utils/useEventCallback';
import { WrapperVariant } from '../../components/wrappers/WrapperVariantContext';
import { useOpenState } from '../useOpenState';
import { useUtils } from '../useUtils';
import { PickerStateValueManager } from '../usePickerState';
import { FieldSelectedSections, UseFieldInternalProps } from '../useField';

export type PickerSelectionState = 'partial' | 'shallow' | 'finish';

interface UsePickerValueState<TValue> {
  /**
   * Date internally used on the picker and displayed in the input.
   * It is updated whenever the user modifies a step.
   */
  draft: TValue;
  /**
   * Last full date provided by the user
   * It is not updated when validating a step of a multistep picker (e.g. validating the date of a date time picker)
   */
  committed: TValue;
  /**
   * Date that will be used if the picker tries to reset its value
   */
  resetFallback: TValue;
}

type PickerValueActionType =
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

interface UsePickerValueAction<DraftValue> {
  action: PickerValueActionType;
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

/**
 * Props used to handle the value that are common to all pickers.
 */
export interface UsePickerValueBaseProps<TValue> {
  /**
   * The value of the picker.
   */
  value?: TValue;
  /**
   * The default value.
   * Used when the component is not controlled.
   */
  defaultValue?: TValue;
  /**
   * Callback fired when the value (the selected date) changes.
   * @template TValue
   * @param {TValue} value The new value.
   */
  onChange?: (value: TValue) => void;
  /**
   * Callback fired when the value is accepted @DateIOType.
   * @template TValue
   * @param {TValue} value The value that was just accepted.
   */
  onAccept?: (value: TValue) => void;
}

/**
 * Props used to handle the value of non-static pickers.
 */
export interface UsePickerValueNonStaticProps<TValue>
  extends Pick<
    UseFieldInternalProps<TValue, unknown>,
    'selectedSections' | 'onSelectedSectionsChange'
  > {
  /**
   * If `true` the popup or dialog will close after submitting full date.
   * @default `true` for Desktop, `false` for Mobile (based on the chosen wrapper and `desktopModeMediaQuery` prop).
   */
  closeOnSelect?: boolean;
  /**
   * Control the popup or dialog open state.
   * @default false
   */
  open?: boolean;
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
}

/**
 * Props used to handle the value of the pickers.
 */
export interface UsePickerValueProps<TValue>
  extends UsePickerValueBaseProps<TValue>,
    UsePickerValueNonStaticProps<TValue> {}

export interface UsePickerValueParams<TValue, TDate> {
  props: UsePickerValueProps<TValue>;
  valueManager: PickerStateValueManager<TValue, TDate>;
  wrapperVariant: WrapperVariant;
}

interface UsePickerValueActions {
  onAccept: () => void;
  onClear: () => void;
  onDismiss: () => void;
  onCancel: () => void;
  onSetToday: () => void;
  onOpen: () => void;
  onClose: () => void;
}

type UsePickerValueFieldResponse<TValue> = Required<
  Pick<
    UseFieldInternalProps<TValue, unknown>,
    'value' | 'onChange' | 'selectedSections' | 'onSelectedSectionsChange'
  >
>;

/**
 * Props passed to `usePickerViews`.
 */
export interface UsePickerValueViewsResponse<TValue> {
  value: TValue;
  onChange: (value: TValue, selectionState?: PickerSelectionState) => void;
  open: boolean;
  onClose: () => void;
  onSelectedSectionsChange: (newValue: FieldSelectedSections) => void;
}

/**
 * Props passed to `usePickerLayout`.
 */
export interface UsePickerValueLayoutResponse<TValue> extends UsePickerValueActions {
  value: TValue;
  onChange: (newValue: TValue) => void;
}

export interface UsePickerValueResponse<TValue> {
  open: boolean;
  actions: UsePickerValueActions;
  viewProps: UsePickerValueViewsResponse<TValue>;
  fieldProps: UsePickerValueFieldResponse<TValue>;
  layoutProps: UsePickerValueLayoutResponse<TValue>;
}

/**
 * Manage the value lifecycle of all the pickers.
 */
export const usePickerValue = <TValue, TDate>({
  props,
  valueManager,
  wrapperVariant,
}: UsePickerValueParams<TValue, TDate>): UsePickerValueResponse<TValue> => {
  const {
    onAccept: onAcceptProp,
    onChange,
    value: inValue,
    defaultValue,
    closeOnSelect,
    selectedSections: selectedSectionsProp,
    onSelectedSectionsChange,
  } = props;

  const [value, setValue] = useControlled({
    controlled: inValue,
    default: defaultValue ?? valueManager.emptyValue,
    name: 'usePickerState2',
    state: 'value',
  });

  const [selectedSections, setSelectedSections] = useControlled({
    controlled: selectedSectionsProp,
    default: null,
    name: 'usePickerState2',
    state: 'selectedSections',
  });

  const utils = useUtils<TDate>();
  const { isOpen, setIsOpen } = useOpenState(props);

  const [dateState, setDateState] = React.useState<UsePickerValueState<TValue>>(() => ({
    committed: value,
    draft: value,
    resetFallback: value,
  }));

  const setDate = React.useCallback(
    (params: UsePickerValueAction<TValue>) => {
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
        setValue(params.value);
        onChange?.(params.value);
      }

      if (params.action === 'acceptAndClose') {
        setIsOpen(false);
        if (
          onAcceptProp &&
          !valueManager.areValuesEqual(utils, dateState.resetFallback, params.value)
        ) {
          onAcceptProp(params.value);
        }
      }
    },
    [onAcceptProp, onChange, setIsOpen, dateState, utils, valueManager, setValue],
  );

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

  const handleClear = useEventCallback(() => {
    // Reset all date in state to the empty value and close picker.
    setDate({
      value: valueManager.emptyValue,
      action: 'acceptAndClose',
      // force `onChange` in cases like input (value) === `Invalid date`
      forceOnChangeCall: !valueManager.areValuesEqual(utils, value as any, valueManager.emptyValue),
    });
  });

  const handleAccept = useEventCallback(() => {
    // Set all date in state to equal the current draft value and close picker.
    setDate({
      value: dateState.draft,
      action: 'acceptAndClose',
      // force `onChange` in cases like input (value) === `Invalid date`
      forceOnChangeCall: !valueManager.areValuesEqual(utils, dateState.committed, dateState.draft),
    });
  });

  const handleDismiss = useEventCallback(() => {
    // Set all dates in state to equal the last committed date.
    // e.g. Reset the state to the last committed value.
    setDate({ value: dateState.committed, action: 'acceptAndClose' });
  });

  const handleCancel = useEventCallback(() => {
    // Set all dates in state to equal the last accepted date and close picker.
    // e.g. Reset the state to the last accepted value
    setDate({ value: dateState.resetFallback, action: 'acceptAndClose' });
  });

  const handleSetToday = useEventCallback(() => {
    // Set all dates in state to equal today and close picker.
    setDate({ value: valueManager.getTodayValue(utils), action: 'acceptAndClose' });
  });

  const handleOpen = useEventCallback(() => setIsOpen(true));

  const handleClose = useEventCallback(() => setIsOpen(false));

  const handleChange = useEventCallback(
    (newDate: TValue, selectionState: PickerSelectionState = 'partial') => {
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
  );

  const handleChangeAndCommit = useEventCallback((newValue: TValue) =>
    setDate({ action: 'setCommitted', value: newValue }),
  );

  const handleFieldSelectedSectionsChange = useEventCallback(
    (newSelectedSections: FieldSelectedSections) => {
      setSelectedSections(newSelectedSections);
      onSelectedSectionsChange?.(newSelectedSections);
    },
  );

  const actions: UsePickerValueActions = {
    onClear: handleClear,
    onAccept: handleAccept,
    onDismiss: handleDismiss,
    onCancel: handleCancel,
    onSetToday: handleSetToday,
    onOpen: handleOpen,
    onClose: handleClose,
  };

  const fieldResponse: UsePickerValueFieldResponse<TValue> = {
    value: dateState.draft,
    onChange: handleChangeAndCommit,
    selectedSections,
    onSelectedSectionsChange: handleFieldSelectedSectionsChange,
  };

  const viewResponse: UsePickerValueViewsResponse<TValue> = {
    value: dateState.draft,
    onChange: handleChange,
    onClose: handleClose,
    open: isOpen,
    onSelectedSectionsChange: handleFieldSelectedSectionsChange,
  };

  const layoutResponse: UsePickerValueLayoutResponse<TValue> = {
    ...actions,
    value: dateState.draft,
    onChange: handleChangeAndCommit,
  };

  return {
    open: isOpen,
    fieldProps: fieldResponse,
    viewProps: viewResponse,
    layoutProps: layoutResponse,
    actions,
  };
};
