import * as React from 'react';
import { warnOnce } from '@mui/x-internals/warning';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import {
  DateOrTimeViewWithMeridiem,
  PickerOrientation,
  PickerValidValue,
  PickerValueManager,
} from '../../models';
import { arrayIncludes } from '../../utils/utils';
import { PickerSelectionState, UsePickerProps, UsePickerValueState } from './usePicker.types';
import { useValueWithTimezone } from '../useValueWithTimezone';
import { useLocalizationContext, useUtils } from '../useUtils';
import { InferError, PickerChangeHandlerContext } from '../../../models';
import { SetValueActionOptions } from '../../components/PickerProvider';
import { Validator } from '../../../validation';
import { useOpenState } from '../useOpenState';

function getOrientation(): PickerOrientation {
  if (typeof window === 'undefined') {
    return 'portrait';
  }

  if (window.screen && window.screen.orientation && window.screen.orientation.angle) {
    return Math.abs(window.screen.orientation.angle) === 90 ? 'landscape' : 'portrait';
  }

  // Support IOS safari
  if (window.orientation) {
    return Math.abs(Number(window.orientation)) === 90 ? 'landscape' : 'portrait';
  }

  return 'portrait';
}

export function usePickerOrientation(
  views: readonly DateOrTimeViewWithMeridiem[],
  customOrientation: PickerOrientation | undefined,
): PickerOrientation {
  const [orientation, setOrientation] = React.useState(getOrientation);

  useEnhancedEffect(() => {
    const eventHandler = () => {
      setOrientation(getOrientation());
    };
    window.addEventListener('orientationchange', eventHandler);
    return () => {
      window.removeEventListener('orientationchange', eventHandler);
    };
  }, []);

  if (arrayIncludes(views, ['hours', 'minutes', 'seconds'])) {
    // could not display 13:34:44 in landscape mode
    return 'portrait';
  }

  return customOrientation ?? orientation;
}

export function usePickerDateState<
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
  const { current: isControlled } = React.useRef(valueProp !== undefined);
  const [previousTimezoneProp, setPreviousTimezoneProp] = React.useState(timezoneProp);
  const adapter = useLocalizationContext();
  const utils = useUtils();
  const { open, setOpen } = useOpenState({ open: openProp, onOpen, onClose });

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
      if (isControlled !== (valueProp !== undefined)) {
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
    }, [valueProp]);

    React.useEffect(() => {
      if (!isControlled && defaultValue !== defaultValueProp) {
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
  } = useValueWithTimezone({
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    referenceDate,
    onChange,
    valueManager,
  });

  const [dateState, setDateState] = React.useState<UsePickerValueState<TValue>>(() => {
    let initialValue: TValue;
    if (valuePropWithTimezoneToRender !== undefined) {
      initialValue = valuePropWithTimezoneToRender;
    } else if (defaultValue !== undefined) {
      initialValue = defaultValue;
    } else {
      initialValue = valueManager.emptyValue;
    }

    return {
      draft: initialValue,
      lastPublishedValue: initialValue,
      lastCommittedValue: initialValue,
      lastControlledValue: valueProp,
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
            validationError == null
              ? validator({ adapter, value: newValue, timezone, props })
              : validationError,
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

  if (dateState.lastControlledValue !== valueProp) {
    const isUpdateComingFromPicker = valueManager.areValuesEqual(
      utils,
      dateState.draft,
      valuePropWithTimezoneToRender,
    );

    setDateState((prev) => ({
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

  return { open, setOpen, timezone, dateState, setValue, setValueFromView };
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
