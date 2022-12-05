import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { DateOrTimeView } from '../../models';
import { useViews, UseViewsOptions } from '../useViews';
import { WrapperVariant } from '../../components/wrappers/WrapperVariantContext';
import type { UsePickerValueViewsResponse } from './usePickerValue';

type PickerViewRenderer<
  TValue,
  TView extends DateOrTimeView,
  TExternalProps extends UsePickerViewsProps<TView>,
  TAdditionalProps extends {},
> = (
  props: PickerViewsRendererProps<TValue, TView, TExternalProps, TAdditionalProps>,
) => React.ReactNode;

export type PickerViewRendererLookup<
  TValue,
  TView extends DateOrTimeView,
  TExternalProps extends UsePickerViewsProps<TView>,
  TAdditionalProps extends {},
> = {
  [K in TView]: PickerViewRenderer<TValue, TView, TExternalProps, TAdditionalProps> | null;
};

/**
 * Props used to handle the views that are common to all pickers.
 */
export interface UsePickerViewsBaseProps<TView extends DateOrTimeView>
  extends Omit<UseViewsOptions<any, TView>, 'onChange'> {
  /**
   * If `true`, the picker and text field are disabled.
   * @default false
   */
  disabled?: boolean;
}

/**
 * Props used to handle the views of the pickers.
 */
export interface UsePickerViewsNonStaticProps {
  /**
   * Do not render open picker button (renders only the field).
   * @default false
   */
  disableOpenPicker?: boolean;
}

/**
 * Props used to handle the value of the pickers.
 */
export interface UsePickerViewsProps<TView extends DateOrTimeView>
  extends UsePickerViewsBaseProps<TView>,
    UsePickerViewsNonStaticProps {}

export interface UsePickerViewParams<
  TValue,
  TView extends DateOrTimeView,
  TExternalProps extends UsePickerViewsProps<TView>,
  TAdditionalProps extends {},
> {
  props: TExternalProps;
  propsFromPickerValue: UsePickerValueViewsResponse<TValue>;
  /**
   * Define the view renderer for each section.
   * If no component is defined, then the view will be editing with the field.
   */
  viewLookup: PickerViewRendererLookup<TValue, TView, TExternalProps, TAdditionalProps>;
  additionalViewProps: TAdditionalProps;
  inputRef?: React.RefObject<HTMLInputElement>;
  wrapperVariant: WrapperVariant;
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

export type PickerViewsRendererProps<
  TValue,
  TView extends DateOrTimeView,
  TExternalProps extends UsePickerViewsProps<TView>,
  TAdditionalProps extends {},
> = TExternalProps &
  TAdditionalProps &
  UsePickerValueViewsResponse<TValue> & {
    view: TView;
    views: readonly TView[];
    wrapperVariant: WrapperVariant;
    focusedView: TView | null;
    onFocusedViewChange: (viewToFocus: TView, hasFocus: boolean) => void;
  };

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
  TExternalProps extends UsePickerViewsProps<TView>,
  TAdditionalProps extends {},
>({
  props,
  propsFromPickerValue,
  viewLookup,
  additionalViewProps,
  inputRef,
  wrapperVariant,
}: UsePickerViewParams<
  TValue,
  TView,
  TExternalProps,
  TAdditionalProps
>): UsePickerViewsResponse<TView> => {
  const { onChange, open, onSelectedSectionsChange, onClose } = propsFromPickerValue;
  const { views, openTo, onViewChange, disableOpenPicker, autoFocus } = props;

  const { view, setView, focusedView, setFocusedView, setValueAndGoToNextView } = useViews({
    view: undefined,
    views,
    openTo,
    onChange,
    onViewChange,
    autoFocus,
  });

  const { hasUIView, viewModeLookup } = React.useMemo(
    () =>
      views.reduce(
        (acc, viewForReduce) => {
          let viewMode: 'field' | 'UI';
          if (disableOpenPicker) {
            viewMode = 'field';
          } else if (viewLookup[viewForReduce] != null) {
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
    [disableOpenPicker, viewLookup, views],
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

    if (currentViewMode === 'field' && popperView != null) {
      setView(popperView);
    }
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

      const renderer = viewLookup?.[popperView];
      if (renderer == null) {
        return null;
      }

      return renderer({
        ...props,
        ...additionalViewProps,
        ...propsFromPickerValue,
        wrapperVariant,
        views,
        onChange: setValueAndGoToNextView,
        view: popperView,
        onViewChange: setView,
        focusedView,
        onFocusedViewChange: setFocusedView,
      });
    },
  };
};
