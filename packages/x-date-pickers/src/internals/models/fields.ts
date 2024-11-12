import * as React from 'react';
import type { UseFieldInternalProps } from '../hooks/useField';
import { PickerOwnerState } from '../../models';
import type { ExportedUseClearableFieldProps } from '../../hooks/useClearableField';

export interface BaseFieldProps<
  TIsRange extends boolean,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
> extends Omit<
      UseFieldInternalProps<TIsRange, TEnableAccessibleFieldDOMStructure, TError>,
      'format'
    >,
    ExportedUseClearableFieldProps {
  className?: string;
  format?: string;
  ref?: React.Ref<HTMLDivElement>;
  ownerState?: PickerOwnerState;
}
