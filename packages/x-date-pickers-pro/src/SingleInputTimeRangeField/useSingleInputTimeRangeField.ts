'use client';
import { useField } from '@mui/x-date-pickers/internals';
import { UseSingleInputTimeRangeFieldProps } from './SingleInputTimeRangeField.types';
import { useTimeRangeManager } from '../managers';

export const useSingleInputTimeRangeField = <
  TEnableAccessibleFieldDOMStructure extends boolean,
  TProps extends UseSingleInputTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
>(
  props: TProps,
) => {
  const manager = useTimeRangeManager(props);
  return useField({ manager, props });
};
