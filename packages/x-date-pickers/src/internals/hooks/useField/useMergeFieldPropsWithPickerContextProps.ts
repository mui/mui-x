import * as React from 'react';
import { UseFieldInternalProps } from './useField.types';
import { PickerValidValue } from '../../models';
import { PickerContext } from '../../components/PickerProvider';

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
  const privateContextProps = React.useContext(PickerFieldPrivateContext);
  // TODO: Replace with useNullablePickerContext
  const publicContextProps = React.useContext(PickerContext);

  // If one of the context is null, the other always will be null as well.
  if (privateContextProps == null || publicContextProps == null) {
    return props;
  }

  return {
    ...props,
    // TODO: Once the default value is applied inside useField, props.format should have the priority over publicContextProps.fieldFormat
    format: publicContextProps.fieldFormat ?? props.format,
    formatDensity: props.formatDensity ?? privateContextProps.formatDensity,
    enableAccessibleFieldDOMStructure:
      props.enableAccessibleFieldDOMStructure ??
      privateContextProps.enableAccessibleFieldDOMStructure,
    selectedSections: props.selectedSections ?? privateContextProps.selectedSections,
    onSelectedSectionsChange:
      props.onSelectedSectionsChange ?? privateContextProps.onSelectedSectionsChange,
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
