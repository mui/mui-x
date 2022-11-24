import * as React from 'react';
import {
  ExportedPickersViewLayoutSlotsComponent,
  ExportedPickersViewLayoutSlotsComponentsProps,
  DateOrTimeView,
  BaseNextPickerProps,
  UsePickerParams,
  PickersSlotsComponent,
  PickersSlotsComponentsProps,
  ExportedBaseToolbarProps,
} from '@mui/x-date-pickers/internals';
import { DateRange } from '../../models/range';

export interface UseStaticPickerSlotsComponent
  extends ExportedPickersViewLayoutSlotsComponent,
    Pick<PickersSlotsComponent, 'PaperContent'> {}

export interface UseStaticPickerSlotsComponentsProps
  extends ExportedPickersViewLayoutSlotsComponentsProps,
    Pick<PickersSlotsComponentsProps, 'paperContent'> {
  toolbar?: ExportedBaseToolbarProps;
}

export interface StaticOnlyPickerProps {
  /**
   * Force static wrapper inner components to be rendered in mobile or desktop mode.
   * @default "mobile"
   */
  displayStaticWrapperAs: 'desktop' | 'mobile';
}

export interface UseStaticPickerProps<TDate, TView extends DateOrTimeView, TError>
  extends BaseNextPickerProps<DateRange<TDate>, TDate, TView, TError>,
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
  componentsProps?: UseStaticPickerSlotsComponentsProps;
}

export interface UseStaticPickerParams<
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseStaticPickerProps<TDate, TView, any>,
> extends Pick<
    UsePickerParams<DateRange<TDate>, TDate, TView, TExternalProps, {}>,
    'valueManager' | 'viewLookup' | 'validator'
  > {
  props: TExternalProps;
  /**
   * Ref to pass to the root element
   */
  ref: React.Ref<HTMLDivElement> | undefined;
}
