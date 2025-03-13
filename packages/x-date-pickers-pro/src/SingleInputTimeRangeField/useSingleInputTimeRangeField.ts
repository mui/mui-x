'use client';
import { useField } from '@mui/x-date-pickers/internals';
import { UseSingleInputTimeRangeFieldProps } from './SingleInputTimeRangeField.types';
import { useTimeRangeManager } from '../managers';

export const useSingleInputTimeRangeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TAllProps extends UseSingleInputTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TAllProps,
) => {
  const manager = useTimeRangeManager(props);
  return useField({ manager, props });
};
