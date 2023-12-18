import * as React from 'react';
import type { UseFieldInternalProps } from '../hooks/useField';
import type { FieldSection } from '../../models';
import type { ExportedUseClearableFieldProps } from '../../hooks/useClearableField';

export interface BaseFieldProps<
  TValue,
  TDate,
  TSection extends FieldSection,
  TUseV6TextField extends boolean,
  TError,
> extends Omit<UseFieldInternalProps<TValue, TDate, TSection, TUseV6TextField, TError>, 'format'>,
    ExportedUseClearableFieldProps {
  className?: string;
  format?: string;
  disabled?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}
