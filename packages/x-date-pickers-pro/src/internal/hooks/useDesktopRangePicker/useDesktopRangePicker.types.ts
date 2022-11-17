import * as React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Stack, { StackProps } from '@mui/material/Stack';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { SlotComponentProps } from '@mui/base/utils';
import {
  DateOrTimeView,
  UsePickerParams,
  BaseNextPickerProps,
  BaseNextNonStaticPickerProps,
  PickersPopperSlotsComponent,
  PickersPopperSlotsComponentsProps,
  UsePickerValueNonStaticProps,
  UsePickerViewsNonStaticProps,
  ExportedPickersViewLayoutSlotsComponent,
  ExportedPickersViewLayoutSlotsComponentsProps,
} from '@mui/x-date-pickers/internals';
import { DateRange } from '../../models';
import { BaseMultiInputFieldProps } from '../../models/fields';

export interface UseDesktopRangePickerSlotsComponent
  extends PickersPopperSlotsComponent,
    ExportedPickersViewLayoutSlotsComponent {
  Field: React.ElementType;
  FieldRoot?: React.ElementType<StackProps>;
  FieldSeparator?: React.ElementType<TypographyProps>;
  Input?: React.ElementType<TextFieldProps>;
}

export interface UseDesktopRangePickerSlotsComponentsProps<TDate>
  // TODO v6: Remove `Pick` once `PickerPoppers` does not handle the layouting parts
  extends Pick<
      PickersPopperSlotsComponentsProps,
      'desktopPaper' | 'desktopTransition' | 'desktopTrapFocus' | 'popper' | 'paperContent'
    >,
    ExportedPickersViewLayoutSlotsComponentsProps {
  field?: SlotComponentProps<
    React.ElementType<BaseMultiInputFieldProps<DateRange<TDate>, unknown>>,
    {},
    unknown
  >;
  fieldRoot?: SlotComponentProps<typeof Stack, {}, unknown>;
  fieldSeparator?: SlotComponentProps<typeof Typography, {}, unknown>;
  input?: SlotComponentProps<typeof TextField, {}, unknown>;
}

export interface DesktopRangeOnlyPickerProps<TDate>
  extends UsePickerValueNonStaticProps<DateRange<TDate>>,
    UsePickerViewsNonStaticProps,
    BaseNextNonStaticPickerProps {}

export interface UseDesktopRangePickerProps<TDate, TView extends DateOrTimeView, TError>
  extends DesktopRangeOnlyPickerProps<TDate>,
    BaseNextPickerProps<DateRange<TDate>, TDate, TView, TError> {
  /**
   * Overrideable components.
   * @default {}
   */
  components: UseDesktopRangePickerSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: UseDesktopRangePickerSlotsComponentsProps<TDate>;
}

interface DesktopRangePickerAdditionalViewProps {
  currentDatePosition: 'start' | 'end';
  onCurrentDatePositionChange: (newPosition: 'start' | 'end') => void;
}

export interface UseDesktopRangePickerParams<
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseDesktopRangePickerProps<TDate, TView, any>,
> extends Pick<
    UsePickerParams<
      DateRange<TDate>,
      TDate,
      TView,
      TExternalProps,
      DesktopRangePickerAdditionalViewProps
    >,
    'valueManager' | 'viewLookup' | 'validator'
  > {
  props: TExternalProps;
}
