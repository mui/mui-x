import * as React from 'react';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { InputAdornmentProps } from '@mui/material/InputAdornment';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { SlotComponentProps } from '@mui/base/utils';
import {
  BaseNonStaticPickerProps,
  BasePickerProps,
  BaseNonRangeNonStaticPickerProps,
} from '../../models/props/basePickerProps';
import {
  PickersPopperSlotsComponent,
  PickersPopperSlotsComponentsProps,
} from '../../components/PickersPopper';
import { UsePickerParams, UsePickerProps } from '../usePicker';
import {
  BaseSingleInputFieldProps,
  FieldSection,
  DateOrTimeView,
  MuiPickersAdapter,
} from '../../../models';
import {
  ExportedPickersLayoutSlotsComponent,
  ExportedPickersLayoutSlotsComponentsProps,
  PickersLayoutSlotsComponentsProps,
} from '../../../PickersLayout/PickersLayout.types';
import { UsePickerValueNonStaticProps } from '../usePicker/usePickerValue.types';
import { UsePickerViewsNonStaticProps, UsePickerViewsProps } from '../usePicker/usePickerViews';
import { UncapitalizeObjectKeys } from '../../utils/slots-migration';

export interface UseDesktopPickerSlotsComponent<TDate, TView extends DateOrTimeView>
  extends Pick<
      PickersPopperSlotsComponent,
      'DesktopPaper' | 'DesktopTransition' | 'DesktopTrapFocus' | 'Popper'
    >,
    ExportedPickersLayoutSlotsComponent<TDate | null, TDate, TView> {
  /**
   * Component used to enter the date with the keyboard.
   */
  Field: React.ElementType<BaseSingleInputFieldProps<TDate | null, FieldSection, any>>;
  /**
   * Form control with an input to render the value inside the default field.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  TextField?: React.ElementType<TextFieldProps>;
  /**
   * Component displayed on the start or end input adornment used to open the picker on desktop.
   * @default InputAdornment
   */
  InputAdornment?: React.ElementType<InputAdornmentProps>;
  /**
   * Button to open the picker on desktop.
   * @default IconButton
   */
  OpenPickerButton?: React.ElementType<IconButtonProps>;
  /**
   * Icon displayed in the open picker button on desktop.
   */
  OpenPickerIcon: React.ElementType;
}

export interface UseDesktopPickerSlotsComponentsProps<TDate, TView extends DateOrTimeView>
  extends ExportedUseDesktopPickerSlotsComponentsProps<TDate, TView>,
    Pick<PickersLayoutSlotsComponentsProps<TDate | null, TDate, TView>, 'toolbar'> {}

export interface ExportedUseDesktopPickerSlotsComponentsProps<TDate, TView extends DateOrTimeView>
  extends PickersPopperSlotsComponentsProps,
    ExportedPickersLayoutSlotsComponentsProps<TDate | null, TDate, TView> {
  field?: SlotComponentProps<
    React.ElementType<BaseSingleInputFieldProps<TDate | null, FieldSection, unknown>>,
    {},
    UsePickerProps<TDate | null, any, FieldSection, any, any, any>
  >;
  textField?: SlotComponentProps<typeof TextField, {}, Record<string, any>>;
  inputAdornment?: Partial<InputAdornmentProps>;
  openPickerButton?: SlotComponentProps<
    typeof IconButton,
    {},
    UseDesktopPickerProps<TDate, any, any, any>
  >;
  openPickerIcon?: Record<string, any>;
}

export interface DesktopOnlyPickerProps<TDate>
  extends BaseNonStaticPickerProps,
    BaseNonRangeNonStaticPickerProps,
    UsePickerValueNonStaticProps<TDate | null, FieldSection>,
    UsePickerViewsNonStaticProps {
  /**
   * If `true`, the `input` element is focused during the first mount.
   */
  autoFocus?: boolean;
}

export interface UseDesktopPickerProps<
  TDate,
  TView extends DateOrTimeView,
  TError,
  TExternalProps extends UsePickerViewsProps<any, TView, any, any>,
> extends BasePickerProps<TDate | null, TDate, TView, TError, TExternalProps, {}>,
    DesktopOnlyPickerProps<TDate> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: UncapitalizeObjectKeys<UseDesktopPickerSlotsComponent<TDate, TView>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseDesktopPickerSlotsComponentsProps<TDate, TView>;
}

export interface UseDesktopPickerParams<
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseDesktopPickerProps<TDate, TView, any, TExternalProps>,
> extends Pick<
    UsePickerParams<TDate | null, TDate, TView, FieldSection, TExternalProps, {}>,
    'valueManager' | 'validator'
  > {
  props: TExternalProps;
  getOpenDialogAriaText: (date: TDate | null, utils: MuiPickersAdapter<TDate>) => string;
}
