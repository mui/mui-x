import { type MakeOptional } from '@mui/x-internals/types';
import {
  type UseDesktopPickerSlots,
  type ExportedUseDesktopPickerSlotProps,
  type DesktopOnlyPickerProps,
} from '../internals/hooks/useDesktopPicker';
import {
  type BaseTimePickerProps,
  type BaseTimePickerSlots,
  type BaseTimePickerSlotProps,
} from '../TimePicker/shared';
import { type TimeViewWithMeridiem } from '../internals/models';
import { type DigitalTimePickerProps } from '../internals/models/props/time';
import { type DigitalClockSlots, type DigitalClockSlotProps } from '../DigitalClock';
import {
  type MultiSectionDigitalClockSlots,
  type MultiSectionDigitalClockSlotProps,
} from '../MultiSectionDigitalClock';
import { type TimeView } from '../models';

export interface DesktopTimePickerSlots
  extends
    BaseTimePickerSlots,
    MakeOptional<UseDesktopPickerSlots, 'field' | 'openPickerIcon'>,
    DigitalClockSlots,
    MultiSectionDigitalClockSlots {}

export interface DesktopTimePickerSlotProps
  extends
    BaseTimePickerSlotProps,
    ExportedUseDesktopPickerSlotProps,
    DigitalClockSlotProps,
    MultiSectionDigitalClockSlotProps {}

export interface DesktopTimePickerProps
  extends
    BaseTimePickerProps<TimeViewWithMeridiem>,
    DesktopOnlyPickerProps,
    DigitalTimePickerProps {
  /**
   * Available views.
   */
  views?: readonly TimeView[];
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DesktopTimePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DesktopTimePickerSlotProps;
}
