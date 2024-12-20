import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { useOpenState } from '../useOpenState';
import { useLocalizationContext, useUtils } from '../useUtils';
import { FieldChangeHandlerContext } from '../useField';
import { useValidation } from '../../../validation';
import { PickerChangeHandlerContext, InferError } from '../../../models';
import {
  PickerShortcutChangeImportance,
  PickersShortcutsItemContext,
} from '../../../PickersShortcuts';
import {
  UsePickerValueProps,
  UsePickerValueParams,
  UsePickerValueResponse,
  PickerValueUpdateAction,
  UsePickerValueState,
  UsePickerValueFieldResponse,
  UsePickerValueLayoutResponse,
  UsePickerValueViewsResponse,
  PickerSelectionState,
  PickerValueUpdaterParams,
  UsePickerValueContextValue,
  UsePickerValueProviderParams,
  UsePickerValueActionsContextValue,
  UsePickerValuePrivateContextValue,
} from './usePickerValue.types';
import { useValueWithTimezone } from '../useValueWithTimezone';
import { PickerValidValue } from '../../models';

/**
 * Decide if the new value should be published
 * The published value will be passed to `onChange` if defined.
 */
const shouldPublishValue = <TValue extends PickerValidValue, TError>(
  params: PickerValueUpdaterParams<TValue, TError>,
): boolean => {
  const { action, hasChanged, dateState, isControlled } = params;

  const isCurrentValueTheDefaultValue = !isControlled && !dateState.hasBeenModifiedSinceMount;

  // The field is responsible for only calling `onChange` when needed.
  if (action.name === 'setValueFromField') {
    return true;
  }

  if (action.name === 'setValueFromAction') {
    // If the component is not controlled, and the value has not been modified since the mount,
    // Then we want to publish the default value whenever the user pressed the "Accept", "Today" or "Clear" button.
    if (
      isCurrentValueTheDefaultValue &&
      ['accept', 'today', 'clear'].includes(action.pickerAction)
    ) {
      return true;
    }

    return hasChanged(dateState.lastPublishedValue);
  }

  if (action.name === 'setValueFromView' && action.selectionState !== 'shallow') {
    // On the first view,
    // If the value is not controlled, then clicking on any value (including the one equal to `defaultValue`) should call `onChange`
    if (isCurrentValueTheDefaultValue) {
      return true;
    }

    return hasChanged(dateState.lastPublishedValue);
  }

  if (action.name === 'setValueFromShortcut') {
    // On the first view,
    // If the value is not controlled, then clicking on any value (including the one equal to `defaultValue`) should call `onChange`
    if (isCurrentValueTheDefaultValue) {
      return true;
    }

    return hasChanged(dateState.lastPublishedValue);
  }

  return false;
};

/**
 * Decide if the new value should be committed.
 * The committed value will be passed to `onAccept` if defined.
 * It will also be used as a reset target when calling the `cancel` picker action (when clicking on the "Cancel" button).
 */
const shouldCommitValue = <TValue extends PickerValidValue, TError>(
  params: PickerValueUpdaterParams<TValue, TError>,
): boolean => {
  const { action, hasChanged, dateState, isControlled, closeOnSelect } = params;

  const isCurrentValueTheDefaultValue = !isControlled && !dateState.hasBeenModifiedSinceMount;

  if (action.name === 'setValueFromAction') {
    // If the component is not controlled, and the value has not been modified since the mount,
    // Then we want to commit the default value whenever the user pressed the "Accept", "Today" or "Clear" button.
    if (
      isCurrentValueTheDefaultValue &&
      ['accept', 'today', 'clear'].includes(action.pickerAction)
    ) {
      return true;
    }

    return hasChanged(dateState.lastCommittedValue);
  }

  if (action.name === 'setValueFromView' && action.selectionState === 'finish' && closeOnSelect) {
    // On picker where the 1st view is also the last view,
    // If the value is not controlled, then clicking on any value (including the one equal to `defaultValue`) should call `onAccept`
    if (isCurrentValueTheDefaultValue) {
      return true;
    }

    return hasChanged(dateState.lastCommittedValue);
  }

  if (action.name === 'setValueFromShortcut') {
    return action.changeImportance === 'accept' && hasChanged(dateState.lastCommittedValue);
  }

  return false;
};

/**
 * Decide if the picker should be closed after the value is updated.
 */
const shouldClosePicker = <TValue extends PickerValidValue, TError>(
  params: PickerValueUpdaterParams<TValue, TError>,
): boolean => {
  const { action, closeOnSelect } = params;

  if (action.name === 'setValueFromAction') {
    return true;
  }

  if (action.name === 'setValueFromView') {
    return action.selectionState === 'finish' && closeOnSelect;
  }

  if (action.name === 'setValueFromShortcut') {
    return action.changeImportance === 'accept';
  }

  return false;
};

