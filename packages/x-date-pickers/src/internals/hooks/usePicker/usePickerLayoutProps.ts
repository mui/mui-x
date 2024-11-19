import { useRtl } from '@mui/system/RtlProvider';
import { useIsLandscape } from '../useIsLandscape';
import { UsePickerValueLayoutResponse } from './usePickerValue.types';
import { UsePickerViewsLayoutResponse } from './usePickerViews';
import { DateOrTimeViewWithMeridiem, PickerVariant } from '../../models/common';
import { FormProps } from '../../models';

/**
 * Props used to create the layout of the views.
 */
interface UsePickerLayoutProps extends FormProps {
  /**
   * Force rendering in particular orientation.
   */
  orientation?: 'portrait' | 'landscape';
}

export interface UsePickerLayoutPropsResponseLayoutProps<
  TValue,
  TView extends DateOrTimeViewWithMeridiem,
> extends UsePickerValueLayoutResponse<TValue>,
    UsePickerViewsLayoutResponse<TView>,
    UsePickerLayoutProps {
  isLandscape: boolean;
  isRtl: boolean;
  wrapperVariant: PickerVariant;
  isValid: (value: TValue) => boolean;
}

export interface UsePickerLayoutPropsResponse<TValue, TView extends DateOrTimeViewWithMeridiem> {
  layoutProps: UsePickerLayoutPropsResponseLayoutProps<TValue, TView>;
}

export interface UsePickerLayoutPropsParams<TValue, TView extends DateOrTimeViewWithMeridiem> {
  props: UsePickerLayoutProps;
  propsFromPickerValue: UsePickerValueLayoutResponse<TValue>;
  propsFromPickerViews: UsePickerViewsLayoutResponse<TView>;
  variant: PickerVariant;
}

/**
 * Prepare the props for the view layout (managed by `PickersLayout`)
 */
export const usePickerLayoutProps = <TValue, TView extends DateOrTimeViewWithMeridiem>({
  props,
  propsFromPickerValue,
  propsFromPickerViews,
  variant,
}: UsePickerLayoutPropsParams<TValue, TView>): UsePickerLayoutPropsResponse<TValue, TView> => {
  const { orientation } = props;
  const isLandscape = useIsLandscape(propsFromPickerViews.views, orientation);
  const isRtl = useRtl();

  const layoutProps: UsePickerLayoutPropsResponseLayoutProps<TValue, TView> = {
    ...propsFromPickerViews,
    ...propsFromPickerValue,
    isLandscape,
    isRtl,
    wrapperVariant: variant,
    disabled: props.disabled,
    readOnly: props.readOnly,
  };

  return { layoutProps };
};
