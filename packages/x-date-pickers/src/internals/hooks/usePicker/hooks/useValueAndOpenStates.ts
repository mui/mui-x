import * as React from 'react';
import { warnOnce } from '@mui/x-internals/warning';
import useEventCallback from '@mui/utils/useEventCallback';
import { DateOrTimeViewWithMeridiem, PickerValidValue, PickerValueManager } from '../../../models';
import { PickerSelectionState, UsePickerProps, UsePickerState } from '../usePicker.types';
import { useControlledValue } from '../../useControlledValue';
import { useUtils } from '../../useUtils';
import { InferError, PickerChangeHandlerContext } from '../../../../models';
import { SetValueActionOptions } from '../../../components/PickerProvider';
import { useValidation, Validator } from '../../../../validation';

export function useValueAndOpenStates<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UsePickerProps<TValue, TView, any, any>,
>(parameters: UsePickerDateStateParameters<TValue, TView, TExternalProps>) {
  type TError = InferError<TExternalProps>;

  const { props, valueManager, validator } = parameters;
  const {
    value: valueProp,
    defaultValue: defaultValueProp,
    onChange,
    referenceDate,
    timezone: timezoneProp,
    onAccept,
    closeOnSelect,
    open: openProp,
    onOpen,
    onClose,
  } = props;

  const { current: defaultValue } = React.useRef(defaultValueProp);
  const { current: isValueControlled } = React.useRef(valueProp !== undefined);
  const { current: isOpenControlled } = React.useRef(openProp !== undefined);
  const [previousTimezoneProp, setPreviousTimezoneProp] = React.useState(timezoneProp);
  const utils = useUtils();

  if (process.env.NODE_ENV !== 'production') {
    if ((props as any).renderInput != null) {
      warnOnce([
        'MUI X: The `renderInput` prop has been removed in version 6.0 of the Date and Time Pickers.',
        'You can replace it with the `textField` component slot in most cases.',
        'For more information, please have a look at the migration guide (https://mui.com/x/migration/migration-pickers-v5/#input-renderer-required-in-v5).',
      ]);
    }
  }

  /* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */
  if (process.env.NODE_ENV !== 'production') {
    React.useEffect(() => {
      if (isValueControlled !== (valueProp !== undefined)) {
        console.error(
          [
            `MUI X: A component is changing the ${
              isValueControlled ? '' : 'un'
            }controlled value of a picker to be ${isValueControlled ? 'un' : ''}controlled.`,
            'Elements should not switch from uncontrolled to controlled (or vice versa).',
            `Decide between using a controlled or uncontrolled value` +
              'for the lifetime of the component.',
            "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
            'More info: https://fb.me/react-controlled-components',
          ].join('\n'),
        );
      }
    }, [valueProp]);

    React.useEffect(() => {
      if (!isValueControlled && defaultValue !== defaultValueProp) {
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

  const {
    timezone,
    value: valuePropWithTimezoneToRender,
    handleValueChange,
  } = useControlledValue({
    name: 'a picker component',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    referenceDate,
    onChange,
    valueManager,
  });

  const [state, setState] = React.useState<UsePickerState<TValue>>(() => {
    let initialValue: TValue;
    if (valuePropWithTimezoneToRender !== undefined) {
      initialValue = valuePropWithTimezoneToRender;
    } else if (defaultValue !== undefined) {
      initialValue = defaultValue;
    } else {
      initialValue = valueManager.emptyValue;
    }

    return {
      open: false,
      draft: initialValue,
      lastPublishedValue: initialValue,
      lastCommittedValue: initialValue,
      lastControlledValue: valueProp,
      hasBeenModifiedSinceMount: false,
    };
  });

  const { getValidationErrorForNewValue } = useValidation({
    props,
    validator,
    timezone,
    value: state.draft,
    onError: props.onError,
  });

  const timezoneFromDraftValue = valueManager.getTimezone(utils, state.draft);
  if (previousTimezoneProp !== timezoneProp) {
    setPreviousTimezoneProp(timezoneProp);

    if (timezoneProp && timezoneFromDraftValue && timezoneProp !== timezoneFromDraftValue) {
      setState((prev) => ({
        ...prev,
        draft: valueManager.setTimezone(utils, timezoneProp, prev.draft),
      }));
    }
  }

  const setOpen = useEventCallback((action: React.SetStateAction<boolean>) => {
    const newOpen = typeof action === 'function' ? action(state.open) : action;
    if (!isOpenControlled) {
      setState((prevState) => ({ ...prevState, open: newOpen }));
    }

    if (newOpen && onOpen) {
      onOpen();
    }

    if (!newOpen && onClose) {
      onClose();
    }
  });

  const setValue = useEventCallback((newValue: TValue, options?: SetValueActionOptions<TError>) => {
    const {
      changeImportance = 'accept',
      skipPublicationIfPristine = false,
      validationError,
      shortcut,
      shouldClose = changeImportance === 'accept',
    } = options ?? {};

    let shouldPublish: boolean;
    let shouldCommit: boolean;
    if (!skipPublicationIfPristine && !isValueControlled && !state.hasBeenModifiedSinceMount) {
      // If the value is not controlled and the value has never been modified before,
      // Then clicking on any value (including the one equal to `defaultValue`) should call `onChange` and `onAccept`
      shouldPublish = true;
      shouldCommit = changeImportance === 'accept';
    } else {
      shouldPublish = !valueManager.areValuesEqual(utils, newValue, state.lastPublishedValue);
      shouldCommit =
        changeImportance === 'accept' &&
        !valueManager.areValuesEqual(utils, newValue, state.lastCommittedValue);
    }

    setState((prev) => ({
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

    if (shouldClose) {
      setOpen(false);
    }
  });

  if (state.lastControlledValue !== valueProp) {
    const isUpdateComingFromPicker = valueManager.areValuesEqual(
      utils,
      state.draft,
      valuePropWithTimezoneToRender,
    );

    setState((prev) => ({
      ...prev,
      lastControlledValue: valueProp,
      ...(isUpdateComingFromPicker
        ? {}
        : {
            lastCommittedValue: valuePropWithTimezoneToRender,
            lastPublishedValue: valuePropWithTimezoneToRender,
            draft: valuePropWithTimezoneToRender,
            hasBeenModifiedSinceMount: true,
          }),
    }));
  }

  const setValueFromView = useEventCallback(
    (newValue: TValue, selectionState: PickerSelectionState = 'partial') => {
      // TODO: Expose a new method (private?) like `setView` that only updates the draft value.
      if (selectionState === 'shallow') {
        setState((prev) => ({
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

  // It is required to update inner state in useEffect in order to avoid situation when
  // Our component is not mounted yet, but `open` state is set to `true` (for example initially opened)
  React.useEffect(() => {
    if (isOpenControlled) {
      if (openProp === undefined) {
        throw new Error('You must not mix controlling and uncontrolled mode for `open` prop');
      }

      setState((prevState) => ({ ...prevState, open: openProp }));
    }
  }, [isOpenControlled, openProp]);

  return { timezone, state, setValue, setValueFromView, setOpen };
}

interface UsePickerDateStateParameters<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UsePickerProps<TValue, TView, any, any>,
> {
  props: TExternalProps;
  valueManager: PickerValueManager<TValue, InferError<TExternalProps>>;
  validator: Validator<TValue, InferError<TExternalProps>, TExternalProps>;
}
