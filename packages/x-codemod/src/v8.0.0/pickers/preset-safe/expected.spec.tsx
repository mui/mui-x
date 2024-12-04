// @ts-nocheck
import { PickerValueType } from '@mui/x-date-pickers/models';

interface DumbComponentProps {
  valueType: PickerValueType;
  foo: string;
  bar: number;
}

const myFunction = (param: PickerValueType) => {
  console.log('Hello World!');
};
