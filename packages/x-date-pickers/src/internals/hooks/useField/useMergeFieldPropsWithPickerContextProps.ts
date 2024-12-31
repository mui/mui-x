import * as React from 'react';
import { UseFieldInternalProps } from './useField.types';
import { PickerValidValue } from '../../models';

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
  const contextProps = React.useContext(PickerFieldPrivateContext);

  if (contextProps == null) {
    return props;
  }

  return {
    ...props,
    // TODO: Once the default value is applied inside useField, props.format should have the priority over contextProps.format
    format: contextProps.format ?? props.format,
    formatDensity: props.formatDensity ?? contextProps.formatDensity,
    enableAccessibleFieldDOMStructure:
      props.enableAccessibleFieldDOMStructure ?? contextProps.enableAccessibleFieldDOMStructure,
    selectedSections: props.selectedSections ?? contextProps.selectedSections,
    onSelectedSectionsChange:
      props.onSelectedSectionsChange ?? contextProps.onSelectedSectionsChange,
  };
}

export interface PickerFieldPrivateContextValue
  extends Pick<
    UseFieldInternalProps<any, any, any>,
    | 'formatDensity'
    | 'enableAccessibleFieldDOMStructure'
    | 'selectedSections'
    | 'onSelectedSectionsChange'
  > {
  // We don't take the `format` prop from `UseFieldInternalProps` to have a custom JSDoc description.
  /**
   * Format of the date when rendered in the input(s).
   * Defaults to localized format based on the used `views`.
   */
  format?: string;
}
