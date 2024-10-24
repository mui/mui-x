import * as React from 'react';
import {
  ExportedPickersLayoutSlots,
  ExportedPickersLayoutSlotProps,
} from '../../../PickersLayout/PickersLayout.types';
import { BasePickerProps } from '../../models/props/basePickerProps';
import { UsePickerParams } from '../usePicker';
import { UsePickerViewsProps } from '../usePicker/usePickerViews';
import { FieldSection, PickerValidDate } from '../../../models';
import { DateOrTimeViewWithMeridiem } from '../../models';

export interface UseStaticPickerSlots<TView extends DateOrTimeViewWithMeridiem>
  extends ExportedPickersLayoutSlots<PickerValidDate | null, TView> {}

export interface UseStaticPickerSlotProps<TView extends DateOrTimeViewWithMeridiem>
  extends ExportedPickersLayoutSlotProps<PickerValidDate | null, TView> {}

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
  TExternalProps extends UsePickerViewsProps<PickerValidDate | null, TView, any, any>,
> extends BasePickerProps<PickerValidDate | null, TView, TError, TExternalProps, {}>,
    StaticOnlyPickerProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UseStaticPickerSlots<TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseStaticPickerSlotProps<TView>;
}

export interface UseStaticPickerParams<
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseStaticPickerProps<TView, any, TExternalProps>,
> extends Pick<
    UsePickerParams<PickerValidDate | null, TView, FieldSection, TExternalProps, {}>,
    'valueManager' | 'valueType' | 'validator'
  > {
  props: TExternalProps;
  /**
   * Ref to pass to the root element
   */
  ref?: React.Ref<HTMLDivElement>;
}
