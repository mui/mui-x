import * as React from 'react';
import {
  ExportedPickersLayoutSlots,
  ExportedPickersLayoutSlotsComponent,
  ExportedPickersLayoutSlotsComponentsProps,
} from '../../../PickersLayout/PickersLayout.types';
import { DateOrTimeView } from '../../models';
import { BaseNextPickerProps } from '../../models/props/basePickerProps';
import { UsePickerParams } from '../usePicker';
import { UsePickerViewsProps } from '../usePicker/usePickerViews';

export interface UseStaticPickerSlots<TValue, TView extends DateOrTimeView>
  extends ExportedPickersLayoutSlots<TValue, TView> {}

export interface UseStaticPickerSlotsComponent<TValue, TView extends DateOrTimeView>
  extends ExportedPickersLayoutSlotsComponent<TValue, TView> {}

export interface UseStaticPickerSlotsComponentsProps<TDate, TView extends DateOrTimeView>
  extends ExportedPickersLayoutSlotsComponentsProps<TDate | null, TView> {}

export interface StaticOnlyPickerProps {
  /**
   * Force static wrapper inner components to be rendered in mobile or desktop mode.
   * @default "mobile"
   */
  displayStaticWrapperAs: 'desktop' | 'mobile';
  /**
   * If `true`, the view is focused during the first mount.
   */
  autoFocus?: boolean;
}

export interface UseStaticPickerProps<
  TDate,
  TView extends DateOrTimeView,
  TError,
  TExternalProps extends UsePickerViewsProps<TDate | null, TView, any, any>,
> extends BaseNextPickerProps<TDate | null, TDate, TView, TError, TExternalProps, {}>,
    StaticOnlyPickerProps {
  /**
   * Overrideable components.
   * @default {}
   * @deprecated
   */
  components?: Partial<UseStaticPickerSlotsComponent<TDate | null, TView>>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated
   */
  componentsProps?: UseStaticPickerSlotsComponentsProps<TDate, TView>;
  /**
   * Overrideable components.
   * @default {}
   */
  slots: UseStaticPickerSlots<TDate | null, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotsProps?: UseStaticPickerSlotsComponentsProps<TDate, TView>;
}

export interface UseStaticPickerParams<
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseStaticPickerProps<TDate, TView, any, TExternalProps>,
> extends Pick<
    UsePickerParams<TDate | null, TDate, TView, TExternalProps, {}>,
    'valueManager' | 'validator'
  > {
  props: TExternalProps;
  /**
   * Ref to pass to the root element
   */
  ref?: React.Ref<HTMLDivElement>;
}
