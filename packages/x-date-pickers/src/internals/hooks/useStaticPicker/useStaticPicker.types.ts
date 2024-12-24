import * as React from 'react';
import {
  ExportedPickersLayoutSlots,
  ExportedPickersLayoutSlotProps,
} from '../../../PickersLayout/PickersLayout.types';
import { BasePickerProps } from '../../models/props/basePickerProps';
import { UsePickerParams } from '../usePicker';
import { UsePickerViewsProps } from '../usePicker/usePickerViews';
import { DateOrTimeViewWithMeridiem, PickerValue } from '../../models';

export interface UseStaticPickerSlots extends ExportedPickersLayoutSlots<PickerValue> {}

export interface UseStaticPickerSlotProps extends ExportedPickersLayoutSlotProps<PickerValue> {}

export interface StaticOnlyPickerProps {
  /**
   * Force static wrapper inner components to be rendered in mobile or desktop mode.
   * @default "mobile"
   */
  displayStaticWrapperAs: 'desktop' | 'mobile';
  /**
   * If `true`, the view is focused during the first mount.
   * @default false
   */
  autoFocus?: boolean;
  /**
   * Callback fired when component requests to be closed.
   * Can be fired when selecting (by default on `desktop` mode) or clearing a value.
   * @deprecated Please avoid using as it will be removed in next major version.
   */
  onClose?: () => void;
}

export interface UseStaticPickerProps<
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerViewsProps<PickerValue, TView, any>,
> extends BasePickerProps<PickerValue, TView, TError, TExternalProps>,
    StaticOnlyPickerProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UseStaticPickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseStaticPickerSlotProps;
}

export interface UseStaticPickerParams<
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseStaticPickerProps<TView, any, TExternalProps>,
> extends Pick<
    UsePickerParams<PickerValue, TView, TExternalProps>,
    'valueManager' | 'valueType' | 'validator'
  > {
  props: TExternalProps;
  /**
   * Ref to pass to the root element
   */
  ref?: React.Ref<HTMLDivElement>;
}
