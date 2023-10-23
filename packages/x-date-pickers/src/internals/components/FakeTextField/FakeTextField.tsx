import * as React from 'react';
import { styled } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import InputLabel from '@mui/material/InputLabel';
import FormControl, { FormControlProps } from '@mui/material/FormControl';
import { getFakeTextFieldUtilityClass } from './fakeTextFieldClasses';
import FakeInput from './FakeInput';
import { FieldsTextFieldProps } from '../../models';

const FakeTextFieldRoot = styled(FormControl, {
  name: 'MuiFakeTextField',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({});

const useUtilityClasses = (ownerState: FakeTextFieldProps & { focused: boolean }) => {
  const { focused, disabled } = ownerState;

  const slots = {
    root: ['root', focused && !disabled && 'focused', disabled && 'disabled'],
    notchedOutline: ['notchedOutline'],
  };

  return composeClasses(slots, getFakeTextFieldUtilityClass, []);
};

export interface FakeTextFieldElement extends React.HTMLAttributes<HTMLDivElement> {
  before: string;
  after: string;
  value: string;
  // remove these after
  startSeparator: string;
  endSeparator: string;
  type: string;
}

interface FakeTextFieldProps {
  elements: FakeTextFieldElement[];
  color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  helperText?: React.ReactNode;
  label?: string;
  size?: 'small' | 'medium';
  variant?: 'filled' | 'outlined' | 'standard';
}

export const FakeTextField = React.forwardRef(function FakeTextField(
  props: FakeTextFieldProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    elements,
    color = 'primary',
    disabled = false,
    error = false,
    label = 'test',
    variant = 'outlined',
    fullWidth = false,
    ...other
  } = props;

  const [focused, setFocused] = React.useState(false);

  const areAllSectionsEmpty = elements.every(({ value }) => !value);

  const ownerState = {
    ...props,
    color,
    disabled,
    error,
    focused,
    variant,
  };

  const classes = useUtilityClasses(ownerState);

  // TODO: delete after behavior implementation
  const onWrapperClick = () => {
    if (!focused) {
      setFocused(true);
      // Access the container element using ref.current
      const container = ref?.current;

      // Find the first input element within the container
      const firstInput = container.querySelector('input');

      // Check if the input element exists before focusing it
      if (firstInput) {
        firstInput.focus();
        firstInput.select();
      }
    }
  };

  // TODO: delete after behavior implementation
  const onFocus = () => {
    setFocused(true);
  };
  const onBlur = () => {
    setFocused(false);
  };

  return (
    <FakeTextFieldRoot
      className={classes.root}
      {...{ focused, disabled, variant, error, color, ownerState, fullWidth, ...other }}
    >
      <InputLabel shrink={focused || !areAllSectionsEmpty}>{label}</InputLabel>
      <FakeInput
        ref={ref}
        {...props}
        {...{ areAllSectionsEmpty, onFocus, onBlur, onWrapperClick }}
      />
    </FakeTextFieldRoot>
  );
});
