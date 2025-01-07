import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { useOpenState } from '../useOpenState';
import { useLocalizationContext, useUtils } from '../useUtils';
import { useValidation } from '../../../validation';
import { PickerChangeHandlerContext, InferError } from '../../../models';
import {
  UsePickerValueProps,
  UsePickerValueParams,
  UsePickerValueResponse,
  UsePickerValueState,
  UsePickerValueFieldResponse,
  UsePickerValueViewsResponse,
  PickerSelectionState,
  UsePickerValueContextValue,
  UsePickerValueProviderParams,
  UsePickerValueActionsContextValue,
  UsePickerValuePrivateContextValue,
  SetValueActionOptions,
} from './usePickerValue.types';
import { useValueWithTimezone } from '../useValueWithTimezone';
import { PickerValidValue } from '../../models';

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
    closeOnSelect = false,
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

  const setValue = useEventCallback((newValue: TValue, options?: SetValueActionOptions<TError>) => {
    const {
      changeImportance = 'accept',
      skipPublicationIfPristine = false,
      validationError,
      shortcut,
    } = options ?? {};

    let shouldPublish: boolean;
    let shouldCommit: boolean;
    if (!skipPublicationIfPristine && !isControlled && !dateState.hasBeenModifiedSinceMount) {
      // If the value is not controlled and the value has never been modified before,
      // Then clicking on any value (including the one equal to `defaultValue`) should call `onChange` and `onAccept`
      shouldPublish = true;
      shouldCommit = changeImportance === 'accept';
    } else {
      shouldPublish = !valueManager.areValuesEqual(utils, newValue, dateState.lastPublishedValue);
      shouldCommit =
        changeImportance === 'accept' &&
        !valueManager.areValuesEqual(utils, newValue, dateState.lastCommittedValue);
    }

    setDateState((prev) => ({
      ...prev,
      draft: newValue,
      lastPublishedValue: shouldPublish ? newValue : prev.lastPublishedValue,
      lastCommittedValue: shouldCommit ? newValue : prev.lastCommittedValue,
      hasBeenModifiedSinceMount: true,
    }));

    let cachedContext: PickerChangeHandlerContext<TError> | null = null;
    const getContext = (): PickerChangeHandlerContext<TError> => {
      if (!cachedContext) {
        cachedContext = {
          validationError:
            validationError == null ? getValidationErrorForNewValue(newValue) : validationError,
        };

        if (shortcut) {
          cachedContext.shortcut = shortcut;
        }
      }

      return cachedContext;
    };

    if (shouldPublish) {
      handleValueChange(newValue, getContext());
    }

    if (shouldCommit && onAccept) {
      onAccept(newValue, getContext());
    }

    if (changeImportance === 'accept') {
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

  const isValid = (testedValue: TValue) => {
    const error = validator({
      adapter,
      value: testedValue,
      timezone,
      props,
    });

    return !valueManager.hasError(error);
  };

  const clearValue = useEventCallback(() => setValue(valueManager.emptyValue));

  const setValueToToday = useEventCallback(() =>
    setValue(valueManager.getTodayValue(utils, timezone, valueType)),
  );

  const acceptValueChanges = useEventCallback(() => setValue(dateState.lastPublishedValue));

  const cancelValueChanges = useEventCallback(() =>
    setValue(dateState.lastCommittedValue, { skipPublicationIfPristine: true }),
  );

  const dismissViews = useEventCallback(() => {
    setValue(dateState.lastPublishedValue, {
      skipPublicationIfPristine: true,
    });
  });

  const fieldResponse: UsePickerValueFieldResponse<TValue, TError> = {
    value: dateState.draft,
    onChange: (newValue, context) =>
      setValue(newValue, { validationError: context.validationError }),
  };

  const setValueFromView = useEventCallback(
    (newValue: TValue, selectionState: PickerSelectionState = 'partial') => {
      // TODO: Expose a new method (private?) like `setView` that only updates the draft value.
      if (selectionState === 'shallow') {
        setDateState((prev) => ({
          ...prev,
          draft: newValue,
          hasBeenModifiedSinceMount: true,
        }));
      }

      setValue(newValue, {
        changeImportance: selectionState === 'finish' && closeOnSelect ? 'accept' : 'set',
      });
    },
  );

  const valueWithoutError = React.useMemo(
    () => valueManager.cleanValue(utils, dateState.draft),
    [utils, valueManager, dateState.draft],
  );

  const viewResponse: UsePickerValueViewsResponse<TValue> = {
    value: valueWithoutError,
    onChange: setValueFromView,
    open,
    setOpen,
  };

  const actionsContextValue = React.useMemo<UsePickerValueActionsContextValue<TValue, TError>>(
    () => ({
      setValue,
      setOpen,
      clearValue,
      setValueToToday,
      acceptValueChanges,
      cancelValueChanges,
    }),
    [setValue, setOpen, clearValue, setValueToToday, acceptValueChanges, cancelValueChanges],
  );

  const contextValue = React.useMemo<UsePickerValueContextValue<TValue, TError>>(
    () => ({
      ...actionsContextValue,
      open,
      value: dateState.draft,
    }),
    [actionsContextValue, open, dateState.draft],
  );

  const privateContextValue = React.useMemo<UsePickerValuePrivateContextValue>(
    () => ({ dismissViews }),
    [dismissViews],
  );

  const providerParams: UsePickerValueProviderParams<TValue, TError> = {
    value: valueWithoutError,
    contextValue,
    actionsContextValue,
    privateContextValue,
    isValidContextValue: isValid,
  };

  return {
    fieldProps: fieldResponse,
    viewProps: viewResponse,
    provider: providerParams,
  };
};
