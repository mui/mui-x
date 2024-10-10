import * as React from 'react';
import type { UseFieldInternalProps } from '../hooks/useField';
import { FieldSection, PickerValidDate } from '../../models';
import type { ExportedUseClearableFieldProps } from '../../hooks/useClearableField';
import { MakeRequired } from './helpers';

export interface BaseFieldProps<
  TValue,
  TDate extends PickerValidDate,
  TSection extends FieldSection,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
> extends MakeRequired<
      UseFieldInternalProps<TValue, TDate, TSection, TEnableAccessibleFieldDOMStructure, TError>,
      'value'
    >,
    ExportedUseClearableFieldProps {
  className?: string;
  disabled?: boolean;
  ref?: React.Ref<HTMLDivElement>;
  ownerState?: any;
}
