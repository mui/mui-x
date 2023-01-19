import {
  UseDesktopPickerSlotsComponent,
  ExportedUseDesktopPickerSlotsComponentsProps,
  DesktopOnlyPickerProps,
} from '../internals/hooks/useDesktopPicker';
import {
  BaseDateTimePickerProps,
  BaseDateTimePickerSlotsComponent,
  BaseDateTimePickerSlotsComponentsProps,
} from '../DateTimePicker/shared';
import { MakeOptional } from '../internals/models/helpers';
import { BaseNonStaticPickerExternalProps } from '../internals/models/props/basePickerProps';
import { DateOrTimeView } from '../internals/models/views';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';

export interface DesktopDateTimePickerSlotsComponent<TDate>
  extends BaseDateTimePickerSlotsComponent<TDate>,
    MakeOptional<
      UseDesktopPickerSlotsComponent<TDate, DateOrTimeView>,
      'Field' | 'OpenPickerIcon'
    > {}

export interface DesktopDateTimePickerSlotsComponentsProps<TDate>
  extends BaseDateTimePickerSlotsComponentsProps<TDate>,
    ExportedUseDesktopPickerSlotsComponentsProps<TDate, DateOrTimeView> {}

export interface DesktopDateTimePickerProps<TDate>
  extends BaseDateTimePickerProps<TDate>,
    DesktopOnlyPickerProps<TDate>,
    BaseNonStaticPickerExternalProps {
  /**
   * Years rendered per row.
   * @default 4
   */
  yearsPerRow?: 3 | 4;
  /**
   * Overrideable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: DesktopDateTimePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: DesktopDateTimePickerSlotsComponentsProps<TDate>;
  /**
   * Overrideable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<DesktopDateTimePickerSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopDateTimePickerSlotsComponentsProps<TDate>;
}
