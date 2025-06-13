// @ts-nocheck
import { usePickerTranslations, usePickerContext } from '@mui/x-date-pickers/hooks';
import { PickerValueType } from '@mui/x-date-pickers/models';
import { FieldRangeSection } from '@mui/x-date-pickers-pro/models';

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

  return null;
}
