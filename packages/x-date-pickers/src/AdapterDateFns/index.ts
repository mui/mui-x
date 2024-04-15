export { AdapterDateFns } from '@mui/x-adapter-date-fns-v2';

declare module '@mui/x-date-pickers/models' {
  interface PickerValidDateLookup {
    'date-fns': Date;
  }
}
