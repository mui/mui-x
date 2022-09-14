import * as React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { useSlotProps } from '@mui/base/utils';
import { PickersPopper } from '../PickersPopper';
import { useUtils } from '../../hooks/useUtils';
import { PickerViewManager, PickerViewManagerProps } from '../PickerViewManager';
import { usePickerState2, PickerStateProps2 } from '../../hooks/usePickerState2';
import { PickerStateValueManager } from '../../hooks/usePickerState';
import { CalendarOrClockPickerView } from '../../models/views';
import { MuiPickersAdapter } from '../../models/muiPickersAdapter';
import { Calendar } from '../icons';

export interface DesktopPickerSlotsComponent {
  Field: React.ElementType;
  /**
   * Icon displayed in the open picker button.
   */
  OpenPickerIcon: React.ElementType;
  Input?: React.ElementType;
  /**
   * Button to open the picker.
   * @default IconButton
   */
  OpenPickerButton?: React.ElementType;
}

// TODO: Type props of all slots
export interface DesktopPickerSlotsComponentsProps {
  field?: Record<string, any>;
  input?: Record<string, any>;
  openPickerIcon?: Record<string, any>;
  openPickerButton?: Record<string, any>;
}

export interface ExportedDesktopPickerProps<TValue, TDate, TView extends CalendarOrClockPickerView>
  extends Omit<PickerStateProps2<TValue>, 'value' | 'onChange'>,
    Omit<PickerViewManagerProps<TValue, TDate, TView>, 'value' | 'onChange' | 'renderViews'>,
    PickerStateProps2<TValue> {}

interface DesktopPickerProps<TValue, TDate, TView extends CalendarOrClockPickerView>
  extends ExportedDesktopPickerProps<TValue, TDate, TView>,
    Pick<PickerViewManagerProps<TValue, TDate, TView>, 'renderViews'> {
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
  /**
   * Get aria-label text for control that opens picker dialog. Aria-label text must include selected date. @DateIOType
   * @template TInputDate, TDate
   * @param {TInputDate} date The date from which we want to add an aria-text.
   * @param {MuiPickersAdapter<TDate>} utils The utils to manipulate the date.
   * @returns {string} The aria-text to render inside the dialog.
   * @default (date, utils) => `Choose date, selected date is ${utils.format(utils.date(date), 'fullDate')}`
   */
  getOpenDialogAriaText: (date: TDate, utils: MuiPickersAdapter<TDate>) => string;
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
    renderViews,
    readOnly,
    disabled,
    getOpenDialogAriaText,
  } = props;

  const utils = useUtils<TDate>();

  const {
    wrapperProps,
    fieldProps: additionalFieldProps,
    viewProps,
    openPicker,
  } = usePickerState2(props, props.valueManager, 'desktop');
  const inputRef = React.useRef<HTMLInputElement>(null);

  // TODO: Add prop
  const disableOpenPicker = false;
  const adornmentPosition = 'end';

  const Field = components.Field;
  const fieldProps = useSlotProps({
    elementType: Field,
    externalSlotProps: componentsProps.field,
    additionalProps: additionalFieldProps,
    // TODO: Pass owner state
    ownerState: {},
  });

  const OpenPickerButton = components.OpenPickerButton ?? IconButton;
  const { ownerState: _openPickerButtonOwnerState, ...openPickerButtonProps } = useSlotProps({
    elementType: OpenPickerButton,
    externalSlotProps: componentsProps.openPickerButton,
    additionalProps: {
      disabled: disabled || readOnly,
      onClick: openPicker,
      // TODO: Correctly support date range
      'aria-label': getOpenDialogAriaText(fieldProps.value as any as TDate, utils),
      edge: adornmentPosition,
    },
    // TODO: Pass owner state
    ownerState: {},
  });

  const OpenPickerIcon = components.OpenPickerIcon ?? Calendar;
  const { ownerState: _openPickerIconOwnerState, ...openPickerIconProps } = useSlotProps({
    elementType: OpenPickerIcon,
    externalSlotProps: componentsProps.openPickerIcon,
    // TODO: Pass owner state
    ownerState: {},
  });

  const Input = components.Input!;
  const inputProps = useSlotProps({
    elementType: Input,
    externalSlotProps: componentsProps.input,
    additionalProps: {
      InputProps: {
        [`${adornmentPosition}Adornment`]: (
          <InputAdornment position={adornmentPosition}>
            <OpenPickerButton {...openPickerButtonProps}>
              <OpenPickerIcon {...openPickerIconProps} />
            </OpenPickerButton>
          </InputAdornment>
        ),
      },
    },
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
        componentsProps={{ input: inputProps }}
        inputRef={inputRef}
      />
      <PickersPopper
        role="dialog"
        anchorEl={inputRef.current}
        {...wrapperProps}
        onClose={wrapperProps.onDismiss}
        // components={components}
        // componentsProps={componentsProps}
      >
        <PickerViewManager
          openTo={openTo}
          views={views}
          onViewChange={onViewChange}
          renderViews={renderViews}
          readOnly={readOnly}
          disabled={disabled}
          {...viewProps}
        />
      </PickersPopper>
    </React.Fragment>
  );
}
