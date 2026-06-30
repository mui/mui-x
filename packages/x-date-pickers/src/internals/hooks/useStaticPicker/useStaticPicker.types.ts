import type {
  ExportedPickersLayoutSlots,
  ExportedPickersLayoutSlotProps,
} from '../../../PickersLayout/PickersLayout.types';
import type { BasePickerProps } from '../../models/props/basePickerProps';
import type { UsePickerParameters, UsePickerProps } from '../usePicker';
import type { DateOrTimeViewWithMeridiem, PickerValue } from '../../models';
import type { PickerStep } from '../../utils/createNonRangePickerStepNavigation';

export interface UseStaticPickerSlots extends ExportedPickersLayoutSlots<PickerValue> {}

export interface UseStaticPickerSlotProps extends ExportedPickersLayoutSlotProps<PickerValue> {}

export interface StaticOnlyPickerProps {
  /**
   * Force static wrapper inner components to be rendered in mobile or desktop mode.
   * @default "mobile"
   */
  displayStaticWrapperAs: 'desktop' | 'mobile';
  /**
   * If `true`, the view is focused during the first mount.
   * @default false
   */
  autoFocus?: boolean;
  /**
   * Callback fired when component requests to be closed.
   * Can be fired when selecting (by default on `desktop` mode) or clearing a value.
   * @deprecated Please avoid using as it will be removed in next major version.
   */
  onClose?: () => void;
}

export interface UseStaticPickerProps<
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerProps<PickerValue, TView, TError, any>,
>
  extends BasePickerProps<PickerValue, TView, TError, TExternalProps>, StaticOnlyPickerProps {
  /**
   * If `true`, the picker uses compact dimensions.
   */
  compact?: boolean;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UseStaticPickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseStaticPickerSlotProps;
}

export interface UseStaticPickerParams<
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseStaticPickerProps<TView, any, TExternalProps>,
> extends Pick<
  UsePickerParameters<PickerValue, TView, TExternalProps>,
  'valueManager' | 'valueType' | 'validator' | 'ref'
> {
  props: TExternalProps;
  /**
   * Steps available for the picker.
   * This will be used to define the behavior of navigation actions.
   * If null, the picker will not have any step navigation.
   */
  steps: PickerStep[] | null;
}
