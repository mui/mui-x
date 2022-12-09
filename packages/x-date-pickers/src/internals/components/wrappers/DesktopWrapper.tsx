import * as React from 'react';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { WrapperVariantContext } from './WrapperVariantContext';
import {
  PickersPopper,
  PickersPopperSlotsComponent,
  PickersPopperSlotsComponentsProps,
} from '../PickersPopper';
import { DateInputPropsLike } from './WrapperProps';
import { PickerStateWrapperProps } from '../../hooks/usePickerState';
import { DateInputSlotsComponent } from '../PureDateInput';
import { LocalizationProvider } from '../../../LocalizationProvider';
import { PickersInputLocaleText } from '../../../locales/utils/pickersLocaleTextApi';

export interface DesktopWrapperProps {
  children?: React.ReactNode;
}

export interface DesktopWrapperSlotsComponent
  extends PickersPopperSlotsComponent,
    DateInputSlotsComponent {}

export interface DesktopWrapperSlotsComponentsProps extends PickersPopperSlotsComponentsProps {}

export interface InternalDesktopWrapperProps<TDate>
  extends DesktopWrapperProps,
    PickerStateWrapperProps {
  DateInputProps: DateInputPropsLike & { ref?: React.Ref<HTMLDivElement> };
  KeyboardDateInputComponent: React.JSXElementConstructor<
    DateInputPropsLike & { ref?: React.Ref<HTMLDivElement> }
  >;
  /**
   * Overrideable components.
   * @default {}
   */
  components?: DesktopWrapperSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DesktopWrapperSlotsComponentsProps;
  /**
   * Locale for components texts
   */
  localeText?: PickersInputLocaleText<TDate>;
}

// TODO v6: Drop with the legacy pickers
export function DesktopWrapper<TDate>(props: InternalDesktopWrapperProps<TDate>) {
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
    components,
    componentsProps,
    localeText,
  } = props;
  const ownInputRef = React.useRef<HTMLInputElement>(null);
  const inputRef = useForkRef(DateInputProps.inputRef, ownInputRef);

  return (
    <LocalizationProvider localeText={localeText}>
      <WrapperVariantContext.Provider value="desktop">
        <KeyboardDateInputComponent {...DateInputProps} inputRef={inputRef} />
        <PickersPopper
          role="dialog"
          open={open}
          anchorEl={ownInputRef.current}
          onDismiss={onDismiss}
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
    </LocalizationProvider>
  );
}
