import {
  UseMobilePickerSlotsComponent,
  ExportedUseMobilePickerSlotsComponentsProps,
  MobileOnlyPickerProps,
} from '../internals/hooks/useMobilePicker';
import {
  BaseTimePickerProps,
  BaseTimePickerSlotsComponent,
  BaseTimePickerSlotsComponentsProps,
} from '../TimePicker/shared';
import { MakeOptional } from '../internals/models/helpers';
import { TimeView } from '../models';
import { TimeViewWithMeridiem } from '../internals/models';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';

export interface MobileTimePickerSlotsComponent<
  TDate,
  TView extends TimeViewWithMeridiem = TimeView,
> extends BaseTimePickerSlotsComponent<TDate>,
    MakeOptional<UseMobilePickerSlotsComponent<TDate, TView>, 'Field'> {}

export interface MobileTimePickerSlotsComponentsProps<
  TDate,
  TView extends TimeViewWithMeridiem = TimeView,
> extends BaseTimePickerSlotsComponentsProps,
    ExportedUseMobilePickerSlotsComponentsProps<TDate, TView> {}

export interface MobileTimePickerProps<TDate, TView extends TimeViewWithMeridiem = TimeView>
  extends BaseTimePickerProps<TDate, TView>,
    MobileOnlyPickerProps<TDate> {
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: MobileTimePickerSlotsComponent<TDate, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: MobileTimePickerSlotsComponentsProps<TDate, TView>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<MobileTimePickerSlotsComponent<TDate, TView>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MobileTimePickerSlotsComponentsProps<TDate, TView>;
}
