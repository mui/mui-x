import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { BaseFieldProps } from '@mui/x-date-pickers/internals';

export interface BaseMultiInputFieldProps<TValue, TError>
  extends Omit<BaseFieldProps<TValue, TError>, 'componentsProps'> {
  componentsProps?: {
    root?: SlotComponentProps<typeof Stack, {}, Record<string, any>>;
    input?: SlotComponentProps<
      typeof TextField,
      {},
      { position?: 'start' | 'end' } & Record<string, any>
    >;
  };
}
