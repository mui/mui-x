import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { FieldChangeHandler, UseFieldInternalProps } from './useField.types';
import { PickerValidValue } from '../../models';
import { PickerContext } from '../../components/PickerProvider';
import { InferError } from '../../../models';

export const PickerFieldPrivateContext = React.createContext<PickerFieldPrivateContextValue | null>(
  null,
);

export function useMergeFieldPropsWithPickerContextProps<
  TValue extends PickerValidValue,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TInternalProps extends UseFieldInternalProps<TValue, TEnableAccessibleFieldDOMStructure, any> & {
    minutesStep?: number;
  },
>(props: TInternalProps): typeof props {
  const privateContextValue = React.useContext(PickerFieldPrivateContext);
  // TODO: Replace with useNullablePickerContext
  const publicContextValue = React.useContext(PickerContext);

  // If one of the context is null, the other always will be null as well.
  if (privateContextValue == null || publicContextValue == null) {
    return props;
  }

  const handleChange = useEventCallback<FieldChangeHandler<TValue, InferError<TInternalProps>>>(
    (newValue, ctx) => {
      if (props.onChange) {
        return props.onChange(newValue, ctx);
      }

      return publicContextValue.setValue(newValue, {
        validationError: ctx.validationError,
      });
    },
  );

  return {
    ...props,
    onChange: handleChange,
    value: props.value ?? publicContextValue.value,
    timezone: props.timezone ?? publicContextValue.timezone,
    disabled: props.disabled ?? publicContextValue.disabled,
    // TODO: Once the default value is applied inside useField, props.format should have the priority over publicContextValue.fieldFormat
    format: publicContextValue.fieldFormat ?? props.format,
    formatDensity: props.formatDensity ?? privateContextValue.formatDensity,
    enableAccessibleFieldDOMStructure:
      props.enableAccessibleFieldDOMStructure ??
      privateContextValue.enableAccessibleFieldDOMStructure,
    selectedSections: props.selectedSections ?? privateContextValue.selectedSections,
    onSelectedSectionsChange:
      props.onSelectedSectionsChange ?? privateContextValue.onSelectedSectionsChange,
  };
}

export interface PickerFieldPrivateContextValue
  extends Pick<
    UseFieldInternalProps<any, any, any>,
    | 'formatDensity'
    | 'enableAccessibleFieldDOMStructure'
    | 'selectedSections'
    | 'onSelectedSectionsChange'
  > {}
