import * as React from 'react';
import type { UseFieldInternalProps } from './useField';
import { FieldRef } from '../../models';
import { PickerRangeValue, PickerValue } from '../models';

export const PickerFieldPrivateContext = React.createContext<PickerFieldPrivateContextValue | null>(
  null,
);

export function useNullableFieldPrivateContext() {
  return React.useContext(PickerFieldPrivateContext);
}

export interface PickerFieldPrivateContextValue
  extends Pick<
    UseFieldInternalProps<any, any, any>,
    | 'formatDensity'
    | 'enableAccessibleFieldDOMStructure'
    | 'selectedSections'
    | 'onSelectedSectionsChange'
  > {
  fieldRef: React.RefObject<FieldRef<PickerValue> | FieldRef<PickerRangeValue> | null>;
}
