import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import { BaseFieldProps } from '@mui/x-date-pickers/internals';

export interface BaseMultiInputFieldProps<TValue, TError>
  extends Omit<BaseFieldProps<TValue, TError>, 'componentsProps'> {
  componentsProps?: {
    input?: SlotComponentProps<
      typeof TextField,
      {},
      { position?: 'start' | 'end' } & Record<string, any>
    >;
  };
}
