import * as React from 'react';
import { WrapperVariantContext } from './WrapperVariantContext';
import {
  PickersModalDialog,
  ExportedPickerModalProps,
  PickersModalDialogSlotsComponent,
  PickersModalDialogSlotsComponentsProps,
} from '../PickersModalDialog';
import { DateInputPropsLike } from './WrapperProps';
import { PickerStateWrapperProps } from '../../hooks/usePickerState';
import { DateInputSlotsComponent } from '../PureDateInput';

export interface MobileWrapperProps extends ExportedPickerModalProps {
  children?: React.ReactNode;
}

export interface MobileWrapperSlotsComponent
  extends PickersModalDialogSlotsComponent,
    DateInputSlotsComponent {}

export interface MobileWrapperSlotsComponentsProps extends PickersModalDialogSlotsComponentsProps {}

export interface InternalMobileWrapperProps extends MobileWrapperProps, PickerStateWrapperProps {
  DateInputProps: DateInputPropsLike & { ref?: React.Ref<HTMLDivElement> };
  PureDateInputComponent: React.JSXElementConstructor<DateInputPropsLike>;
  components?: Partial<MobileWrapperSlotsComponent>;
  componentsProps?: Partial<MobileWrapperSlotsComponentsProps>;
}

export function MobileWrapper(props: InternalMobileWrapperProps) {
  const {
    children,
    DateInputProps,
    DialogProps,
    onAccept,
    onClear,
    onDismiss,
    onCancel,
    onSetToday,
    open,
    PureDateInputComponent,
    components,
    componentsProps,
    ...other
  } = props;

  return (
    <WrapperVariantContext.Provider value="mobile">
      <PureDateInputComponent components={components} {...other} {...DateInputProps} />
      <PickersModalDialog
        DialogProps={DialogProps}
        onAccept={onAccept}
        onClear={onClear}
        onDismiss={onDismiss}
        onCancel={onCancel}
        onSetToday={onSetToday}
        open={open}
        components={components}
        componentsProps={componentsProps}
      >
        {children}
      </PickersModalDialog>
    </WrapperVariantContext.Provider>
  );
}
