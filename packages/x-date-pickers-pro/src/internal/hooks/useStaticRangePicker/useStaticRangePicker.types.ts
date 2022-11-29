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

export interface UseStaticRangePickerSlotsComponent
  extends ExportedPickersViewLayoutSlotsComponent,
    Pick<PickersSlotsComponent, 'PaperContent'> {}

export interface UseStaticRangePickerSlotsComponentsProps
  extends ExportedPickersViewLayoutSlotsComponentsProps,
    Pick<PickersSlotsComponentsProps, 'paperContent'> {
  toolbar?: ExportedBaseToolbarProps;
}

export interface StaticRangeOnlyPickerProps {
  /**
   * Force static wrapper inner components to be rendered in mobile or desktop mode.
   * @default "mobile"
   */
  displayStaticWrapperAs: 'desktop' | 'mobile';
}

export interface UseStaticRangePickerProps<TDate, TView extends DateOrTimeView, TError>
  extends BaseNextPickerProps<DateRange<TDate>, TDate, TView, TError>,
    StaticRangeOnlyPickerProps {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: UseStaticRangePickerSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: UseStaticRangePickerSlotsComponentsProps;
}

export interface UseStaticRangePickerParams<
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseStaticRangePickerProps<TDate, TView, any>,
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
