import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import { TextFieldProps } from '@mui/material/TextField';
import { PickersModalDialog } from '../../components/PickersModalDialog';
import { CalendarOrClockPickerView } from '../../models';
import { UseMobilePickerParams } from './useMobilePicker.types';
import { usePicker } from '../usePicker';
import { onSpaceOrEnter } from '../../utils/utils';
import { useUtils } from '../useUtils';

export const useMobilePicker = <TValue, TDate, TView extends CalendarOrClockPickerView>({
  props,
  valueManager,
  renderViews: renderViewsParam,
  getOpenDialogAriaText,
}: UseMobilePickerParams<TValue, TDate, TView>) => {
  const { components, componentsProps = {}, className, inputFormat, disabled } = props;

  const utils = useUtils<TDate>();

  const {
    field: headlessPickerFieldResponse,
    renderViews,
    actions,
    open,
  } = usePicker({ props, valueManager, wrapperVariant: 'mobile', renderViews: renderViewsParam });

  const Field = components.Field;
  const fieldProps = useSlotProps({
    elementType: Field,
    externalSlotProps: componentsProps.field,
    additionalProps: {
      ...headlessPickerFieldResponse,
      readOnly: true,
      disabled,
      className,
      format: inputFormat,
    },
    // TODO: Pass owner state
    ownerState: {},
  });

  const Input = components.Input!;
  const inputProps: TextFieldProps = useSlotProps({
    elementType: Input,
    externalSlotProps: componentsProps.input,
    additionalProps: {
      onClick: props.readOnly ? undefined : actions.onOpen,
      onKeyDown: onSpaceOrEnter(actions.onOpen),
    },
    // TODO: Pass owner state
    ownerState: {},
  });

  const htmlInputProps = {
    ...inputProps.inputProps,
    // TODO: Correctly support date range
    'aria-label': getOpenDialogAriaText(fieldProps.value as any as TDate, utils),
  };

  const renderPicker = () => (
    <React.Fragment>
      <Field
        {...fieldProps}
        components={{
          Input: components.Input,
        }}
        componentsProps={{ input: { ...inputProps, inputProps: htmlInputProps } }}
      />
      <PickersModalDialog
        {...actions}
        open={open}
        components={components}
        componentsProps={componentsProps}
      >
        {renderViews()}
      </PickersModalDialog>
    </React.Fragment>
  );

  return { renderPicker };
};
