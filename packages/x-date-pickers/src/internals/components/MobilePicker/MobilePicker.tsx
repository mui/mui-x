import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import { PickersModalDialog } from '../PickersModalDialog';
import { useUtils } from '../../hooks/useUtils';
import { PickerViewManager } from '../PickerViewManager';
import { usePickerState2 } from '../../hooks/usePickerState2';
import { CalendarOrClockPickerView } from '../../models/views';
import { MobilePickerProps } from './MobilePicker.types';
import { onSpaceOrEnter } from '../../utils/utils';

export function MobilePicker<TValue, TDate, TView extends CalendarOrClockPickerView>(
  props: MobilePickerProps<TValue, TDate, TView>,
) {
  const {
    // Props provided by the picker
    getOpenDialogAriaText,
    renderViews,
    valueManager,

    // Props provided outside the picker
    components,
    componentsProps = {},
    className,
    openTo,
    views,
    inputFormat,
    onViewChange,
    readOnly,
    disabled,
  } = props;

  const utils = useUtils<TDate>();

  const {
    wrapperProps,
    fieldProps: pickerStateFieldProps,
    viewProps,
    openPicker,
  } = usePickerState2(props, valueManager, 'mobile');

  const Field = components.Field;
  const fieldProps = useSlotProps({
    elementType: Field,
    externalSlotProps: componentsProps.field,
    additionalProps: {
      ...pickerStateFieldProps,
      readOnly: true,
      disabled,
      className,
      format: inputFormat,
    },
    // TODO: Pass owner state
    ownerState: {},
  });

  const Input = components.Input!;
  const inputProps = useSlotProps({
    elementType: Input,
    externalSlotProps: componentsProps.input,
    additionalProps: {
      onClick: props.readOnly ? undefined : openPicker,
      onKeyDown: onSpaceOrEnter(openPicker),
      // TODO: Correctly support date range
      'aria-label': getOpenDialogAriaText(fieldProps.value as any as TDate, utils),
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
      />
      <PickersModalDialog
        {...wrapperProps}
        components={components}
        componentsProps={componentsProps}
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
      </PickersModalDialog>
    </React.Fragment>
  );
}
