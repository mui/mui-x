/* eslint-disable import/no-duplicates */
// @ts-nocheck
import { usePickerTranslations, usePickerContext } from '@mui/x-date-pickers/hooks';
import { PickerValueType } from '@mui/x-date-pickers/models';
import { FieldRangeSection } from '@mui/x-date-pickers-pro/models';
import { PickerChangeImportance } from '@mui/x-date-pickers/models';

interface DumbComponentProps {
  valueType: PickerValueType;
  foo: string;
  bar: number;
}

const myFunction = (param: PickerValueType) => {
  console.log('Hello World!');
};

function Component() {
  const translations = usePickerTranslations();
  const pickerContext = usePickerContext();

  const onChange = (importance: PickerChangeImportance) => {};

  return null;
}
