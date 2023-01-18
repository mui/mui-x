import {
  UseDesktopPickerSlotsComponent,
  UseDesktopPickerSlotsComponentsProps,
  DesktopOnlyPickerProps,
} from '../internals/hooks/useDesktopPicker';
import {
  BaseTimePickerProps,
  BaseTimePickerSlotsComponent,
  BaseTimePickerSlotsComponentsProps,
} from '../TimePicker/shared';
import { MakeOptional } from '../internals/models/helpers';
import { BaseNonStaticPickerExternalProps } from '../internals/models/props/basePickerProps';
import { TimeView } from '../internals/models/views';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';

export interface DesktopTimePickerSlotsComponent<TDate>
  extends BaseTimePickerSlotsComponent<TDate>,
    MakeOptional<UseDesktopPickerSlotsComponent<TDate, TimeView>, 'Field' | 'OpenPickerIcon'> {}

export interface DesktopTimePickerSlotsComponentsProps<TDate>
  extends BaseTimePickerSlotsComponentsProps,
    Omit<UseDesktopPickerSlotsComponentsProps<TDate, TimeView>, 'toolbar'> {}

export interface DesktopTimePickerProps<TDate>
  extends BaseTimePickerProps<TDate>,
    DesktopOnlyPickerProps<TDate>,
    BaseNonStaticPickerExternalProps {
  /**
   * Overrideable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: DesktopTimePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: DesktopTimePickerSlotsComponentsProps<TDate>;
  /**
   * Overrideable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<DesktopTimePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopTimePickerSlotsComponentsProps<TDate>;
}
