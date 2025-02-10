// This module override mark all the date object in the doc to be any instead of Date | Dayjs | Moment | DateTime.
// That way we can use date library methods without casting the date object to a specific type.
declare module '@mui/x-date-pickers/models' {
  interface PickerValidDateLookup {
    fakeDocAdapter: any;
  }
}

export {};
