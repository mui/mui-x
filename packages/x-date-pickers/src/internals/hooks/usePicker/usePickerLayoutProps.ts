import { useRtl } from '@mui/system/RtlProvider';
import { useIsLandscape } from '../useIsLandscape';
import { UsePickerValueLayoutResponse } from './usePickerValue.types';
import { UsePickerViewsLayoutResponse } from './usePickerViews';
import { DateOrTimeViewWithMeridiem, WrapperVariant } from '../../models/common';
import { FormProps, InferPickerValue } from '../../models';

/**
 * Props used to create the layout of the views.
 * Those props are exposed on all the pickers.
 */
export interface UsePickerLayoutProps extends FormProps {
  /**
   * Force rendering in particular orientation.
   */
  orientation?: 'portrait' | 'landscape';
}

export interface UsePickerLayoutPropsResponseLayoutProps<
  TIsRange extends boolean,
  TView extends DateOrTimeViewWithMeridiem,
> extends UsePickerValueLayoutResponse<TIsRange>,
    UsePickerViewsLayoutResponse<TView>,
    UsePickerLayoutProps {
  isLandscape: boolean;
  isRtl: boolean;
  wrapperVariant: WrapperVariant;
  isValid: (value: InferPickerValue<TIsRange>) => boolean;
}

export interface UsePickerLayoutPropsResponse<
  TIsRange extends boolean,
  TView extends DateOrTimeViewWithMeridiem,
> {
  layoutProps: UsePickerLayoutPropsResponseLayoutProps<TIsRange, TView>;
}

export interface UsePickerLayoutPropsParams<
  TIsRange extends boolean,
  TView extends DateOrTimeViewWithMeridiem,
> {
  props: UsePickerLayoutProps;
  propsFromPickerValue: UsePickerValueLayoutResponse<TIsRange>;
  propsFromPickerViews: UsePickerViewsLayoutResponse<TView>;
  wrapperVariant: WrapperVariant;
}

/**
 * Prepare the props for the view layout (managed by `PickersLayout`)
 */
export const usePickerLayoutProps = <
  TIsRange extends boolean,
  TView extends DateOrTimeViewWithMeridiem,
>({
  props,
  propsFromPickerValue,
  propsFromPickerViews,
  wrapperVariant,
}: UsePickerLayoutPropsParams<TIsRange, TView>): UsePickerLayoutPropsResponse<TIsRange, TView> => {
  const { orientation } = props;
  const isLandscape = useIsLandscape(propsFromPickerViews.views, orientation);
  const isRtl = useRtl();

  const layoutProps: UsePickerLayoutPropsResponseLayoutProps<TIsRange, TView> = {
    ...propsFromPickerViews,
    ...propsFromPickerValue,
    isLandscape,
    isRtl,
    wrapperVariant,
    disabled: props.disabled,
    readOnly: props.readOnly,
  };

  return { layoutProps };
};
