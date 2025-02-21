// @ts-nocheck
import { usePickersTranslations, usePickersContext } from '@mui/x-date-pickers/hooks';
import { FieldValueType } from '@mui/x-date-pickers/models';
import { RangeFieldSection } from '@mui/x-date-pickers-pro/models';

interface DumbComponentProps {
  valueType: FieldValueType;
  foo: string;
  bar: number;
}

const myFunction = (param: FieldValueType) => {
  console.log('Hello World!');
};

function Component() {
  const translations = usePickersTranslations();
  const pickerContext = usePickersContext();

  return null;
}
