import * as React from 'react';
import { useForkRef } from '@mui/material/utils';
import { WrapperVariantContext } from './WrapperVariantContext';
import {
  PickersPopper,
  ExportedPickerPopperProps,
  ExportedPickerPaperProps,
  PickersPopperSlotsComponent,
  PickersPopperSlotsComponentsProps,
} from '../PickersPopper';
import { DateInputPropsLike } from './WrapperProps';
import { PickerStateWrapperProps } from '../../hooks/usePickerState';
import { DateInputSlotsComponent } from '../PureDateInput';

export interface DesktopWrapperProps extends ExportedPickerPopperProps, ExportedPickerPaperProps {
  children?: React.ReactNode;
}

export interface DesktopWrapperSlotsComponent
  extends PickersPopperSlotsComponent,
    DateInputSlotsComponent {}

export interface DesktopWrapperSlotsComponentsProps extends PickersPopperSlotsComponentsProps {}

export interface InternalDesktopWrapperProps extends DesktopWrapperProps, PickerStateWrapperProps {
  DateInputProps: DateInputPropsLike & { ref?: React.Ref<HTMLDivElement> };
  KeyboardDateInputComponent: React.JSXElementConstructor<
    DateInputPropsLike & { ref?: React.Ref<HTMLDivElement> }
  >;
  /**
   * Overrideable components.
   * @default {}
   */
  components?: Partial<DesktopWrapperSlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: Partial<DesktopWrapperSlotsComponentsProps>;
}

export function DesktopWrapper(props: InternalDesktopWrapperProps) {
  const {
    children,
    DateInputProps,
    KeyboardDateInputComponent,
    onClear,
    onDismiss,
    onCancel,
    onAccept,
    onSetToday,
    open,
    PopperProps,
    PaperProps,
    TransitionComponent,
    components,
    componentsProps,
  } = props;
  const ownInputRef = React.useRef<HTMLInputElement>(null);
  const inputRef = useForkRef(DateInputProps.inputRef, ownInputRef);

  return (
    <WrapperVariantContext.Provider value="desktop">
      <KeyboardDateInputComponent {...DateInputProps} inputRef={inputRef} />
      <PickersPopper
        role="dialog"
        open={open}
        anchorEl={ownInputRef.current}
        TransitionComponent={TransitionComponent}
        PopperProps={PopperProps}
        PaperProps={PaperProps}
        onClose={onDismiss}
        onCancel={onCancel}
        onClear={onClear}
        onAccept={onAccept}
        onSetToday={onSetToday}
        components={components}
        componentsProps={componentsProps}
      >
        {children}
      </PickersPopper>
    </WrapperVariantContext.Provider>
  );
}
