import * as React from 'react';
import {
  MobilePickerSlotsComponent,
  MobilePickerSlotsComponentsProps,
  ExportedMobilePickerProps,
} from '../internals/components/MobilePicker';
import { CalendarPickerView } from '../internals/models';
import { MakeOptional } from '../internals/models/helpers';

export interface MobileDatePicker2SlotsComponent
  extends MakeOptional<MobilePickerSlotsComponent, 'Field'> {}

export interface MobileDatePicker2SlotsComponentsProps extends MobilePickerSlotsComponentsProps {}

export interface MobileDatePicker2Props<TDate>
  extends MakeOptional<
    ExportedMobilePickerProps<TDate | null, TDate, CalendarPickerView>,
    'inputFormat' | 'views' | 'openTo'
  > {
  /**
   * The label content.
   */
  label?: React.ReactNode;
  /**
   * Overrideable components.
   * @default {}
   */
  components?: MobileDatePicker2SlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: MobileDatePicker2SlotsComponentsProps;
}
