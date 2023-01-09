import {
  UseDesktopPickerSlotsComponent,
  UseDesktopPickerSlotsComponentsProps,
  DesktopOnlyPickerProps,
} from '../internals/hooks/useDesktopPicker';
import {
  BaseNextTimePickerProps,
  BaseNextTimePickerSlotsComponent,
  BaseNextTimePickerSlotsComponentsProps,
} from '../NextTimePicker/shared';
import { MakeOptional } from '../internals/models/helpers';
import { BaseNextNonStaticPickerExternalProps } from '../internals/models/props/basePickerProps';
import { TimeView } from '../internals/models/views';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';

export interface DesktopNextTimePickerSlotsComponent<TDate>
  extends BaseNextTimePickerSlotsComponent<TDate>,
    MakeOptional<UseDesktopPickerSlotsComponent<TDate, TimeView>, 'Field' | 'OpenPickerIcon'> {}

export interface DesktopNextTimePickerSlotsComponentsProps<TDate>
  extends BaseNextTimePickerSlotsComponentsProps,
    UseDesktopPickerSlotsComponentsProps<TDate, TimeView> {}

export interface DesktopNextTimePickerProps<TDate>
  extends BaseNextTimePickerProps<TDate>,
    DesktopOnlyPickerProps<TDate>,
    BaseNextNonStaticPickerExternalProps {
  /**
   * Overrideable components.
   * @default {}
   * @deprecated
   */
  components?: DesktopNextTimePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated
   */
  componentsProps?: DesktopNextTimePickerSlotsComponentsProps<TDate>;
  /**
   * Overrideable components.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<DesktopNextTimePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotsProps?: DesktopNextTimePickerSlotsComponentsProps<TDate>;
}
