// @ts-nocheck
import { usePickerTranslations, usePickerContext } from '@mui/x-date-pickers/hooks';
import { PickerValueType } from '@mui/x-date-pickers/models';
import { FieldRangeSection } from '@mui/x-date-pickers-pro/models';
// eslint-disable-next-line no-restricted-imports
import { PickerChangeImportance } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV2';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalaliV2';

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
