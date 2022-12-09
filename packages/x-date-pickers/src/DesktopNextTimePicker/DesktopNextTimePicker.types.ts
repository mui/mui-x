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

export interface DesktopNextTimePickerSlotsComponent<TDate>
  extends BaseNextTimePickerSlotsComponent<TDate>,
    MakeOptional<UseDesktopPickerSlotsComponent<TDate>, 'Field' | 'OpenPickerIcon'> {}

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
   */
  components?: DesktopNextTimePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DesktopNextTimePickerSlotsComponentsProps<TDate>;
}
