import * as React from 'react';
import useControlled from '@mui/utils/useControlled';
import useEventCallback from '@mui/utils/useEventCallback';
import { useOpenState } from '../useOpenState';
import { useLocalizationContext, useUtils } from '../useUtils';
import {
  FieldChangeHandlerContext,
  FieldSelectedSections,
  UseFieldInternalProps,
} from '../useField';
import { InferError, useValidation, Validator } from '../validation/useValidation';
import { UseFieldValidationProps } from '../useField/useField.types';
import { WrapperVariant } from '../../models/common';
import { MuiPickersAdapter } from '../../models/muiPickersAdapter';

export interface PickerValueManager<TValue, TDate, TError> {
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

export interface PickerChangeHandlerContext<TError> {
  validationError: TError;
}

export type PickerChangeHandler<TValue, TError> = (
  value: TValue,
  context: PickerChangeHandlerContext<TError>,
) => void;

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

interface UsePickerValueAction<DraftValue, TError> {
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
  /**
   * Context passed from a deeper component (a field or a calendar).
   */
  contextFromField?: FieldChangeHandlerContext<TError>;
}

/**
 * Props used to handle the value that are common to all pickers.
 */
export interface UsePickerValueBaseProps<TValue, TError> {
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value?: TValue;
  /**
   * The default value.
   * Used when the component is not controlled.
   */
  defaultValue?: TValue;
  /**
   * Callback fired when the value changes.
   * @template TValue, TError
   * @param {TValue} value The new value.
   * @param {FieldChangeHandlerContext<TError>} The context containing the validation result of the current value.
   */
  onChange?: PickerChangeHandler<TValue, TError>;
  /**
   * Callback fired when the value is accepted.
   * @template TValue
   * @param {TValue} value The value that was just accepted.
   */
  onAccept?: (value: TValue) => void;
  /**
   * Callback fired when the error associated to the current value changes.
   * If the error has a non-null value, then the `TextField` will be rendered in `error` state.
   *
   * @template TValue, TError
   * @param {TError} error The new error describing why the current value is not valid.
   * @param {TValue} value The value associated to the error.
   */
  onError?: (error: TError, value: TValue) => void;
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
   * If `true`, the popover or modal will close after submitting the full date.
   * @default `true` for desktop, `false` for mobile (based on the chosen wrapper and `desktopModeMediaQuery` prop).
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
  /**
   * If `true`, on close will reset the value to the value when the picker was opened.
   *
   * Might make most sense when in need of resetting the value on modal dismiss/close.
   * @default `true` for mobile, `false` for desktop.
   */
  resetValueOnClose?: boolean;
}

/**
 * Props used to handle the value of the pickers.
 */
export interface UsePickerValueProps<TValue, TError>
  extends UsePickerValueBaseProps<TValue, TError>,
    UsePickerValueNonStaticProps<TValue> {}

export interface UsePickerValueParams<
  TValue,
  TDate,
  TExternalProps extends UsePickerValueProps<TValue, any>,
> {
  props: TExternalProps;
  valueManager: PickerValueManager<TValue, TDate, InferError<TExternalProps>>;
  wrapperVariant: WrapperVariant;
  validator: Validator<
    TValue,
    TDate,
    InferError<TExternalProps>,
    UseFieldValidationProps<TValue, TExternalProps>
  >;
}

export interface UsePickerValueActions {
  onAccept: () => void;
  onClear: () => void;
  onDismiss: () => void;
  onCancel: () => void;
  onSetToday: () => void;
  onOpen: () => void;
  onClose: () => void;
}

type UsePickerValueFieldResponse<TValue, TError> = Required<
  Pick<
    UseFieldInternalProps<TValue, TError>,
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
 * Props passed to `usePickerLayoutProps`.
 */
export interface UsePickerValueLayoutResponse<TValue> extends UsePickerValueActions {
  value: TValue;
  onChange: (newValue: TValue) => void;
  isValid: (value: TValue) => boolean;
}

export interface UsePickerValueResponse<TValue, TError> {
  open: boolean;
  actions: UsePickerValueActions;
  viewProps: UsePickerValueViewsResponse<TValue>;
  fieldProps: UsePickerValueFieldResponse<TValue, TError>;
  layoutProps: UsePickerValueLayoutResponse<TValue>;
}

/**
 * Manage the value lifecycle of all the pickers.
 */
export const usePickerValue = <
  TValue,
  TDate,
  TExternalProps extends UsePickerValueProps<TValue, any>,
>({
  props,
  valueManager,
  wrapperVariant,
  validator,
}: UsePickerValueParams<TValue, TDate, TExternalProps>): UsePickerValueResponse<
  TValue,
  InferError<TExternalProps>
> => {
  type TError = InferError<TExternalProps>;

  const {
    onAccept: onAcceptProp,
    onChange,
    value: inValue,
    defaultValue,
    closeOnSelect = wrapperVariant === 'desktop',
    selectedSections: selectedSectionsProp,
    onSelectedSectionsChange,
    resetValueOnClose = wrapperVariant !== 'desktop',
  } = props;

  const utils = useUtils<TDate>();
  const adapter = useLocalizationContext<TDate>();

  const [rawValue, setValue] = useControlled({
    controlled: inValue,
    default: defaultValue ?? valueManager.emptyValue,
    name: 'usePickerValue',
    state: 'value',
  });

  const value = React.useMemo(
    () => valueManager.cleanValue(utils, rawValue),
    [valueManager, utils, rawValue],
  );

  const [selectedSections, setSelectedSections] = useControlled({
    controlled: selectedSectionsProp,
    default: null,
    name: 'usePickerValue',
    state: 'selectedSections',
  });

  const { isOpen, setIsOpen } = useOpenState(props);

  const [dateState, setDateState] = React.useState<UsePickerValueState<TValue>>(() => ({
    committed: value,
    draft: value,
    resetFallback: value,
  }));

  useValidation(
    { ...props, value },
    validator,
    valueManager.isSameError,
    valueManager.defaultErrorState,
  );

  const setDate = useEventCallback((params: UsePickerValueAction<TValue, TError>) => {
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

      if (onChange) {
        const context: PickerChangeHandlerContext<TError> = {
          validationError:
            params.contextFromField == null
              ? validator({
                  adapter,
                  value: params.value,
                  props: { ...props, value: params.value },
                })
              : params.contextFromField.validationError,
        };

        onChange(params.value, context);
      }
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
  });

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
          if (closeOnSelect) {
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

  const handleChangeAndCommit = useEventCallback(
    (newValue: TValue, contextFromField?: FieldChangeHandlerContext<TError>) =>
      setDate({ action: 'setCommitted', value: newValue, contextFromField }),
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
    onDismiss: resetValueOnClose ? handleCancel : handleDismiss,
    onCancel: handleCancel,
    onSetToday: handleSetToday,
    onOpen: handleOpen,
    onClose: handleClose,
  };

  const fieldResponse: UsePickerValueFieldResponse<TValue, TError> = {
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

  const isValid = (testedValue: TValue) => {
    const validationResponse = validator({
      adapter,
      value: testedValue,
      props: { ...props, value: testedValue },
    });
    return Array.isArray(testedValue)
      ? (validationResponse as any[]).every((v) => v === null)
      : validationResponse === null;
  };

  const layoutResponse: UsePickerValueLayoutResponse<TValue> = {
    ...actions,
    value: dateState.draft,
    onChange: handleChangeAndCommit,
    isValid,
  };

  return {
    open: isOpen,
    fieldProps: fieldResponse,
    viewProps: viewResponse,
    layoutProps: layoutResponse,
    actions,
  };
};
