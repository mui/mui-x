import {
  ExportedPickerViewLayoutSlotsComponent,
  ExportedPickerViewLayoutSlotsComponentsProps,
} from '../../components/PickerViewLayout';
import { CalendarOrClockPickerView, MuiPickersAdapter } from '../../models';
import { BasePickerProps2 } from '../../models/props/basePickerProps';
import { UsePickerParams } from '../usePicker';

export interface UseStaticPickerSlotsComponent extends ExportedPickerViewLayoutSlotsComponent {}

export interface UseStaticPickerSlotsComponentsProps
  extends ExportedPickerViewLayoutSlotsComponentsProps {}

export interface StaticOnlyPickerProps {
  /**
   * Force static wrapper inner components to be rendered in mobile or desktop mode.
   * @default "mobile"
   */
  displayStaticWrapperAs?: 'desktop' | 'mobile';
}

export interface UseStaticPickerProps<TDate, TView extends CalendarOrClockPickerView>
  extends BasePickerProps2<TDate | null, TDate, TView>,
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

export interface UseStaticPickerParams<TDate, TView extends CalendarOrClockPickerView>
  extends Pick<
    UsePickerParams<TDate | null, TDate, TView, {}>,
    'props' | 'valueManager' | 'renderViews'
  > {
  props: UseStaticPickerProps<TDate, TView>;
}
