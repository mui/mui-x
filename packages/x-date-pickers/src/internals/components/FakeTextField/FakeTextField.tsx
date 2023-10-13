import * as React from 'react';
import { styled } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import Stack from '@mui/material/Stack';
import { FieldSection } from '../../../models';
import { FormControl, FormLabel } from '@mui/material';
import {
  FakeTextFieldClasses,
  fakeTextFieldClasses,
  getFakeTextFieldUtilityClass,
} from './fakeTextFieldClasses';

const SectionInput = styled('input', {
  name: 'MuiPickersSection',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})(({ theme, ownerState, value, ...props }) => {
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

const SectionsWrapper = styled('div')(({ theme, ownerState, ...props }) => {
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
    [`&:hover`]: {
      borderColor: (theme.vars || theme).palette.text.primary,
    },
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.vars
      ? `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.23)`
      : borderColor,
    padding: '16.5px 14px',

    // Reset on touch devices, it doesn't add specificity
    '@media (hover: none)': {
      [`&:hover`]: {
        borderColor: theme.vars
          ? `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.23)`
          : borderColor,
      },
    },
    [`&.${fakeTextFieldClasses.focused} `]: {
      borderColor: (theme.vars || theme).palette.primary.main,
      borderWidth: 2,
    },

    [`&.${fakeTextFieldClasses.disabled}`]: {
      borderColor: (theme.vars || theme).palette.action.disabled,
    },

    //todo: error
  };
});

interface FakeTextFieldProps {
  sections: FieldSection[];
  disabled?: boolean;
}

const useUtilityClasses = (ownerState: FakeTextFieldProps & { focused: boolean }) => {
  const { focused, disabled } = ownerState;

  const slots = {
    root: ['root', focused && !disabled && 'focused', disabled && 'disabled'],
    hiddenDaySpacingFiller: ['hiddenDaySpacingFiller'],
  };

  return composeClasses(slots, getFakeTextFieldUtilityClass, []);
};

export function FakeTextField(props: FakeTextFieldProps) {
  const { sections, disabled } = props;

  const [focused, setFocused] = React.useState(false);

  const ownerState = {
    ...props,
    focused,
    disabled,
  };

  const classes = useUtilityClasses(ownerState);

  return (
    <SectionsWrapper className={classes.root}>
      {sections.map((section, index) => (
        <React.Fragment>
          {section.startSeparator}
          <SectionInput
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            size={4}
            key={index}
            value={section.value}
            onChange={() => {}}
          />
          {section.endSeparator}
        </React.Fragment>
      ))}
    </SectionsWrapper>
  );
}
