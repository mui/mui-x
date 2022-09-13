import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import { PickersPopper } from '../PickersPopper';
import {
  usePickerState,
  PickerStateValueManager,
  PickerStateProps,
} from '@mui/x-date-pickers/internals';
import { useControlled } from '@mui/material/utils';
import useEventCallback from '@mui/utils/useEventCallback';

export interface DesktopPickerSlotsComponent {
  Field: React.ElementType;
  Input?: React.ElementType;
}

// TODO: Type props of all slots
export interface DesktopPickerSlotsComponentsProps {
  field?: Record<string, any>;
  input?: Record<string, any>;
}

export interface ExportedDesktopPickerProps<TValue, TDate>
  extends Omit<PickerStateProps<TValue, TValue>, 'value' | 'onChange'> {
  /**
   * The value of the picker.
   */
  value?: TValue;
  /**
   * The default value.
   * Used when the component is not controlled.
   */
  defaultValue?: TValue;
  /**
   * Callback fired when the value (the selected date) changes.
   * @template TValue
   * @param {TValue} value The new value.
   */
  onChange?: (value: TValue) => void;
}

interface DesktopPickerProps<TValue, TDate> extends ExportedDesktopPickerProps<TValue, TDate> {
  valueManager: PickerStateValueManager<TValue, TValue, TDate>;
  /**
   * Overrideable components.
   * @default {}
   */
  components: DesktopPickerSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DesktopPickerSlotsComponentsProps;
}

export function DesktopPicker<TValue, TDate>(props: DesktopPickerProps<TValue, TDate>) {
  const { value: incomingValue, defaultValue, onChange, components, componentsProps = {} } = props;

  const [value, setValue] = useControlled({
    controlled: incomingValue,
    default: defaultValue,
    name: 'DesktopPicker',
    state: 'value',
  });

  const handleChange = useEventCallback((value: TValue) => {
    setValue(value);
    onChange?.(value);
  });

  const { wrapperProps } = usePickerState(
    { ...props, value, onChange: handleChange },
    props.valueManager,
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  const Field = components.Field;
  const fieldProps = useSlotProps({
    elementType: Field,
    externalSlotProps: componentsProps.field,
    // TODO: Pass owner state
    ownerState: {},
  });

  return (
    <React.Fragment>
      <Field
        {...fieldProps}
        components={{
          Input: components.Input,
        }}
        componentsProps={{ input: componentsProps.input }}
        inputRef={inputRef}
      />
      <PickersPopper
        role="dialog"
        anchorEl={inputRef.current}
        {...wrapperProps}
        onClose={() => {}}
        // components={components}
        // componentsProps={componentsProps}
      >
        HELLO
      </PickersPopper>
    </React.Fragment>
  );
}