/**
 * Manage the value lifecycle of all the pickers.
 */
export const usePickerValue = <
  TValue extends PickerValidValue,
  TExternalProps extends UsePickerValueProps<TValue, any>,
>({
  props,
  valueManager,
  valueType,
  variant,
  validator,
}: UsePickerValueParams<TValue, TExternalProps>): UsePickerValueResponse<
  TValue,
  InferError<TExternalProps>
> => {
  type TError = InferError<TExternalProps>;

  const {
    onAccept,
    onChange,
    value: inValueWithoutRenderTimezone,
    defaultValue: inDefaultValue,
    closeOnSelect = variant === 'desktop',
    timezone: timezoneProp,
    referenceDate,
  } = props;

  const { current: defaultValue } = React.useRef(inDefaultValue);
  const { current: isControlled } = React.useRef(inValueWithoutRenderTimezone !== undefined);
  const [previousTimezoneProp, setPreviousTimezoneProp] = React.useState(timezoneProp);

  /* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */
  if (process.env.NODE_ENV !== 'production') {
    React.useEffect(() => {
      if (isControlled !== (inValueWithoutRenderTimezone !== undefined)) {
        console.error(
          [
            `MUI X: A component is changing the ${
              isControlled ? '' : 'un'
            }controlled value of a picker to be ${isControlled ? 'un' : ''}controlled.`,
            'Elements should not switch from uncontrolled to controlled (or vice versa).',
            `Decide between using a controlled or uncontrolled value` +
              'for the lifetime of the component.',
            "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
            'More info: https://fb.me/react-controlled-components',
          ].join('\n'),
        );
      }
    }, [inValueWithoutRenderTimezone]);

    React.useEffect(() => {
      if (!isControlled && defaultValue !== inDefaultValue) {
        console.error(
          [
            `MUI X: A component is changing the defaultValue of an uncontrolled picker after being initialized. ` +
              `To suppress this warning opt to use a controlled value.`,
          ].join('\n'),
        );
      }
    }, [JSON.stringify(defaultValue)]);
  }
  /* eslint-enable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */

  const utils = useUtils();
  const adapter = useLocalizationContext();
  const { open, setOpen } = useOpenState(props);

  const {
    timezone,
    value: inValueWithTimezoneToRender,
    handleValueChange,
  } = useValueWithTimezone({
    timezone: timezoneProp,
    value: inValueWithoutRenderTimezone,
    defaultValue,
    referenceDate,
    onChange,
    valueManager,
  });

  const [dateState, setDateState] = React.useState<UsePickerValueState<TValue>>(() => {
    let initialValue: TValue;
    if (inValueWithTimezoneToRender !== undefined) {
      initialValue = inValueWithTimezoneToRender;
    } else if (defaultValue !== undefined) {
      initialValue = defaultValue;
    } else {
      initialValue = valueManager.emptyValue;
    }

    return {
      draft: initialValue,
      lastPublishedValue: initialValue,
      lastCommittedValue: initialValue,
      lastControlledValue: inValueWithoutRenderTimezone,
      hasBeenModifiedSinceMount: false,
    };
  });

  const timezoneFromDraftValue = valueManager.getTimezone(utils, dateState.draft);
  if (previousTimezoneProp !== timezoneProp) {
    setPreviousTimezoneProp(timezoneProp);

    if (timezoneProp && timezoneFromDraftValue && timezoneProp !== timezoneFromDraftValue) {
      setDateState((prev) => ({
        ...prev,
        draft: valueManager.setTimezone(utils, timezoneProp, prev.draft),
      }));
    }
  }

  const { getValidationErrorForNewValue } = useValidation({
    props,
    validator,
    timezone,
    value: dateState.draft,
    onError: props.onError,
  });

  const updateDate = useEventCallback((action: PickerValueUpdateAction<TValue, TError>) => {
    const updaterParams: PickerValueUpdaterParams<TValue, TError> = {
      action,
      dateState,
      hasChanged: (comparison) => !valueManager.areValuesEqual(utils, action.value, comparison),
      isControlled,
      closeOnSelect,
    };

    const shouldPublish = shouldPublishValue(updaterParams);
    const shouldCommit = shouldCommitValue(updaterParams);
    const shouldClose = shouldClosePicker(updaterParams);

    setDateState((prev) => ({
      ...prev,
      draft: action.value,
      lastPublishedValue: shouldPublish ? action.value : prev.lastPublishedValue,
      lastCommittedValue: shouldCommit ? action.value : prev.lastCommittedValue,
      hasBeenModifiedSinceMount: true,
    }));

    let cachedContext: PickerChangeHandlerContext<TError> | null = null;
    const getContext = (): PickerChangeHandlerContext<TError> => {
      if (!cachedContext) {
        const validationError =
          action.name === 'setValueFromField'
            ? action.context.validationError
            : getValidationErrorForNewValue(action.value);

        cachedContext = {
          validationError,
        };

        if (action.name === 'setValueFromShortcut') {
          cachedContext.shortcut = action.shortcut;
        }
      }

      return cachedContext;
    };

    if (shouldPublish) {
      handleValueChange(action.value, getContext());
    }

    if (shouldCommit && onAccept) {
      onAccept(action.value, getContext());
    }

    if (shouldClose) {
      setOpen(false);
    }
  });

  if (dateState.lastControlledValue !== inValueWithoutRenderTimezone) {
    const isUpdateComingFromPicker = valueManager.areValuesEqual(
      utils,
      dateState.draft,
      inValueWithTimezoneToRender,
    );

    setDateState((prev) => ({
      ...prev,
      lastControlledValue: inValueWithoutRenderTimezone,
      ...(isUpdateComingFromPicker
        ? {}
        : {
            lastCommittedValue: inValueWithTimezoneToRender,
            lastPublishedValue: inValueWithTimezoneToRender,
            draft: inValueWithTimezoneToRender,
            hasBeenModifiedSinceMount: true,
          }),
    }));
  }

  const handleChange = useEventCallback(
    (newValue: TValue, selectionState: PickerSelectionState = 'partial') =>
      updateDate({ name: 'setValueFromView', value: newValue, selectionState }),
  );

  const handleSelectShortcut = useEventCallback(
    (
      newValue: TValue,
      changeImportance: PickerShortcutChangeImportance,
      shortcut: PickersShortcutsItemContext,
    ) =>
      updateDate({
        name: 'setValueFromShortcut',
        value: newValue,
        changeImportance,
        shortcut,
      }),
  );

  const handleChangeFromField = useEventCallback(
    (newValue: TValue, context: FieldChangeHandlerContext<TError>) =>
      updateDate({ name: 'setValueFromField', value: newValue, context }),
  );

  const fieldResponse: UsePickerValueFieldResponse<TValue, TError> = {
    value: dateState.draft,
    onChange: handleChangeFromField,
  };

  const valueWithoutError = React.useMemo(
    () => valueManager.cleanValue(utils, dateState.draft),
    [utils, valueManager, dateState.draft],
  );

  const viewResponse: UsePickerValueViewsResponse<TValue> = {
    value: valueWithoutError,
    onChange: handleChange,
    open,
    setOpen,
  };

  const isValid = (testedValue: TValue) => {
    const error = validator({
      adapter,
      value: testedValue,
      timezone,
      props,
    });

    return !valueManager.hasError(error);
  };

  const layoutResponse: UsePickerValueLayoutResponse<TValue> = {
    value: valueWithoutError,
    onChange: handleChange,
    onSelectShortcut: handleSelectShortcut,
    isValid,
  };

  const clearValue = useEventCallback(() =>
    updateDate({
      value: valueManager.emptyValue,
      name: 'setValueFromAction',
      pickerAction: 'clear',
    }),
  );

  const setValueToToday = useEventCallback(() =>
    updateDate({
      value: valueManager.getTodayValue(utils, timezone, valueType),
      name: 'setValueFromAction',
      pickerAction: 'today',
    }),
  );

  const acceptValueChanges = useEventCallback(() =>
    updateDate({
      value: dateState.lastPublishedValue,
      name: 'setValueFromAction',
      pickerAction: 'accept',
    }),
  );

  const cancelValueChanges = useEventCallback(() =>
    updateDate({
      value: dateState.lastCommittedValue,
      name: 'setValueFromAction',
      pickerAction: 'cancel',
    }),
  );

  const dismissViews = useEventCallback(() => {
    updateDate({
      value: dateState.lastPublishedValue,
      name: 'setValueFromAction',
      pickerAction: 'dismiss',
    });
  });

  const actionsContextValue = React.useMemo<UsePickerValueActionsContextValue>(
    () => ({
      setOpen,
      clearValue,
      setValueToToday,
      acceptValueChanges,
      cancelValueChanges,
    }),
    [setOpen, clearValue, setValueToToday, acceptValueChanges, cancelValueChanges],
  );

  const contextValue = React.useMemo<UsePickerValueContextValue>(
    () => ({
      ...actionsContextValue,
      open,
    }),
    [actionsContextValue, open],
  );

  const privateContextValue = React.useMemo<UsePickerValuePrivateContextValue>(
    () => ({ dismissViews }),
    [dismissViews],
  );

  const providerParams: UsePickerValueProviderParams<TValue> = {
    value: valueWithoutError,
    contextValue,
    actionsContextValue,
    privateContextValue,
  };

  return {
    fieldProps: fieldResponse,
    viewProps: viewResponse,
    layoutProps: layoutResponse,
    provider: providerParams,
  };
};
