import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses, unstable_useId as useId } from '@mui/utils';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { getFakeTextFieldUtilityClass } from './fakeTextFieldClasses';
import FakeInput from './FakeInput';
import { FakeTextFieldProps } from './FakeTextField.types';

const FakeTextFieldRoot = styled(FormControl, {
  name: 'MuiFakeTextField',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({});

const useUtilityClasses = (ownerState: FakeTextFieldProps) => {
  const { focused, disabled, classes } = ownerState;

  const slots = {
    root: ['root', focused && !disabled && 'focused', disabled && 'disabled'],
    notchedOutline: ['notchedOutline'],
  };

  return composeClasses(slots, getFakeTextFieldUtilityClass, classes);
};

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
    helperText,
    valueType,
    id: idOverride,
    FormHelperTextProps,
    InputLabelProps,
    classes: inClasses,
    inputProps,
    InputProps,
    ...other
  } = props;

  const [focused, setFocused] = React.useState(false);

  const areAllSectionsEmpty = !valueStr && valueType !== 'placeholder';
  const id = useId(idOverride);
  const helperTextId = helperText && id ? `${id}-helper-text` : undefined;
  const inputLabelId = label && id ? `${id}-label` : undefined;

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
      className={clsx(classes.root, inClasses)}
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
      <InputLabel htmlFor={id} id={inputLabelId} shrink={focused || !areAllSectionsEmpty}>
        {label}
      </InputLabel>
      <FakeInput
        ref={ref}
        {...{ elements, valueStr, valueType, areAllSectionsEmpty, onWrapperClick, inputProps }}
        {...other}
        {...InputProps}
      />
      {helperText && (
        <FormHelperText id={helperTextId} {...FormHelperTextProps}>
          {helperText}
        </FormHelperText>
      )}
    </FakeTextFieldRoot>
  );
});
