import { useIsLandscape } from '../useIsLandscape';
import { UsePickerValueActions, UsePickerValueLayoutResponse } from './usePickerValue';
import { UsePickerViewsLayoutResponse } from './usePickerViews';
import { CalendarOrClockPickerView } from '../../models/views';
import { WrapperVariant } from '../../components/wrappers/WrapperVariantContext';

/**
 * Props used to create the layout of the views.
 * Those props are exposed on all the pickers.
 */
export interface ExportedUsePickerLayoutProps {
  disabled?: boolean;
  readOnly?: boolean;
  showToolbar?: boolean;
  /**
   * Force rendering in particular orientation.
   */
  orientation?: 'portrait' | 'landscape';
}

/**
 * Props received by `usePickerLayout`.
 * It contains both the props passed by the pickers and the props passed by `usePickerValue` and `usePickerViews`.
 */
interface UsePickerLayoutProps<TValue, TView extends CalendarOrClockPickerView>
  extends ExportedUsePickerLayoutProps,
    UsePickerValueLayoutResponse<TValue>,
    UsePickerViewsLayoutResponse<TView> {}

export interface UsePickerLayoutResponseLayoutProps<TValue, TView extends CalendarOrClockPickerView>
  extends UsePickerValueLayoutResponse<TValue>,
    UsePickerViewsLayoutResponse<TView>,
    UsePickerLayoutProps<TValue, TView>,
    UsePickerValueActions {
  isLandscape: boolean;
  wrapperVariant: WrapperVariant;
}

export interface UsePickerLayoutResponse<TValue, TView extends CalendarOrClockPickerView> {
  layoutProps: UsePickerLayoutResponseLayoutProps<TValue, TView>;
  isLandscape: boolean;
}

export interface UsePickerLayoutParams<TValue, TView extends CalendarOrClockPickerView> {
  props: UsePickerLayoutProps<TValue, TView>;
  wrapperVariant: WrapperVariant;
  actions: UsePickerValueActions;
}

export const usePickerLayout = <TValue, TView extends CalendarOrClockPickerView>({
  props,
  wrapperVariant,
  actions,
}: UsePickerLayoutParams<TValue, TView>): UsePickerLayoutResponse<TValue, TView> => {
  const isLandscape = useIsLandscape(props.views, props.orientation);

  const layoutProps: UsePickerLayoutResponseLayoutProps<TValue, TView> = {
    ...actions,
    isLandscape,
    wrapperVariant,
    disabled: props.disabled,
    readOnly: props.readOnly,
    showToolbar: props.showToolbar,
    onChange: props.onChange,
    value: props.value,
    view: props.view,
    onViewChange: props.onViewChange,
    views: props.views,
  };

  return {
    layoutProps,
    isLandscape,
  };
};
