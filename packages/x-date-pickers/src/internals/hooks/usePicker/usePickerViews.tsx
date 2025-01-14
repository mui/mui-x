import * as React from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { useViews, UseViewsOptions } from '../useViews';
import type { UsePickerValueViewsResponse } from './usePickerValue.types';
import { isTimeView } from '../../utils/time-utils';
import {
  DateOrTimeViewWithMeridiem,
  PickerRangeValue,
  PickerValidValue,
  PickerValue,
} from '../../models';
import { FieldRef, PickerValidDate, TimezoneProps } from '../../../models';

export interface PickerViewsRendererBaseExternalProps
  extends Omit<UsePickerViewsProps<any, any, any>, 'openTo' | 'viewRenderers'> {}

export type PickerViewsRendererProps<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends PickerViewsRendererBaseExternalProps,
> = Omit<TExternalProps, 'className' | 'sx'> &
  Pick<UsePickerValueViewsResponse<TValue>, 'value' | 'onChange'> & {
    view: TView;
    views: readonly TView[];
    focusedView: TView | null;
    onFocusedViewChange: (viewToFocus: TView, hasFocus: boolean) => void;
    showViewSwitcher: boolean;
    timeViewsCount: number;
  };

export type PickerViewRenderer<
  TValue extends PickerValidValue,
  TExternalProps extends PickerViewsRendererBaseExternalProps,
> = (props: PickerViewsRendererProps<TValue, any, TExternalProps>) => React.ReactNode;

export type PickerViewRendererLookup<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends PickerViewsRendererBaseExternalProps,
> = Record<TView, PickerViewRenderer<TValue, TExternalProps> | null>;

/**
 * Props used to handle the views that are common to all pickers.
 */
export interface UsePickerViewsBaseProps<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UsePickerViewsProps<TValue, TView, any>,
> extends Omit<UseViewsOptions<any, TView>, 'onChange' | 'onFocusedViewChange' | 'focusedView'>,
    TimezoneProps {
  /**
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be used.
   */
  viewRenderers: PickerViewRendererLookup<TValue, TView, TExternalProps>;
  /**
   * If `true`, disable heavy animations.
   * @default `@media(prefers-reduced-motion: reduce)` || `navigator.userAgent` matches Android <10 or iOS <13
   */
  reduceAnimations?: boolean;
  /**
   * The date used to generate the new value when both `value` and `defaultValue` are empty.
   * @default The closest valid date-time using the validation props, except callbacks like `shouldDisable<...>`.
   */
  referenceDate?: PickerValidDate;
}

/**
 * Props used to handle the value of the pickers.
 */
export interface UsePickerViewsProps<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UsePickerViewsProps<TValue, TView, any>,
> extends UsePickerViewsBaseProps<TValue, TView, TExternalProps> {
  className?: string;
  sx?: SxProps<Theme>;
}

export interface UsePickerViewParams<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UsePickerViewsProps<TValue, TView, TExternalProps>,
> {
  props: TExternalProps;
  propsFromPickerValue: UsePickerValueViewsResponse<TValue>;
  autoFocusView: boolean;
  fieldRef?: React.RefObject<FieldRef<PickerValue> | FieldRef<PickerRangeValue> | null>;
  /**
   * A function that intercepts the regular picker rendering.
   * Can be used to consume the provided `viewRenderers` and render a custom component wrapping them.
   * @param {PickerViewRendererLookup<TValue, TView, TExternalProps>} viewRenderers The `viewRenderers` that were provided to the picker component.
   * @param {TView} popperView The current picker view.
   * @param {any} rendererProps All the props that are being passed down to the renderer.
   * @returns {React.ReactNode} A React node that will be rendered instead of the default renderer.
   */
  rendererInterceptor?: React.JSXElementConstructor<
    PickerRendererInterceptorProps<TValue, TView, TExternalProps>
  >;
}

export interface PickerRendererInterceptorProps<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UsePickerViewsProps<TValue, TView, TExternalProps>,
> {
  viewRenderers: PickerViewRendererLookup<TValue, TView, TExternalProps>;
  popperView: TView;
  rendererProps: PickerViewsRendererProps<TValue, TView, TExternalProps>;
}

export interface UsePickerViewsResponse<TView extends DateOrTimeViewWithMeridiem> {
  renderCurrentView: () => React.ReactNode;
  shouldRestoreFocus: () => boolean;
  provider: UsePickerViewsProviderParams<TView>;
}

export interface UsePickerViewsActionsContextValue<TView extends DateOrTimeViewWithMeridiem> {
  /**
   * Set the current view.
   * @template TView
   * @param {TView} view The view to render
   */
  setView: (view: TView) => void;
}

export interface UsePickerViewsContextValue<TView extends DateOrTimeViewWithMeridiem>
  extends UsePickerViewsActionsContextValue<TView> {
  /**
   * Available views.
   */
  views: readonly TView[];
  /**
   * View currently rendered.
   */
  view: TView | null;
}

export interface UsePickerViewsProviderParams<TView extends DateOrTimeViewWithMeridiem> {
  hasUIView: boolean;
  views: readonly TView[];
  contextValue: UsePickerViewsContextValue<TView>;
  actionsContextValue: UsePickerViewsActionsContextValue<TView>;
}

/**
 * Manage the views of all the pickers:
 * - Handles the view switch
 * - Handles the switch between UI views and field views
 * - Handles the focus management when switching views
 */
export const usePickerViews = <
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UsePickerViewsProps<TValue, TView, any>,
>({
  props,
  propsFromPickerValue,
  autoFocusView,
  rendererInterceptor: RendererInterceptor,
  fieldRef,
}: UsePickerViewParams<TValue, TView, TExternalProps>): UsePickerViewsResponse<TView> => {
  const { onChange, value, open, setOpen } = propsFromPickerValue;
  const { view: inView, views, openTo, onViewChange, viewRenderers, timezone } = props;
  const { className, sx, ...propsToForwardToView } = props;

  const { view, setView, defaultView, focusedView, setFocusedView, setValueAndGoToNextView } =
    useViews({
      view: inView,
      views,
      openTo,
      onChange,
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
  const shouldRestoreFocus = useEventCallback(() => currentViewMode === 'UI');

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

  const actionsContextValue = React.useMemo<UsePickerViewsActionsContextValue<TView>>(
    () => ({ setView }),
    [setView],
  );

  const contextValue = React.useMemo<UsePickerViewsContextValue<TView>>(
    () => ({
      ...actionsContextValue,
      views,
      view: popperView,
    }),
    [actionsContextValue, views, popperView],
  );

  const providerParams: UsePickerViewsProviderParams<TView> = {
    hasUIView,
    views,
    contextValue,
    actionsContextValue,
  };

  return {
    shouldRestoreFocus,
    provider: providerParams,
    renderCurrentView: () => {
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
        value,
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
    },
  };
};
