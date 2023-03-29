import * as React from 'react';
import { unstable_useControlled as useControlled } from '@mui/utils';
import useEventCallback from '@mui/utils/useEventCallback';
import { useOpenState } from '../useOpenState';
import { useLocalizationContext, useUtils } from '../useUtils';
import { FieldChangeHandlerContext, UseFieldInternalProps } from '../useField';
import { InferError, useValidation, Validator } from '../validation/useValidation';
import { UseFieldValidationProps } from '../useField/useField.types';
import { WrapperVariant } from '../../models/common';
import { MuiPickersAdapter } from '../../models/muiPickersAdapter';
import { FieldSection, FieldSelectedSections } from '../../../models';

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
   * Date internally used on the views and displayed in the input.
   * It is updated whenever the user modifies a step.
   */
  draft: TValue;
  /**
   * Last value published (e.g: the last value passed to `onChange` if it was defined).
   */
  lastPublishedValue: TValue;
  /**
   * Last value committed (e.g: the last value passed to `onAccept` if it was defined).
   */
  lastCommittedValue: TValue;
  /**
   * Last value passed with `props.value`.
   */
  lastControlledValue: TValue | undefined;
  hasBeenCommittedSinceMount: boolean;
}

type UsePickerValueAction<TValue, TError> =
  | {
      action: 'setValueFromView';
      value: TValue;
      selectionState: PickerSelectionState;
    }
  | {
      action: 'setValueFromField';
      value: TValue;
      context: FieldChangeHandlerContext<TError>;
    }
  | {
      action: 'setValueFromAction';
      value: TValue;
      pickerAction: 'accept' | 'today' | 'cancel' | 'dismiss' | 'clear';
    }
  | {
      action: 'setValueFromOutside';
      value: TValue;
    };

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
   * @template TValue The value type. Will be either the same type as `value` or `null`. Can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. Will be either `string` or a `null`. Can be in `[start, end]` format in case of range value.
   * @param {TValue} value The new value.
   * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
   */
  onChange?: PickerChangeHandler<TValue, TError>;
  /**
   * Callback fired when the value is accepted.
   * @template TValue The value type. Will be either the same type as `value` or `null`. Can be in `[start, end]` format in case of range value.
   * @param {TValue} value The value that was just accepted.
   */
  onAccept?: (value: TValue) => void;
  /**
   * Callback fired when the error associated to the current value changes.
   * If the error has a non-null value, then the `TextField` will be rendered in `error` state.
   *
   * @template TValue The value type. Will be either the same type as `value` or `null`. Can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. Will be either `string` or a `null`. Can be in `[start, end]` format in case of range value.
   * @param {TError} error The new error describing why the current value is not valid.
   * @param {TValue} value The value associated to the error.
   */
  onError?: (error: TError, value: TValue) => void;
}

/**
 * Props used to handle the value of non-static pickers.
 */
export interface UsePickerValueNonStaticProps<TValue, TSection extends FieldSection>
  extends Pick<
    UseFieldInternalProps<TValue, TSection, unknown>,
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
   * Use in controlled mode (see `open`).
   */
  onClose?: () => void;
  /**
   * Callback fired when the popup requests to be opened.
   * Use in controlled mode (see `open`).
   */
  onOpen?: () => void;
}

/**
 * Props used to handle the value of the pickers.
 */
export interface UsePickerValueProps<TValue, TSection extends FieldSection, TError>
  extends UsePickerValueBaseProps<TValue, TError>,
    UsePickerValueNonStaticProps<TValue, TSection> {}

export interface UsePickerValueParams<
  TValue,
  TDate,
  TSection extends FieldSection,
  TExternalProps extends UsePickerValueProps<TValue, TSection, any>,
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

type UsePickerValueFieldResponse<TValue, TSection extends FieldSection, TError> = Required<
  Pick<
    UseFieldInternalProps<TValue, TSection, TError>,
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

export interface UsePickerValueResponse<TValue, TSection extends FieldSection, TError> {
  open: boolean;
  actions: UsePickerValueActions;
  viewProps: UsePickerValueViewsResponse<TValue>;
  fieldProps: UsePickerValueFieldResponse<TValue, TSection, TError>;
  layoutProps: UsePickerValueLayoutResponse<TValue>;
}

/**
 * Manage the value lifecycle of all the pickers.
 */
export const usePickerValue = <
  TValue,
  TDate,
  TSection extends FieldSection,
  TExternalProps extends UsePickerValueProps<TValue, TSection, any>,
