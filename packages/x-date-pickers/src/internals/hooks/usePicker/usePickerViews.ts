import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { CalendarOrClockPickerView } from '../../models';
import { useViews } from '../useViews';
import { WrapperVariant } from '../../components/wrappers/WrapperVariantContext';
import type { UsePickerValueActions, UsePickerValueViewsResponse } from './usePickerValue';

type PickerViewRenderer<TValue, TView extends CalendarOrClockPickerView, TViewProps extends {}> = (
  props: PickerViewsRendererProps<TValue, TView, TViewProps>,
) => React.ReactNode;

export type PickerDateSectionModeLookup<TView extends CalendarOrClockPickerView> = Record<
  TView,
  'field' | 'popper'
>;

/**
 * Props used to handle the views of the pickers.
 * Those props are exposed on all the pickers.
 */
export interface ExportedUsePickerViewProps<TView extends CalendarOrClockPickerView> {
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

/**
 * Props received by `usePickerViews`.
 * It contains both the props passed by the pickers and the props passed by `usePickerValue`.
 */
export interface UsePickerViewsProps<TValue, TView extends CalendarOrClockPickerView>
  extends ExportedUsePickerViewProps<TView>,
    UsePickerValueViewsResponse<TValue> {}

export interface UsePickerViewParams<
  TValue,
  TView extends CalendarOrClockPickerView,
  TViewProps extends {},
> {
  props: UsePickerViewsProps<TValue, TView>;
  renderViews: PickerViewRenderer<TValue, TView, TViewProps>;
  sectionModeLookup?: PickerDateSectionModeLookup<TView>;
  additionalViewProps: TViewProps;
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
  TViewProps extends {},
> = TViewProps &
  Pick<UsePickerViewsProps<TValue, TView>, 'value' | 'onChange' | 'views' | 'autoFocus'> & {
    view: TView;
    onViewChange: (view: TView) => void;
    value: TValue;
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
  TViewProps extends {},
>({
  props,
  renderViews,
  sectionModeLookup: inputSectionModelLookup,
  additionalViewProps,
  inputRef,
  wrapperVariant,
  actions,
}: UsePickerViewParams<TValue, TView, TViewProps>): UsePickerViewsResponse<TView> => {
  const { views, openTo, onViewChange, onChange, disableOpenPicker, ...other } = props;

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

  const viewModeResponse = React.useMemo(() => {
    let hasPopperView = false;
    const sectionModeLookup = {} as PickerDateSectionModeLookup<TView>;

    views.forEach((view) => {
      let viewMode: 'field' | 'popper';
      if (disableOpenPicker) {
        viewMode = 'field';
      } else {
        viewMode = inputSectionModelLookup?.[view] ?? 'popper';
      }

      if (viewMode === 'popper') {
        hasPopperView = true;
      }

      sectionModeLookup[view] = viewMode;
    });

    return {
      hasPopperView,
      sectionModeLookup,
    };
  }, [disableOpenPicker, inputSectionModelLookup, views]);

  const currentViewMode = viewModeResponse.sectionModeLookup[openView];
  const shouldRestoreFocus = useEventCallback(() => currentViewMode === 'popper');

  const [popperView, setPopperView] = React.useState<TView | null>(
    currentViewMode === 'popper' ? openView : null,
  );
  if (popperView !== openView && viewModeResponse.sectionModeLookup[openView] === 'popper') {
    setPopperView(openView);
  }

  useEnhancedEffect(() => {
    if (currentViewMode === 'field' && props.open) {
      actions.onClose();
      props.onSelectedSectionsChange('hour');

      setTimeout(() => {
        inputRef?.current!.focus();
      });
    }
  }, [openView]); // eslint-disable-line react-hooks/exhaustive-deps

  useEnhancedEffect(() => {
    if (!props.open) {
      return;
    }

    if (currentViewMode === 'field' && popperView != null) {
      setOpenView(popperView);
    }
  }, [props.open]); // eslint-disable-line react-hooks/exhaustive-deps

  const layoutProps: UsePickerViewsLayoutResponse<TView> = {
    views,
    view: popperView,
    onViewChange: setOpenView,
  };

  return {
    ...viewModeResponse,
    shouldRestoreFocus,
    layoutProps,
    renderViews: () => {
      if (popperView == null) {
        return null;
      }

      return renderViews({
        view: popperView,
        onViewChange: setOpenView,
        onChange: handleChangeAndOpenNext,
        views,
        wrapperVariant,
        ...actions,
        ...other,
        ...additionalViewProps,
      });
    },
  };
};
