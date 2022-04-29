import * as React from 'react';
import { WrapperVariantContext } from './WrapperVariantContext';
import { PickersModalDialog, ExportedPickerModalProps } from '../PickersModalDialog';
import { DateInputPropsLike } from './WrapperProps';
import { PickerStateWrapperProps } from '../../hooks/usePickerState';

export interface MobileWrapperProps extends ExportedPickerModalProps {
  children?: React.ReactNode;
}

export interface InternalMobileWrapperProps extends MobileWrapperProps, PickerStateWrapperProps {
  DateInputProps: DateInputPropsLike & { ref?: React.Ref<HTMLDivElement> };
  PureDateInputComponent: React.JSXElementConstructor<DateInputPropsLike>;
}

export function MobileWrapper(props: InternalMobileWrapperProps) {
  const {
    cancelText,
    children,
    clearable,
    clearText,
    DateInputProps,
    DialogProps,
    okText,
    onAccept,
    onClear,
    onDismiss,
    onCancel,
    onSetToday,
    open,
    PureDateInputComponent,
    showTodayButton,
    todayText,
    ...other
  } = props;

  return (
    <WrapperVariantContext.Provider value="mobile">
      <PureDateInputComponent {...other} {...DateInputProps} />
      <PickersModalDialog
        cancelText={cancelText}
        clearable={clearable}
        clearText={clearText}
        DialogProps={DialogProps}
        okText={okText}
        onAccept={onAccept}
        onClear={onClear}
        onDismiss={onDismiss}
        onCancel={onCancel}
        onSetToday={onSetToday}
        open={open}
        showTodayButton={showTodayButton}
        todayText={todayText}
      >
        {children}
      </PickersModalDialog>
    </WrapperVariantContext.Provider>
  );
}
