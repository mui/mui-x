import { TimeClockClasses } from './timeClockClasses';
import {
  PickersArrowSwitcherSlots,
  PickersArrowSwitcherSlotProps,
} from '../internals/components/PickersArrowSwitcher';
import { BaseClockProps, ExportedBaseClockProps } from '../internals/models/props/time';
import { TimeView } from '../models';
import { TimeViewWithMeridiem } from '../internals/models';

export interface ExportedTimeClockProps extends ExportedBaseClockProps {
  /**
   * Display ampm controls under the clock (instead of in the toolbar).
   * @default false
   */
  ampmInClock?: boolean;
}

export interface TimeClockSlots extends PickersArrowSwitcherSlots {}

export interface TimeClockSlotProps extends PickersArrowSwitcherSlotProps {}

export interface TimeClockProps<TView extends TimeViewWithMeridiem = TimeView>
  extends ExportedTimeClockProps,
    BaseClockProps<TView> {
  /**
   * Available views.
   * @default ['hours', 'minutes']
   */
  views?: readonly TView[];
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<TimeClockClasses>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: TimeClockSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TimeClockSlotProps;
  showViewSwitcher?: boolean;
}
