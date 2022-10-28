import {
  ExportedPickerViewLayoutSlotsComponent,
  ExportedPickerViewLayoutSlotsComponentsProps,
} from '../../components/PickerViewLayout';
import { CalendarOrClockPickerView } from '../../models';
import { BaseNextPickerProps } from '../../models/props/basePickerProps';
import { UsePickerParams } from '../usePicker';
import {
  PickersSlotsComponent,
  PickersSlotsComponentsProps,
} from '../../components/wrappers/WrapperProps';

export interface UseStaticPickerSlotsComponent
  extends ExportedPickerViewLayoutSlotsComponent,
    Pick<PickersSlotsComponent, 'PaperContent'> {}

export interface UseStaticPickerSlotsComponentsProps
  extends ExportedPickerViewLayoutSlotsComponentsProps,
    Pick<PickersSlotsComponentsProps, 'paperContent'> {}

export interface StaticOnlyPickerProps {
  /**
   * Force static wrapper inner components to be rendered in mobile or desktop mode.
   * @default "mobile"
   */
  displayStaticWrapperAs: 'desktop' | 'mobile';
}

export interface UseStaticPickerProps<TDate, TView extends CalendarOrClockPickerView>
  extends BaseNextPickerProps<TDate | null, TDate, TView>,
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

export interface UseStaticPickerParams<
  TDate,
  TView extends CalendarOrClockPickerView,
  TExternalProps extends UseStaticPickerProps<TDate, TView>,
> extends Pick<
    UsePickerParams<TDate | null, TDate, TView, TExternalProps, {}>,
    'valueManager' | 'viewLookup'
  > {
  props: TExternalProps;
}
