import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import { PickersPopper } from '../PickersPopper';
import { PickerViewManager, PickerViewManagerProps } from '../PickerViewManager';
import {
  usePickerState,
  PickerStateValueManager,
  PickerStateProps,
} from '@mui/x-date-pickers/internals';
import { useControlled } from '@mui/material/utils';
import useEventCallback from '@mui/utils/useEventCallback';
import { CalendarOrClockPickerView } from '../../models/views';

export interface DesktopPickerSlotsComponent {
  Field: React.ElementType;
  Input?: React.ElementType;
}

// TODO: Type props of all slots
export interface DesktopPickerSlotsComponentsProps {
  field?: Record<string, any>;
  input?: Record<string, any>;
}

export interface ExportedDesktopPickerProps<TValue, TDate, TView extends CalendarOrClockPickerView>
  extends Omit<PickerStateProps<TValue, TValue>, 'value' | 'onChange'>,
    Omit<PickerViewManagerProps<TValue, TDate, TView>, 'value' | 'onChange' | 'viewRenderers'> {
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

interface DesktopPickerProps<TValue, TDate, TView extends CalendarOrClockPickerView>
  extends ExportedDesktopPickerProps<TValue, TDate, TView>,
    Pick<PickerViewManagerProps<TValue, TDate, TView>, 'viewRenderers'> {
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

export function DesktopPicker<TValue, TDate, TView extends CalendarOrClockPickerView>(
  props: DesktopPickerProps<TValue, TDate, TView>,
) {
  const {
    value: incomingValue,
    defaultValue,
    onChange,
    components,
    componentsProps = {},
    openTo,
    views,
    onViewChange,
    viewRenderers,
  } = props;

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

  const { wrapperProps, pickerProps } = usePickerState(
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
        <PickerViewManager
          openTo={openTo}
          views={views}
          onViewChange={onViewChange}
          viewRenderers={viewRenderers}
          value={pickerProps.parsedValue}
          // TODO: Fix the wrapper info
          onChange={pickerProps.onDateChange}
        />
      </PickersPopper>
    </React.Fragment>
  );
}
