import * as React from 'react';
import { warnOnce } from '@mui/x-internals/warning';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import useForkRef from '@mui/utils/useForkRef';
import useId from '@mui/utils/useId';
import {
  PickerSelectionState,
  PickerViewsRendererProps,
  UsePickerParameters,
  UsePickerProps,
  UsePickerReturnValue,
  UsePickerValueState,
} from './usePicker.types';
import {
  DateOrTimeViewWithMeridiem,
  PickerRangeValue,
  PickerValidValue,
  PickerValue,
} from '../../models';
import { useLocalizationContext, useUtils } from '../useUtils';
import { useReduceAnimations } from '../useReduceAnimations';
import { usePickerOrientation } from './usePicker.utils';
import {
  FieldRef,
  InferError,
  PickerChangeHandlerContext,
  PickerOwnerState,
} from '../../../models';
import {
  PickerActionsContextValue,
  PickerContextValue,
  PickerPrivateContextValue,
  SetValueActionOptions,
} from '../../components/PickerProvider';
import { useValueWithTimezone } from '../useValueWithTimezone';
import { useOpenState } from '../useOpenState';
import { isTimeView } from '../../utils/time-utils';
import { useViews } from '../useViews';
import { useValidation } from '../../../validation';
import { PickerFieldPrivateContextValue } from '../useNullableFieldPrivateContext';

