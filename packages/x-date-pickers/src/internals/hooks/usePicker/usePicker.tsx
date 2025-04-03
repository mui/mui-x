import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import useForkRef from '@mui/utils/useForkRef';
import useId from '@mui/utils/useId';
import {
  PickerViewsRendererProps,
  UsePickerParameters,
  UsePickerProps,
  UsePickerReturnValue,
} from './usePicker.types';
import {
  DateOrTimeViewWithMeridiem,
  PickerRangeValue,
  PickerValidValue,
  PickerValue,
} from '../../models';
import { useLocalizationContext, useUtils } from '../useUtils';
import { useReduceAnimations } from '../useReduceAnimations';
import { FieldRef, InferError, PickerOwnerState } from '../../../models';
import {
  PickerActionsContextValue,
  PickerContextValue,
  PickerPrivateContextValue,
} from '../../components/PickerProvider';
import { isTimeView } from '../../utils/time-utils';
import { useViews } from '../useViews';
import { PickerFieldPrivateContextValue } from '../useNullableFieldPrivateContext';
import { useOrientation } from './hooks/useOrientation';
import { useValueAndOpenStates } from './hooks/useValueAndOpenStates';

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
  getStepNavigation,
}: UsePickerParameters<TValue, TView, TExternalProps>): UsePickerReturnValue<TValue> => {
  type TError = InferError<TExternalProps>;

  const {
    // View props
    views,
    view: viewProp,
    openTo,
    onViewChange,
    viewRenderers,
    reduceAnimations: reduceAnimationsProp,
    orientation: orientationProp,
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

  const { className, sx, ...propsToForwardToView } = props;

  /**
   * TODO: Improve how we generate the aria-label and aria-labelledby attributes.
   */
  const labelId = useId();
  const utils = useUtils();
  const adapter = useLocalizationContext();
  const reduceAnimations = useReduceAnimations(reduceAnimationsProp);
  const orientation = useOrientation(views, orientationProp);
  const { current: initialView } = React.useRef<TView | null>(openTo ?? null);

  /**
   * Refs
   */
  const [triggerElement, triggerRef] = React.useState<HTMLElement | null>(null);
  const popupRef = React.useRef<HTMLElement>(null);
  const fieldRef = React.useRef<FieldRef<PickerValue> | FieldRef<PickerRangeValue> | null>(null);
  const rootRefObject = React.useRef<HTMLDivElement>(null);
  const rootRef = useForkRef(ref, rootRefObject);

  const { timezone, state, setOpen, setValue, setValueFromView, value, viewValue } =
    useValueAndOpenStates<TValue, TView, TExternalProps>({ props, valueManager, validator });

  const { view, setView, defaultView, focusedView, setFocusedView, setValueAndGoToNextView } =
    useViews({
      view: viewProp,
      views,
      openTo,
      onChange: setValueFromView,
      onViewChange,
      autoFocus: autoFocusView,
    });

  const clearValue = useEventCallback(() => setValue(valueManager.emptyValue));

  const setValueToToday = useEventCallback(() =>
    setValue(valueManager.getTodayValue(utils, timezone, valueType)),
  );

  const acceptValueChanges = useEventCallback(() => setValue(value));

  const cancelValueChanges = useEventCallback(() =>
    setValue(state.lastCommittedValue, { skipPublicationIfPristine: true }),
  );

  const dismissViews = useEventCallback(() => {
    setValue(value, {
      skipPublicationIfPristine: true,
    });
  });

  const { hasUIView, viewModeLookup, timeViewsCount } = React.useMemo(
    () =>
      views.reduce(
        (acc, viewForReduce) => {
          const viewMode = viewRenderers[viewForReduce] == null ? 'field' : 'UI';
          acc.viewModeLookup[viewForReduce] = viewMode;
          if (viewMode === 'UI') {
            acc.hasUIView = true;
            if (isTimeView(viewForReduce)) {
              acc.timeViewsCount += 1;
            }
          }

          return acc;
        },
        {
          hasUIView: false,
          viewModeLookup: {} as Record<TView, 'field' | 'UI'>,
          timeViewsCount: 0,
        },
      ),
    [viewRenderers, views],
  );

  const currentViewMode = viewModeLookup[view];
  const getCurrentViewMode = useEventCallback(() => currentViewMode);

  const [popperView, setPopperView] = React.useState<TView | null>(
    currentViewMode === 'UI' ? view : null,
  );
  if (popperView !== view && viewModeLookup[view] === 'UI') {
    setPopperView(view);
  }

  useEnhancedEffect(() => {
    // Handle case of Date Time Picker without time renderers
    if (currentViewMode === 'field' && state.open) {
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
    if (!state.open) {
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
  }, [state.open]); // eslint-disable-line react-hooks/exhaustive-deps

  const ownerState = React.useMemo<PickerOwnerState>(
    () => ({
      isPickerValueEmpty: valueManager.areValuesEqual(utils, value, valueManager.emptyValue),
      isPickerOpen: state.open,
      isPickerDisabled: props.disabled ?? false,
      isPickerReadOnly: props.readOnly ?? false,
      pickerOrientation: orientation,
      pickerVariant: variant,
    }),
    [utils, valueManager, value, state.open, orientation, variant, props.disabled, props.readOnly],
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

  const stepNavigation = getStepNavigation({
    setView,
    view,
    initialView: initialView ?? views[0],
    views,
  });
  const wrappedGoToNextStep = useEventCallback(stepNavigation.goToNextStep);

  const actionsContextValue = React.useMemo<PickerActionsContextValue<TValue, TView, TError>>(
    () => ({
      setValue,
      setOpen,
      clearValue,
      setValueToToday,
      acceptValueChanges,
      cancelValueChanges,
      setView,
      goToNextStep: wrappedGoToNextStep,
    }),
    [
      setValue,
      setOpen,
      clearValue,
      setValueToToday,
      acceptValueChanges,
      cancelValueChanges,
      setView,
      wrappedGoToNextStep,
    ],
  );

  const contextValue = React.useMemo<PickerContextValue<TValue, TView, TError>>(
    () => ({
      ...actionsContextValue,
      value,
      timezone,
      open: state.open,
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
      hasNextStep: stepNavigation.hasNextStep,
      fieldFormat: format ?? '',
      name,
      label,
      rootSx: sx,
      rootRef,
      rootClassName: className,
    }),
    [
      actionsContextValue,
      value,
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
      triggerStatus,
      stepNavigation.hasNextStep,
      timezone,
      state.open,
      popperView,
      views,
      initialView,
      autoFocus,
    ],
  );

  const privateContextValue = React.useMemo<PickerPrivateContextValue>(
    () => ({
      dismissViews,
      ownerState,
      hasUIView,
      getCurrentViewMode,
      rootRefObject,
      labelId,
      triggerElement,
      viewContainerRole,
    }),
    [
      dismissViews,
      ownerState,
      hasUIView,
      getCurrentViewMode,
      labelId,
      triggerElement,
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

  const isValidContextValue = (testedValue: TValue) => {
    const error = validator({
      adapter,
      value: testedValue,
      timezone,
      props,
    });

    return !valueManager.hasError(error);
  };

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
      value: viewValue,
      onChange: setValueAndGoToNextView,
      view: popperView,
      onViewChange: setView,
      showViewSwitcher: timeViewsCount > 1,
      timeViewsCount,
      ...(viewContainerRole === 'tooltip'
        ? { focusedView: null, onFocusedViewChange: () => {} }
        : {
            focusedView,
            onFocusedViewChange: setFocusedView,
          }),
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
      isValidContextValue,
    },
    renderCurrentView,
    ownerState,
  };
};
