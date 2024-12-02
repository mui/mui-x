import * as React from 'react';
import type { IconButtonProps } from '@mui/material/IconButton';
import type { InputAdornmentProps } from '@mui/material/InputAdornment';
import type { TextFieldProps } from '@mui/material/TextField';
import { MakeRequired, SlotComponentPropsFromProps } from '@mui/x-internals/types';
import {
  BaseNonStaticPickerProps,
  BasePickerProps,
  BaseNonRangeNonStaticPickerProps,
} from '../../models/props/basePickerProps';
import { PickersPopperSlots, PickersPopperSlotProps } from '../../components/PickersPopper';
import { UsePickerParams } from '../usePicker';
import {
  FieldOwnerState,
  PickerFieldSlotProps,
  PickerOwnerState,
  PickerValidDate,
} from '../../../models';
import {
  ExportedPickersLayoutSlots,
  ExportedPickersLayoutSlotProps,
  PickersLayoutSlotProps,
} from '../../../PickersLayout/PickersLayout.types';
import { UsePickerValueNonStaticProps } from '../usePicker/usePickerValue.types';
import { UsePickerViewsNonStaticProps, UsePickerViewsProps } from '../usePicker/usePickerViews';
import { DateOrTimeViewWithMeridiem, PickerValue } from '../../models';
import {
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
} from '../../../hooks/useClearableField';
import { PickersTextFieldProps } from '../../../PickersTextField';

export interface UseDesktopPickerSlots<TView extends DateOrTimeViewWithMeridiem>
  extends Pick<
      PickersPopperSlots,
      'desktopPaper' | 'desktopTransition' | 'desktopTrapFocus' | 'popper'
    >,
    ExportedPickersLayoutSlots<PickerValue, TView>,
    UseClearableFieldSlots {
  /**
   * Component used to enter the date with the keyboard.
   */
  field: React.ElementType;
  /**
   * Form control with an input to render the value inside the default field.
   * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
   */
  textField?: React.ElementType;
  /**
   * Component displayed on the start or end input adornment used to open the picker on desktop.
   * @default InputAdornment
   */
  inputAdornment?: React.ElementType<InputAdornmentProps>;
  /**
   * Button to open the picker on desktop.
   * @default IconButton
   */
  openPickerButton?: React.ElementType<IconButtonProps>;
  /**
   * Icon displayed in the open picker button on desktop.
   */
  openPickerIcon: React.ElementType;
}

export interface UseDesktopPickerSlotProps<
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends ExportedUseDesktopPickerSlotProps<TView, TEnableAccessibleFieldDOMStructure>,
    Pick<PickersLayoutSlotProps<PickerValue, TView>, 'toolbar'> {}

export interface ExportedUseDesktopPickerSlotProps<
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends PickersPopperSlotProps,
    ExportedPickersLayoutSlotProps<PickerValue, TView>,
    UseClearableFieldSlotProps {
  field?: SlotComponentPropsFromProps<
    PickerFieldSlotProps<PickerValue, TEnableAccessibleFieldDOMStructure>,
    {},
    PickerOwnerState
  >;
  textField?: SlotComponentPropsFromProps<
    PickersTextFieldProps | TextFieldProps,
    {},
    FieldOwnerState
  >;
  inputAdornment?: SlotComponentPropsFromProps<InputAdornmentProps, {}, PickerOwnerState>;
  openPickerButton?: SlotComponentPropsFromProps<IconButtonProps, {}, PickerOwnerState>;
  openPickerIcon?: SlotComponentPropsFromProps<Record<string, any>, {}, PickerOwnerState>;
}

export interface DesktopOnlyPickerProps
  extends BaseNonStaticPickerProps,
    BaseNonRangeNonStaticPickerProps,
    UsePickerValueNonStaticProps,
    UsePickerViewsNonStaticProps {
  /**
   * If `true`, the `input` element is focused during the first mount.
   * @default false
   */
  autoFocus?: boolean;
}

export interface UseDesktopPickerProps<
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
  TExternalProps extends UsePickerViewsProps<PickerValue, TView, any, {}>,
> extends BasePickerProps<PickerValue, TView, TError, TExternalProps, {}>,
    MakeRequired<DesktopOnlyPickerProps, 'format'> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: UseDesktopPickerSlots<TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseDesktopPickerSlotProps<TView, TEnableAccessibleFieldDOMStructure>;
}

export interface UseDesktopPickerParams<
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TExternalProps extends UseDesktopPickerProps<
    TView,
    TEnableAccessibleFieldDOMStructure,
    any,
    TExternalProps
  >,
> extends Pick<
    UsePickerParams<PickerValue, TView, TExternalProps, {}>,
    'valueManager' | 'valueType' | 'validator' | 'rendererInterceptor'
  > {
  props: TExternalProps;
  getOpenDialogAriaText: (date: PickerValidDate | null) => string;
}
