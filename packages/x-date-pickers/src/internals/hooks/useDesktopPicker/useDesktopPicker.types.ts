import * as React from 'react';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { InputAdornmentProps } from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { SlotComponentProps } from '@mui/base/utils';
import {
  BaseNonStaticPickerProps,
  BasePickerProps,
  BaseNonRangeNonStaticPickerProps,
} from '../../models/props/basePickerProps';
import { PickersPopperSlots, PickersPopperSlotProps } from '../../components/PickersPopper';
import { UsePickerParams, UsePickerProps } from '../usePicker';
import {
  BaseSingleInputFieldProps,
  FieldSection,
  FieldTextFieldVersion,
  MuiPickersAdapter,
} from '../../../models';
import {
  ExportedPickersLayoutSlots,
  ExportedPickersLayoutSlotProps,
  PickersLayoutSlotProps,
} from '../../../PickersLayout/PickersLayout.types';
import { UsePickerValueNonStaticProps } from '../usePicker/usePickerValue.types';
import { UsePickerViewsNonStaticProps, UsePickerViewsProps } from '../usePicker/usePickerViews';
import { DateOrTimeViewWithMeridiem } from '../../models';
import {
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
} from '../../../hooks/useClearableField';
import { SlotComponentPropsFromProps } from '../../models/helpers';

export interface UseDesktopPickerSlots<TDate, TView extends DateOrTimeViewWithMeridiem>
  extends Pick<
      PickersPopperSlots,
      'desktopPaper' | 'desktopTransition' | 'desktopTrapFocus' | 'popper'
    >,
    ExportedPickersLayoutSlots<TDate | null, TDate, TView>,
    UseClearableFieldSlots {
  /**
   * Component used to enter the date with the keyboard.
   */
  field: React.ElementType;
  /**
   * Form control with an input to render the value inside the default field.
   * @default TextField from '@mui/material' or PickersTextField if textFieldVersion === 'v6' .
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
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TTextFieldVersion extends FieldTextFieldVersion,
> extends ExportedUseDesktopPickerSlotProps<TDate, TView, TTextFieldVersion>,
    Pick<PickersLayoutSlotProps<TDate | null, TDate, TView>, 'toolbar'> {}

export interface ExportedUseDesktopPickerSlotProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TTextFieldVersion extends FieldTextFieldVersion,
> extends PickersPopperSlotProps,
    ExportedPickersLayoutSlotProps<TDate | null, TDate, TView>,
    UseClearableFieldSlotProps {
  field?: SlotComponentPropsFromProps<
    BaseSingleInputFieldProps<TDate | null, TDate, FieldSection, TTextFieldVersion, unknown>,
    {},
    UsePickerProps<TDate | null, TDate, any, any, any, any>
  >;
  textField?: SlotComponentProps<typeof TextField, {}, Record<string, any>>;
  inputAdornment?: Partial<InputAdornmentProps>;
  openPickerButton?: SlotComponentProps<
    typeof IconButton,
    {},
    UseDesktopPickerProps<TDate, any, TTextFieldVersion, any, any>
  >;
  openPickerIcon?: Record<string, any>;
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
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TTextFieldVersion extends FieldTextFieldVersion,
  TError,
  TExternalProps extends UsePickerViewsProps<any, any, TView, any, any>,
> extends BasePickerProps<TDate | null, TDate, TView, TError, TExternalProps, {}>,
    DesktopOnlyPickerProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: UseDesktopPickerSlots<TDate, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseDesktopPickerSlotProps<TDate, TView, TTextFieldVersion>;
}

export interface UseDesktopPickerParams<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TTextFieldVersion extends FieldTextFieldVersion,
  TExternalProps extends UseDesktopPickerProps<
    TDate,
    TView,
    TTextFieldVersion,
    any,
    TExternalProps
  >,
> extends Pick<
    UsePickerParams<TDate | null, TDate, TView, FieldSection, TExternalProps, {}>,
    'valueManager' | 'valueType' | 'validator'
  > {
  props: TExternalProps;
  getOpenDialogAriaText: (date: TDate | null, utils: MuiPickersAdapter<TDate>) => string;
}
