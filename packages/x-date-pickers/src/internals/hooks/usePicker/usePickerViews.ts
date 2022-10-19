import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { CalendarOrClockPickerView } from '../../models';
import { useViews } from '../useViews';
import { WrapperVariant } from '../../components/wrappers/WrapperVariantContext';
import type { UsePickerValueActions, UsePickerValueViewsResponse } from './usePickerValue';

type PickerViewRenderer<
  TValue,
  TView extends CalendarOrClockPickerView,
  TExternalProps extends UsePickerViewsProps<TView>,
  TAdditionalProps extends {},
> = (
  props: PickerViewsRendererProps<TValue, TView, TExternalProps, TAdditionalProps>,
) => React.ReactNode;

export type PickerViewRendererLookup<
  TValue,
  TView extends CalendarOrClockPickerView,
  TExternalProps extends UsePickerViewsProps<TView>,
  TAdditionalProps extends {},
> = {
  [K in TView]: PickerViewRenderer<TValue, TView, TExternalProps, TAdditionalProps> | null;
};

/**
 * Props used to handle the views of the pickers.
 * Those props are exposed on all the pickers.
 */
export interface UsePickerViewsProps<TView extends CalendarOrClockPickerView> {
  autoFocus?: boolean;
  /**
   * If `true`, the picker and text field are disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * First view to show.
   */
  openTo: TView;
  /**
   * Callback fired on view change.
   * @template View
   * @param {View} view The new view.
   */
  onViewChange?: (view: TView) => void;
  /**
   * Array of views to show.
   */
  views: readonly TView[];
  /**
   * Do not render open picker button (renders only the field).
   * @default false
   */
  disableOpenPicker?: boolean;
}

export interface UsePickerViewParams<
  TValue,
  TView extends CalendarOrClockPickerView,
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
  actions: UsePickerValueActions;
}

export interface UsePickerViewsResponse<TView extends CalendarOrClockPickerView> {
  hasPopperView: boolean;
  renderViews: () => React.ReactNode;
  shouldRestoreFocus: () => boolean;
  layoutProps: UsePickerViewsLayoutResponse<TView>;
}

export type PickerViewsRendererProps<
  TValue,
  TView extends CalendarOrClockPickerView,
  TExternalProps extends UsePickerViewsProps<TView>,
  TAdditionalProps extends {},
> = TExternalProps &
  TAdditionalProps &
  UsePickerValueViewsResponse<TValue> & {
    view: TView;
    views: readonly TView[];
    wrapperVariant: WrapperVariant;
  };

export interface UsePickerViewsLayoutResponse<TView extends CalendarOrClockPickerView> {
  view: TView | null;
  onViewChange: (view: TView) => void;
  views: readonly TView[];
}

let warnedOnceNotValidOpenTo = false;

export const usePickerViews = <
  TValue,
  TView extends CalendarOrClockPickerView,
  TExternalProps extends UsePickerViewsProps<TView>,
  TAdditionalProps extends {},
>({
  props,
  propsFromPickerValue,
  viewLookup,
  additionalViewProps,
  inputRef,
  wrapperVariant,
  actions,
}: UsePickerViewParams<
  TValue,
  TView,
  TExternalProps,
  TAdditionalProps
>): UsePickerViewsResponse<TView> => {
  const { onChange, open, onSelectedSectionsChange } = propsFromPickerValue;
  const { views, openTo, onViewChange, disableOpenPicker } = props;

  if (process.env.NODE_ENV !== 'production') {
    if (!warnedOnceNotValidOpenTo && !views.includes(openTo)) {
      console.warn(
        `MUI: \`openTo="${openTo}"\` is not a valid prop.`,
        `It must be an element of \`views=["${views.join('", "')}"]\`.`,
      );
      warnedOnceNotValidOpenTo = true;
    }
  }

  // TODO v6: Support focus management

  // TODO v6: Stop using `useViews` ?
  const { openView, setOpenView, handleChangeAndOpenNext } = useViews({
    view: undefined,
    views,
    openTo,
    onChange,
    onViewChange,
  });

  const { hasPopperView, viewModeLookup } = React.useMemo(() => {
    let tempHasPopperView = false;
    const tempViewModeLookup = {} as Record<TView, 'field' | 'popper'>;

    views.forEach((view) => {
      let viewMode: 'field' | 'popper';
      if (disableOpenPicker) {
        viewMode = 'field';
      } else if (viewLookup[view] != null) {
        viewMode = 'popper';
      } else {
        viewMode = 'field';
      }

      if (viewMode === 'popper') {
        tempHasPopperView = true;
      }

      tempViewModeLookup[view] = viewMode;
    });

    return { hasPopperView: tempHasPopperView, viewModeLookup: tempViewModeLookup };
  }, [disableOpenPicker, viewLookup, views]);

  const currentViewMode = viewModeLookup[openView];
  const shouldRestoreFocus = useEventCallback(() => currentViewMode === 'popper');

  const [popperView, setPopperView] = React.useState<TView | null>(
    currentViewMode === 'popper' ? openView : null,
  );
  if (popperView !== openView && viewModeLookup[openView] === 'popper') {
    setPopperView(openView);
  }

  useEnhancedEffect(() => {
    if (currentViewMode === 'field' && open) {
      actions.onClose();
      onSelectedSectionsChange('hour');

      setTimeout(() => {
        inputRef?.current!.focus();
      });
    }
  }, [openView]); // eslint-disable-line react-hooks/exhaustive-deps

  useEnhancedEffect(() => {
    if (!open) {
      return;
    }

    if (currentViewMode === 'field' && popperView != null) {
      setOpenView(popperView);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const layoutProps: UsePickerViewsLayoutResponse<TView> = {
    views,
    view: popperView,
    onViewChange: setOpenView,
  };

  return {
    hasPopperView,
    shouldRestoreFocus,
    layoutProps,
    renderViews: () => {
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
        view: popperView,
        views,
        onChange: handleChangeAndOpenNext,
      });
    },
  };
};
