import * as React from 'react';
import { styled } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { getFakeTextFieldUtilityClass } from './fakeTextFieldClasses';
import FakeInput from './FakeInput';

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

  // TODO: fix classes
  return composeClasses(slots, getFakeTextFieldUtilityClass, []);
};

export interface FakeTextFieldElement {
  container: React.HTMLAttributes<HTMLSpanElement>;
  content: React.HTMLAttributes<HTMLSpanElement>;
  before: React.HTMLAttributes<HTMLSpanElement>;
  after: React.HTMLAttributes<HTMLSpanElement>;
}

// TODO: move to separate file
// TODO: extend input props
interface FakeTextFieldProps {
  elements: FakeTextFieldElement[];
  color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  // helperText?: React.ReactNode;
  label?: string;
  // size?: 'small' | 'medium';
  variant?: 'filled' | 'outlined' | 'standard';
  valueStr: string;
  // onValueStrChange: React.ChangeEventHandler<HTMLInputElement>;
  // id?: string;
  // InputProps: any;
  // inputProps: any;
  // autoFocus?: boolean;
  // ownerState?: any;
  valueType: 'value' | 'placeholder';
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
    valueStr,
    valueType,
    ...other
  } = props;

  const [focused, setFocused] = React.useState(false);

  const areAllSectionsEmpty = !valueStr && valueType !== 'placeholder';

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
      const firstInput = container.querySelector('.content');

      // Check if the input element exists before focusing it
      if (firstInput) {
        firstInput.focus();
      }
    }
  };

  return (
    <FakeTextFieldRoot
      className={classes.root}
      {...{
        focused,
        disabled,
        variant,
        error,
        color,
        ownerState,
        fullWidth,
        ...other,
      }}
    >
      <InputLabel shrink={focused || !areAllSectionsEmpty}>{label}</InputLabel>
      <FakeInput
        ref={ref}
        {...{ elements, valueStr, valueType, areAllSectionsEmpty, onWrapperClick }}
        {...other}
      />
    </FakeTextFieldRoot>
  );
});