export const usePicker = <
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UsePickerProps<TValue, TView, any, any>,
>({
  ref,
  props,
  valueManager,
  valueType,
  variant,
  validator,
  autoFocusView,
  rendererInterceptor: RendererInterceptor,
  localeText,
  viewContainerRole,
}: UsePickerParameters<TValue, TView, TExternalProps>): UsePickerReturnValue<TValue> => {
  type TError = InferError<TExternalProps>;

  const {
    // Value props
    value: valueProp,
    defaultValue: defaultValueProp,
    onChange,
    referenceDate,
    timezone: timezoneProp,
    // View props
    views,
    view: viewProp,
    openTo,
    onViewChange,
    viewRenderers,
    reduceAnimations: reduceAnimationsProp,
    // Lifecycle props
    open: openProp,
    onOpen,
    onClose,
    onAccept,
    closeOnSelect,
    disableOpenPicker,
    // Form props
    disabled,
    readOnly,
    // Field props
    formatDensity,
    enableAccessibleFieldDOMStructure,
    selectedSections,
    onSelectedSectionsChange,
    format,
    label,
    // Other props
    autoFocus,
    name,
  } = props;

  const utils = useUtils();
  const adapter = useLocalizationContext();
  const reduceAnimations = useReduceAnimations(reduceAnimationsProp);
  const { open, setOpen } = useOpenState({ open: openProp, onOpen, onClose });

  /**
   * TODO: Improve how we generate the aria-label and aria-labelledby attributes.
   */
  const labelId = useId();

  const { className, sx, ...propsToForwardToView } = props;

  const { current: defaultValue } = React.useRef(defaultValueProp);
  const { current: isControlled } = React.useRef(valueProp !== undefined);
  const { current: initialView } = React.useRef<TView | null>(openTo ?? null);
  const triggerRef = React.useRef<HTMLElement>(null);
  const popupRef = React.useRef<HTMLElement>(null);
  const fieldRef = React.useRef<FieldRef<PickerValue> | FieldRef<PickerRangeValue> | null>(null);
  const rootRefObject = React.useRef<HTMLDivElement>(null);
  const rootRef = useForkRef(ref, rootRefObject);
  const [previousTimezoneProp, setPreviousTimezoneProp] = React.useState(timezoneProp);

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

  const orientation = usePickerOrientation(views, props.orientation);

  const { view, setView, defaultView, focusedView, setFocusedView, setValueAndGoToNextView } =
    useViews({
      view: viewProp,
      views,
      openTo,
      onChange: setValueFromView,
      onViewChange,
      autoFocus: autoFocusView,
    });

  const { hasUIView, viewModeLookup } = React.useMemo(
    () =>
      views.reduce(
        (acc, viewForReduce) => {
          let viewMode: 'field' | 'UI';
          if (viewRenderers[viewForReduce] != null) {
            viewMode = 'UI';
          } else {
            viewMode = 'field';
          }

          acc.viewModeLookup[viewForReduce] = viewMode;
          if (viewMode === 'UI') {
            acc.hasUIView = true;
          }

          return acc;
        },
        { hasUIView: false, viewModeLookup: {} as Record<TView, 'field' | 'UI'> },
      ),
    [viewRenderers, views],
  );

  const timeViewsCount = React.useMemo(
    () =>
      views.reduce((acc, viewForReduce) => {
        if (viewRenderers[viewForReduce] != null && isTimeView(viewForReduce)) {
          return acc + 1;
        }
        return acc;
      }, 0),
    [viewRenderers, views],
  );

  const currentViewMode = viewModeLookup[view];
  const doesTheCurrentViewHasAnUI = useEventCallback(() => currentViewMode === 'UI');

  const [popperView, setPopperView] = React.useState<TView | null>(
    currentViewMode === 'UI' ? view : null,
  );
  if (popperView !== view && viewModeLookup[view] === 'UI') {
    setPopperView(view);
  }

  useEnhancedEffect(() => {
    // Handle case of `DateTimePicker` without time renderers
    if (currentViewMode === 'field' && open) {
      setOpen(false);
      setTimeout(() => {
        fieldRef?.current?.setSelectedSections(view);
        // focusing the input before the range selection is done
        // calling it outside of timeout results in an inconsistent behavior between Safari And Chrome
        fieldRef?.current?.focusField(view);
      });
    }
  }, [view]); // eslint-disable-line react-hooks/exhaustive-deps

  useEnhancedEffect(() => {
    if (!open) {
      return;
    }

    let newView = view;

    // If the current view is a field view, go to the last popper view
    if (currentViewMode === 'field' && popperView != null) {
      newView = popperView;
    }

    // If the current view is not the default view and both are UI views
    if (
      newView !== defaultView &&
      viewModeLookup[newView] === 'UI' &&
      viewModeLookup[defaultView] === 'UI'
    ) {
      newView = defaultView;
    }

    if (newView !== view) {
      setView(newView);
    }
    setFocusedView(newView, true);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const ownerState = React.useMemo<PickerOwnerState>(
    () => ({
      isPickerValueEmpty: valueManager.areValuesEqual(
        utils,
        dateState.draft,
        valueManager.emptyValue,
      ),
      isPickerOpen: open,
      isPickerDisabled: props.disabled ?? false,
      isPickerReadOnly: props.readOnly ?? false,
      pickerOrientation: orientation,
      pickerVariant: variant,
    }),
    [
      utils,
      valueManager,
      dateState.draft,
      open,
      orientation,
      variant,
      props.disabled,
      props.readOnly,
    ],
  );

  const triggerStatus = React.useMemo(() => {
    if (disableOpenPicker || !hasUIView) {
      return 'hidden';
    }

    if (disabled || readOnly) {
      return 'disabled';
    }

    return 'enabled';
  }, [disableOpenPicker, hasUIView, disabled, readOnly]);

  const actionsContextValue = React.useMemo<PickerActionsContextValue<TValue, TView, TError>>(
    () => ({
      setValue,
      setOpen,
      clearValue,
      setValueToToday,
      acceptValueChanges,
      cancelValueChanges,
      setView,
    }),
    [
      setValue,
      setOpen,
      clearValue,
      setValueToToday,
      acceptValueChanges,
      cancelValueChanges,
      setView,
    ],
  );

  const contextValue = React.useMemo<PickerContextValue<TValue, TView, TError>>(
    () => ({
      ...actionsContextValue,
      value: dateState.draft,
      timezone,
      open,
      views,
      view: popperView,
      initialView,
      disabled: disabled ?? false,
      readOnly: readOnly ?? false,
      autoFocus: autoFocus ?? false,
      variant,
      orientation,
      popupRef,
      reduceAnimations,
      triggerRef,
      triggerStatus,
      fieldFormat: format ?? '',
      name,
      label,
      rootSx: sx,
      rootRef,
      rootClassName: className,
    }),
    [
      actionsContextValue,
      dateState.draft,
      rootRef,
      variant,
      orientation,
      reduceAnimations,
      disabled,
      readOnly,
      format,
      className,
      name,
      label,
      sx,
      triggerRef,
      triggerStatus,
      timezone,
      open,
      popperView,
      views,
      initialView,
      autoFocus,
    ],
  );

  const privateContextValue = React.useMemo<PickerPrivateContextValue>(
    () => ({
      dismissViews,
      hasUIView,
      doesTheCurrentViewHasAnUI,
      ownerState,
      rootRefObject,
      labelId,
      viewContainerRole,
    }),
    [
      dismissViews,
      hasUIView,
      doesTheCurrentViewHasAnUI,
      ownerState,
      rootRefObject,
      labelId,
      viewContainerRole,
    ],
  );

  const fieldPrivateContextValue = React.useMemo<PickerFieldPrivateContextValue>(
    () => ({
      formatDensity,
      enableAccessibleFieldDOMStructure,
      selectedSections,
      onSelectedSectionsChange,
      fieldRef,
    }),
    [
      formatDensity,
      enableAccessibleFieldDOMStructure,
      selectedSections,
      onSelectedSectionsChange,
      fieldRef,
    ],
  );

  const renderCurrentView = () => {
    if (popperView == null) {
      return null;
    }

    const renderer = viewRenderers[popperView];
    if (renderer == null) {
      return null;
    }

    const rendererProps: PickerViewsRendererProps<TValue, TView, TExternalProps> = {
      ...propsToForwardToView,
      views,
      timezone,
      value: valueWithoutError,
      onChange: setValueAndGoToNextView,
      view: popperView,
      onViewChange: setView,
      focusedView,
      onFocusedViewChange: setFocusedView,
      showViewSwitcher: timeViewsCount > 1,
      timeViewsCount,
    };

    if (RendererInterceptor) {
      return (
        <RendererInterceptor
          viewRenderers={viewRenderers}
          popperView={popperView}
          rendererProps={rendererProps}
        />
      );
    }

    return renderer(rendererProps);
  };

  return {
    providerProps: {
      localeText,
      contextValue,
      privateContextValue,
      actionsContextValue,
      fieldPrivateContextValue,
      isValidContextValue: isValid,
    },
    renderCurrentView,
    ownerState,
  };
};
