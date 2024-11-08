/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-restricted-imports */
// @ts-nocheck
import * as React from 'react';
import { PickerValueType, useSplitFieldProps } from '@mui/x-date-pickers';

const DumbComponent = () => {
  const valueType: PickerValueType = 'date';
  const { internalProps, forwardedProps } = useSplitFieldProps({}, valueType);
  return <React.Fragment></React.Fragment>;
};
