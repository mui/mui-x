import * as React from 'react';
import {
  ExportedPickersViewLayoutSlotsComponent,
  ExportedPickersViewLayoutSlotsComponentsProps,
} from '../../components/PickersViewLayout';
import { DateOrTimeView } from '../../models';
import { BaseNextPickerProps } from '../../models/props/basePickerProps';
import { UsePickerParams } from '../usePicker';
import {
  PickersSlotsComponent,
  PickersSlotsComponentsProps,
} from '../../components/wrappers/WrapperProps';

export interface UseStaticPickerSlotsComponent
  extends ExportedPickersViewLayoutSlotsComponent,
    Pick<PickersSlotsComponent, 'PaperContent'> {}

export interface UseStaticPickerSlotsComponentsProps<TDate, TView extends DateOrTimeView>
  extends ExportedPickersViewLayoutSlotsComponentsProps<TDate | null, TView>,
    Pick<PickersSlotsComponentsProps, 'paperContent'> {}

export interface StaticOnlyPickerProps {
  /**
   * Force static wrapper inner components to be rendered in mobile or desktop mode.
   * @default "mobile"
   */
  displayStaticWrapperAs: 'desktop' | 'mobile';
}

export interface UseStaticPickerProps<TValue, TDate, TView extends DateOrTimeView, TError>
  extends BaseNextPickerProps<TValue, TDate, TView, TError>,
    StaticOnlyPickerProps {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: UseStaticPickerSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: UseStaticPickerSlotsComponentsProps<TDate, TView>;
}

export interface UseStaticPickerParams<
  TValue,
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseStaticPickerProps<TValue, TDate, TView, any>,
> extends Pick<
    UsePickerParams<TValue, TDate, TView, TExternalProps, {}>,
    'valueManager' | 'viewLookup' | 'validator'
  > {
  props: TExternalProps;
  /**
   * Ref to pass to the root element
   */
  ref: React.Ref<HTMLDivElement> | undefined;
}
