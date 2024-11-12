import * as React from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { useViews, UseViewsOptions } from '../useViews';
import type { UsePickerValueViewsResponse } from './usePickerValue.types';
import { isTimeView } from '../../utils/time-utils';
import { DateOrTimeViewWithMeridiem } from '../../models';
import { FieldRef, PickerValidDate, TimezoneProps } from '../../../models';

interface PickerViewsRendererBaseExternalProps<TView extends DateOrTimeViewWithMeridiem>
  extends Omit<UsePickerViewsProps<any, TView, any, any>, 'openTo' | 'viewRenderers'> {}

export type PickerViewsRendererProps<
  TIsRange extends boolean,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends PickerViewsRendererBaseExternalProps<TView>,
  TAdditionalProps extends {},
> = Omit<TExternalProps, 'className' | 'sx'> &
  TAdditionalProps &
  UsePickerValueViewsResponse<TIsRange> & {
    view: TView;
    views: readonly TView[];
    focusedView: TView | null;
    onFocusedViewChange: (viewToFocus: TView, hasFocus: boolean) => void;
    showViewSwitcher: boolean;
    timeViewsCount: number;
  };

export type PickerViewRenderer<
  TIsRange extends boolean,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends PickerViewsRendererBaseExternalProps<TView>,
  TAdditionalProps extends {},
> = (
  props: PickerViewsRendererProps<TIsRange, TView, TExternalProps, TAdditionalProps>,
) => React.ReactNode;

export type PickerViewRendererLookup<
  TIsRange extends boolean,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends PickerViewsRendererBaseExternalProps<any>,
  TAdditionalProps extends {},
> = {
  [K in TView]: PickerViewRenderer<TIsRange, K, TExternalProps, TAdditionalProps> | null;
};

/**
 * Props used to handle the views that are common to all pickers.
 */
export interface UsePickerViewsBaseProps<
  TIsRange extends boolean,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UsePickerViewsProps<TIsRange, TView, any, any>,
  TAdditionalProps extends {},
> extends Omit<UseViewsOptions<any, TView>, 'onChange' | 'onFocusedViewChange' | 'focusedView'>,
    TimezoneProps {
  /**
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be used.
   */
  viewRenderers: PickerViewRendererLookup<TIsRange, TView, TExternalProps, TAdditionalProps>;
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
 * Props used to handle the views of the pickers.
 */
export interface UsePickerViewsNonStaticProps {
  /**
   * If `true`, the open picker button will not be rendered (renders only the field).
   * @default false
   */
  disableOpenPicker?: boolean;
}

/**
 * Props used to handle the value of the pickers.
 */
export interface UsePickerViewsProps<
  TIsRange extends boolean,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UsePickerViewsProps<TIsRange, TView, any, any>,
  TAdditionalProps extends {},
> extends UsePickerViewsBaseProps<TIsRange, TView, TExternalProps, TAdditionalProps> {
  className?: string;
  sx?: SxProps<Theme>;
}

export interface UsePickerViewParams<
  TIsRange extends boolean,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UsePickerViewsProps<TIsRange, TView, TExternalProps, TAdditionalProps>,
  TAdditionalProps extends {},
> {
  props: TExternalProps;
  propsFromPickerValue: UsePickerValueViewsResponse<TIsRange>;
  additionalViewProps: TAdditionalProps;
  autoFocusView: boolean;
  fieldRef: React.RefObject<FieldRef<TIsRange>> | undefined;
  /**
   * A function that intercepts the regular picker rendering.
   * Can be used to consume the provided `viewRenderers` and render a custom component wrapping them.
   * @param {PickerViewRendererLookup<TIsRange, TView, TExternalProps, TAdditionalProps>} viewRenderers The `viewRenderers` that were provided to the picker component.
   * @param {TView} popperView The current picker view.
   * @param {any} rendererProps All the props that are being passed down to the renderer.
   * @returns {React.ReactNode} A React node that will be rendered instead of the default renderer.
   */
  rendererInterceptor?: (
    viewRenderers: PickerViewRendererLookup<TIsRange, TView, TExternalProps, TAdditionalProps>,
    popperView: TView,
    rendererProps: PickerViewsRendererProps<TIsRange, TView, TExternalProps, TAdditionalProps>,
  ) => React.ReactNode;
}

export interface UsePickerViewsResponse<TView extends DateOrTimeViewWithMeridiem> {
  /**
   * Indicates if the the picker has at least one view that should be rendered in UI.
   */
  hasUIView: boolean;
  renderCurrentView: () => React.ReactNode;
  shouldRestoreFocus: () => boolean;
  layoutProps: UsePickerViewsLayoutResponse<TView>;
}

export interface UsePickerViewsLayoutResponse<TView extends DateOrTimeViewWithMeridiem> {
  view: TView | null;
  onViewChange: (view: TView) => void;
  views: readonly TView[];
}

/**
 * Manage the views of all the pickers:
 * - Handles the view switch
 * - Handles the switch between UI views and field views
 * - Handles the focus management when switching views
 */
export const usePickerViews = <
  TIsRange extends boolean,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UsePickerViewsProps<TIsRange, TView, any, any>,
  TAdditionalProps extends {},
>({
  props,
  propsFromPickerValue,
  additionalViewProps,
  autoFocusView,
  rendererInterceptor,
  fieldRef,
}: UsePickerViewParams<
  TIsRange,
  TView,
  TExternalProps,
  TAdditionalProps
>): UsePickerViewsResponse<TView> => {
  const { onChange, open, onClose } = propsFromPickerValue;
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
      onClose();
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

  const layoutProps: UsePickerViewsLayoutResponse<TView> = {
    views,
    view: popperView,
    onViewChange: setView,
  };

  return {
    hasUIView,
    shouldRestoreFocus,
    layoutProps,
    renderCurrentView: () => {
      if (popperView == null) {
        return null;
      }

      const renderer = viewRenderers[popperView];
      if (renderer == null) {
        return null;
      }

      const rendererProps: PickerViewsRendererProps<
        TIsRange,
        TView,
        TExternalProps,
        TAdditionalProps
      > = {
        ...propsToForwardToView,
        ...additionalViewProps,
        ...propsFromPickerValue,
        views,
        timezone,
        onChange: setValueAndGoToNextView,
        view: popperView,
        onViewChange: setView,
        focusedView,
        onFocusedViewChange: setFocusedView,
        showViewSwitcher: timeViewsCount > 1,
        timeViewsCount,
      };

      if (rendererInterceptor) {
        return rendererInterceptor(viewRenderers, popperView, rendererProps);
      }

      return renderer(rendererProps);
    },
  };
};
