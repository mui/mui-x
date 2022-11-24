export type PickerComponentFamily =
  | 'legacy-picker'
  | 'new-picker'
  | 'field'
  | 'calendar'
  | 'clock'
  | 'new-static-picker'
  | 'legacy-static-picker';

export type PickerV6ComponentFamily = Exclude<
  PickerComponentFamily,
  'legacy-picker' | 'legacy-static-picker'
>;
