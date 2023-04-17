import * as React from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { DateOrTimeView } from '../../../models';
import { useViews, UseViewsOptions } from '../useViews';
import type { UsePickerValueViewsResponse } from './usePickerValue.types';
import { isTimeView } from '../../utils/time-utils';

interface PickerViewsRendererBaseExternalProps<TView extends DateOrTimeView>
  extends Omit<UsePickerViewsProps<any, TView, any, any>, 'openTo' | 'viewRenderers'> {}

export type PickerViewsRendererProps<
  TValue,
  TView extends DateOrTimeView,
  TExternalProps extends PickerViewsRendererBaseExternalProps<TView>,
  TAdditionalProps extends {},
> = TExternalProps &
  TAdditionalProps &
  UsePickerValueViewsResponse<TValue> & {
    view: TView;
    views: readonly TView[];
    focusedView: TView | null;
    onFocusedViewChange: (viewToFocus: TView, hasFocus: boolean) => void;
  };

type PickerViewRenderer<
  TValue,
  TView extends DateOrTimeView,
  TExternalProps extends PickerViewsRendererBaseExternalProps<TView>,
  TAdditionalProps extends {},
> = (
  props: PickerViewsRendererProps<TValue, TView, TExternalProps, TAdditionalProps>,
) => React.ReactNode;

export type PickerViewRendererLookup<
  TValue,
  TView extends DateOrTimeView,
  TExternalProps extends PickerViewsRendererBaseExternalProps<TView>,
  TAdditionalProps extends {},
> = {
  [K in TView]: PickerViewRenderer<TValue, TView, TExternalProps, TAdditionalProps> | null;
};

/**
 * Props used to handle the views that are common to all pickers.
 */
export interface UsePickerViewsBaseProps<
  TValue,
  TView extends DateOrTimeView,
  TExternalProps extends UsePickerViewsProps<TValue, TView, any, any>,
  TAdditionalProps extends {},
> extends Omit<UseViewsOptions<any, TView>, 'onChange' | 'onFocusedViewChange' | 'focusedView'> {
  /**
   * If `true`, the picker and text field are disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be the used.
   */
  viewRenderers: PickerViewRendererLookup<TValue, TView, TExternalProps, TAdditionalProps>;
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
  TValue,
  TView extends DateOrTimeView,
  TExternalProps extends UsePickerViewsProps<TValue, TView, any, any>,
  TAdditionalProps extends {},
> extends UsePickerViewsBaseProps<TValue, TView, TExternalProps, TAdditionalProps>,
    UsePickerViewsNonStaticProps {
  className?: string;
  sx?: SxProps<Theme>;
}

export interface UsePickerViewParams<
  TValue,
  TView extends DateOrTimeView,
  TExternalProps extends UsePickerViewsProps<TValue, TView, TExternalProps, TAdditionalProps>,
  TAdditionalProps extends {},
> {
  props: TExternalProps;
  propsFromPickerValue: UsePickerValueViewsResponse<TValue>;
  additionalViewProps: TAdditionalProps;
  inputRef?: React.RefObject<HTMLInputElement>;
  autoFocusView: boolean;
}

export interface UsePickerViewsResponse<TView extends DateOrTimeView> {
  /**
   * Does the picker have at least one view that should be rendered in UI mode ?
   * If not, we can hide the icon to open the picker.
   */
  hasUIView: boolean;
  renderCurrentView: () => React.ReactNode;
  shouldRestoreFocus: () => boolean;
  layoutProps: UsePickerViewsLayoutResponse<TView>;
}

export interface UsePickerViewsLayoutResponse<TView extends DateOrTimeView> {
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
  TValue,
  TView extends DateOrTimeView,
  TExternalProps extends UsePickerViewsProps<TValue, TView, any, any>,
  TAdditionalProps extends {},
>({
  props,
  propsFromPickerValue,
  additionalViewProps,
  inputRef,
  autoFocusView,
}: UsePickerViewParams<
  TValue,
  TView,
  TExternalProps,
  TAdditionalProps
>): UsePickerViewsResponse<TView> => {
  const { onChange, open, onSelectedSectionsChange, onClose } = propsFromPickerValue;
  const { views, openTo, onViewChange, disableOpenPicker, viewRenderers } = props;
  const { className, sx, ...propsToForwardToView } = props;

  const { view, setView, defaultView, focusedView, setFocusedView, setValueAndGoToNextView } =
    useViews({
      view: undefined,
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
          if (disableOpenPicker) {
            viewMode = 'field';
          } else if (viewRenderers[viewForReduce] != null) {
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
    [disableOpenPicker, viewRenderers, views],
  );

  const hasMultipleUITimeView = React.useMemo(() => {
    const numberUITimeViews = views.reduce((acc, viewForReduce) => {
      if (viewRenderers[viewForReduce] != null && isTimeView(viewForReduce)) {
        return acc + 1;
      }
      return acc;
    }, 0);

    return numberUITimeViews > 1;
  }, [viewRenderers, views]);

  const currentViewMode = viewModeLookup[view];
  const shouldRestoreFocus = useEventCallback(() => currentViewMode === 'UI');

  const [popperView, setPopperView] = React.useState<TView | null>(
    currentViewMode === 'UI' ? view : null,
  );
  if (popperView !== view && viewModeLookup[view] === 'UI') {
    setPopperView(view);
  }

  useEnhancedEffect(() => {
    if (currentViewMode === 'field' && open) {
      onClose();
      onSelectedSectionsChange('hours');

      setTimeout(() => {
        inputRef?.current!.focus();
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

      return renderer({
        ...propsToForwardToView,
        ...additionalViewProps,
        ...propsFromPickerValue,
        views,
        onChange: setValueAndGoToNextView,
        view: popperView,
        onViewChange: setView,
        focusedView,
        onFocusedViewChange: setFocusedView,
        showViewSwitcher: hasMultipleUITimeView,
      });
    },
  };
};