>({
  props,
  valueManager,
  wrapperVariant,
  validator,
}: UsePickerValueParams<TValue, TDate, TSection, TExternalProps>): UsePickerValueResponse<
  TValue,
  TSection,
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
  } = props;

  const utils = useUtils<TDate>();
  const adapter = useLocalizationContext<TDate>();

  const [selectedSections, setSelectedSections] = useControlled({
    controlled: selectedSectionsProp,
    default: null,
    name: 'usePickerValue',
    state: 'selectedSections',
  });

  const { isOpen, setIsOpen } = useOpenState(props);

  const [dateState, setDateState] = React.useState<UsePickerValueState<TValue>>(() => {
    let initialValue: TValue;
    if (inValue !== undefined) {
      initialValue = inValue;
    } else if (defaultValue !== undefined) {
      initialValue = defaultValue;
    } else {
      initialValue = valueManager.emptyValue;
    }

    return {
      draft: initialValue,
      lastPublishedValue: initialValue,
      lastCommittedValue: initialValue,
      lastControlledValue: inValue,
      hasBeenCommittedSinceMount: false,
    };
  });

  useValidation(
    { ...props, value: dateState.draft },
    validator,
    valueManager.isSameError,
    valueManager.defaultErrorState,
  );

  const setDate = useEventCallback((params: UsePickerValueAction<TValue, TError>) => {
    const isActionWorthPublishing =
      ['setValueFromField', 'setValueFromAction'].includes(params.action) ||
      (params.action === 'setValueFromView' && params.selectionState !== 'shallow');
    const isEqualToLastPublishedValue = valueManager.areValuesEqual(
      utils,
      dateState.lastPublishedValue,
      params.value,
    );
    const isPublished = isActionWorthPublishing && !isEqualToLastPublishedValue;

    const isCurrentValueTheDefaultValue =
      inValue === undefined && !dateState.hasBeenCommittedSinceMount;

    let isCommitted: boolean = false;
    if (params.action === 'setValueFromAction') {
      if (isCurrentValueTheDefaultValue && params.pickerAction === 'accept') {
        isCommitted = true;
      } else {
        isCommitted = !valueManager.areValuesEqual(
          utils,
          dateState.lastCommittedValue,
          params.value,
        );
      }
    } else if (
      params.action === 'setValueFromView' &&
      params.selectionState === 'finish' &&
      closeOnSelect
    ) {
      if (isCurrentValueTheDefaultValue) {
        isCommitted = true;
      } else {
        isCommitted = !valueManager.areValuesEqual(
          utils,
          dateState.lastCommittedValue,
          params.value,
        );
      }
    }

    setDateState((prev) => ({
      ...prev,
      draft: params.value,
      lastPublishedValue: isPublished ? params.value : prev.lastPublishedValue,
      lastCommittedValue: isCommitted ? params.value : prev.lastCommittedValue,
      hasBeenCommittedSinceMount: prev.hasBeenCommittedSinceMount || isCommitted,
    }));

    if (onChange && isPublished) {
      const validationError =
        params.action === 'setValueFromField'
          ? params.context.validationError
          : validator({
              adapter,
              value: params.value,
              props: { ...props, value: params.value },
            });

      const context: PickerChangeHandlerContext<TError> = {
        validationError,
      };

      onChange(params.value, context);
    }

    const shouldClose =
      params.action === 'setValueFromAction' ||
      (params.action === 'setValueFromView' && params.selectionState === 'finish' && closeOnSelect);

    if (shouldClose) {
      setIsOpen(false);
    }

    if (isCommitted && onAcceptProp) {
      onAcceptProp(params.value);
    }
  });

  React.useEffect(() => {
    if (isOpen && inValue !== undefined) {
      setDateState((prev) => ({ ...prev, lastCommittedValue: inValue }));
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (
    inValue !== undefined &&
    (dateState.lastControlledValue === undefined ||
      !valueManager.areValuesEqual(utils, dateState.lastControlledValue, inValue))
  ) {
    setDateState((prev) => ({ ...prev, lastControlledValue: inValue, draft: inValue }));
  }

  const handleClear = useEventCallback(() => {
    // Reset all date in state to the empty value and close picker.
    setDate({
      value: valueManager.emptyValue,
      action: 'setValueFromAction',
      pickerAction: 'clear',
    });
  });

  const handleAccept = useEventCallback(() => {
    // Set all date in state to equal the current draft value and close picker.
    setDate({
      value: dateState.draft,
      action: 'setValueFromAction',
      pickerAction: 'accept',
    });
  });

  const handleDismiss = useEventCallback(() => {
    // Set all dates in state to equal the last committed date.
    // e.g. Reset the state to the last committed value.
    setDate({ value: dateState.draft, action: 'setValueFromAction', pickerAction: 'dismiss' });
  });

  const handleCancel = useEventCallback(() => {
    // Set all dates in state to equal the last accepted date and close picker.
    // e.g. Reset the state to the last accepted value
    setDate({
      value: dateState.lastCommittedValue,
      action: 'setValueFromAction',
      pickerAction: 'cancel',
    });
  });

  const handleSetToday = useEventCallback(() => {
    // Set all dates in state to equal today and close picker.
    setDate({
      value: valueManager.getTodayValue(utils),
      action: 'setValueFromAction',
      pickerAction: 'today',
    });
  });

  const handleOpen = useEventCallback(() => setIsOpen(true));

  const handleClose = useEventCallback(() => setIsOpen(false));

  const handleChange = useEventCallback(
    (newValue: TValue, selectionState: PickerSelectionState = 'partial') =>
      setDate({ action: 'setValueFromView', value: newValue, selectionState }),
  );

  const handleChangeField = useEventCallback(
    (newValue: TValue, context: FieldChangeHandlerContext<TError>) =>
      setDate({ action: 'setValueFromField', value: newValue, context }),
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

  const fieldResponse: UsePickerValueFieldResponse<TValue, TSection, TError> = {
    value: dateState.draft,
    onChange: handleChangeField,
    selectedSections,
    onSelectedSectionsChange: handleFieldSelectedSectionsChange,
  };

  const viewValue = React.useMemo(
    () => valueManager.cleanValue(utils, dateState.draft),
    [utils, valueManager, dateState.draft],
  );

  const viewResponse: UsePickerValueViewsResponse<TValue> = {
    value: viewValue,
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
    value: viewValue,
    onChange: handleChange,
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
