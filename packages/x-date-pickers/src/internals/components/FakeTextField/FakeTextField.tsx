import * as React from 'react';
import { styled } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { fakeTextFieldClasses, getFakeTextFieldUtilityClass } from './fakeTextFieldClasses';
import Outline from './Outline';
import { FieldsTextFieldProps } from '../../models';

const FakeTextFieldRoot = styled(FormControl, {
  name: 'MuiTextField',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({});

const SectionInput = styled('input', {
  name: 'MuiSection',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})(({ value }) => {
  return {
    border: 'none',
    background: 'none',
    outline: 'none',
    margin: 0,
    // fontFamily: 'inherit',
    fontSize: 'inherit',
    color: 'inherit',
    width: `${value ? String(value).length : 2}ch`,
  };
});

const SectionsWrapper = styled('div')(({ theme }) => {
  const borderColor =
    theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)';
  return {
    display: 'flex',
    gap: theme.spacing(0.1),
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '25ch',

    position: 'relative',
    borderRadius: (theme.vars || theme).shape.borderRadius,
    [`&:hover .${fakeTextFieldClasses.notchedOutline}`]: {
      borderColor: (theme.vars || theme).palette.text.primary,
    },
    // borderWidth: 1,
    // borderStyle: 'solid',
    // borderColor: theme.vars
    //   ? `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.23)`
    //   : borderColor,
    padding: '16.5px 14px',

    // Reset on touch devices, it doesn't add specificity
    '@media (hover: none)': {
      [`&:hover .${fakeTextFieldClasses.notchedOutline}`]: {
        borderColor: theme.vars
          ? `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.23)`
          : borderColor,
      },
    },
    [`&.${fakeTextFieldClasses.focused} .${fakeTextFieldClasses.notchedOutline}`]: {
      borderStyle: 'solid',
      borderColor: (theme.vars || theme).palette.primary.main,
      borderWidth: 2,
    },

    [`&.${fakeTextFieldClasses.disabled}`]: {
      [` .${fakeTextFieldClasses.notchedOutline}`]: {
        borderColor: (theme.vars || theme).palette.action.disabled,
      },

      '*': {
        color: (theme.vars || theme).palette.action.disabled,
      },
    },

    //todo: error
  };
});

const NotchedOutlineRoot = styled(Outline, {
  name: 'MuiFakeTextField',
  slot: 'NotchedOutline',
  overridesResolver: (props, styles) => styles.notchedOutline,
})(({ theme }) => {
  const borderColor =
    theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)';
  return {
    borderColor: theme.vars
      ? `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.23)`
      : borderColor,
  };
});

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
}

interface FakeTextFieldProps extends FieldsTextFieldProps {
  elements: FakeTextFieldElement[];
  disabled?: boolean;
}

export const FakeTextField = React.forwardRef(function FakeTextField(
  props: FakeTextFieldProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    elements,
    color = 'primary',
    defaultValue,
    disabled = false,
    error = false,
    InputLabelProps,
    label = 'test',
    variant = 'outlined',
    ...other
  } = props;

  const [focused, setFocused] = React.useState(false);
  const [selectedSection, setSelectedSection] = React.useState<null | number>(null);

  const ownerState = {
    ...props,
    focused,
    disabled,
  };

  const classes = useUtilityClasses(ownerState);

  const onWrapperClick = () => {
    if (!focused) {
      setFocused(true);
      setSelectedSection(0);
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

  return (
    <FakeTextFieldRoot {...{ focused, disabled, variant }}>
      <InputLabel>test</InputLabel>
      <SectionsWrapper
        className={classes.root}
        ref={ref}
        {...{ disabled }}
        onClick={onWrapperClick}
      >
        {elements &&
          elements.map(
            // TODO: rename to before & after, remove type
            ({ startSeparator, endSeparator, type, ...otherElementProps }, elementIndex) => (
              <React.Fragment key={elementIndex}>
                <span>{startSeparator}</span>
                <SectionInput
                  {...{ disabled }}
                  {...otherElementProps}
                  // onFocus and onBlur to simulate the state classes

                  onFocus={() => {
                    setFocused(true);
                    setSelectedSection(elementIndex);
                  }}
                  onBlur={() => {
                    setFocused(false);
                    setSelectedSection(null);
                  }}
                  onChange={() => {}}
                />
                <span>{endSeparator}</span>
              </React.Fragment>
            ),
          )}
        <NotchedOutlineRoot
          notched={focused}
          label="test"
          {...{ ownerState }}
          className={classes.notchedOutline}
        />
      </SectionsWrapper>
    </FakeTextFieldRoot>
  );
});
