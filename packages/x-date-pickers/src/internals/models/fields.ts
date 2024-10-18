import * as React from 'react';
import type { UseFieldInternalProps } from '../hooks/useField';
import { PickerValidDate } from '../../models';
import type { ExportedUseClearableFieldProps } from '../../hooks/useClearableField';

export interface BaseFieldProps<
  TDate extends PickerValidDate,
  TIsRange extends boolean,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
> extends Omit<
      UseFieldInternalProps<TDate, TIsRange, TEnableAccessibleFieldDOMStructure, TError>,
      'format'
    >,
    ExportedUseClearableFieldProps {
  className?: string;
  format?: string;
  disabled?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}
