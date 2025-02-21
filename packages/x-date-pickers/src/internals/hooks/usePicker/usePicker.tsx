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
import { usePickerDateState, usePickerOrientation } from './usePicker.utils';
import { FieldRef, InferError, PickerOwnerState } from '../../../models';
import {
  PickerActionsContextValue,
  PickerContextValue,
  PickerPrivateContextValue,
} from '../../components/PickerProvider';
import { isTimeView } from '../../utils/time-utils';
import { useViews } from '../useViews';
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
    // View props
    views,
    view: viewProp,
    openTo,
    onViewChange,
    viewRenderers,
    reduceAnimations: reduceAnimationsProp,
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

  /**
   * TODO: Improve how we generate the aria-label and aria-labelledby attributes.
   */
  const labelId = useId();

  const { className, sx, ...propsToForwardToView } = props;

  const { current: initialView } = React.useRef<TView | null>(openTo ?? null);
  const triggerRef = React.useRef<HTMLElement>(null);
  const popupRef = React.useRef<HTMLElement>(null);
  const fieldRef = React.useRef<FieldRef<PickerValue> | FieldRef<PickerRangeValue> | null>(null);
  const rootRefObject = React.useRef<HTMLDivElement>(null);
  const rootRef = useForkRef(ref, rootRefObject);

  const { open, setOpen, timezone, dateState, setValue, setValueFromView } = usePickerDateState<
    TValue,
    TView,
    TExternalProps
  >({ props, valueManager, validator });

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
      isValidContextValue: isValid,
    },
    renderCurrentView,
    ownerState,
  };
};
