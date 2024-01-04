import * as React from 'react';
import type { UseFieldInternalProps } from '../hooks/useField';
import type { FieldSection, FieldTextFieldVersion } from '../../models';
import type { ExportedUseClearableFieldProps } from '../../hooks/useClearableField';

export interface BaseFieldProps<
  TValue,
  TDate,
  TSection extends FieldSection,
  TTextFieldVersion extends FieldTextFieldVersion,
  TError,
> extends Omit<UseFieldInternalProps<TValue, TDate, TSection, TTextFieldVersion, TError>, 'format'>,
    ExportedUseClearableFieldProps {
  className?: string;
  format?: string;
  disabled?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}
