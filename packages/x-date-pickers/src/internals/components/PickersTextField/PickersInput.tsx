import * as React from 'react';
import clsx from 'clsx';
import Box from '@mui/material/Box';
import { FormControlState, useFormControl } from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import useForkRef from '@mui/utils/useForkRef';
import composeClasses from '@mui/utils/composeClasses';
import capitalize from '@mui/utils/capitalize';
import visuallyHidden from '@mui/utils/visuallyHidden';
import { pickersInputClasses, getPickersInputUtilityClass } from './pickersTextFieldClasses';
import Outline from './Outline';
import { PickersInputProps } from './PickersInput.types';

const PickersInputRoot = styled(Box, {
  name: 'MuiPickersInput',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: OwnerStateType }>(({ theme, ownerState }) => {
  const borderColor =
    theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)';
  return {
    cursor: 'text',
    padding: '16.5px 14px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: ownerState.fullWidth ? '100%' : '25ch',
    position: 'relative',
    outline: 'none',
    borderRadius: (theme.vars || theme).shape.borderRadius,
    [`&:hover .${pickersInputClasses.notchedOutline}`]: {
      borderColor: (theme.vars || theme).palette.text.primary,
    },

    // Reset on touch devices, it doesn't add specificity
    '@media (hover: none)': {
      [`&:hover .${pickersInputClasses.notchedOutline}`]: {
        borderColor: theme.vars
          ? `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.23)`
          : borderColor,
      },
    },
    [`&.${pickersInputClasses.focused} .${pickersInputClasses.notchedOutline}`]: {
      borderStyle: 'solid',
      borderColor: (theme.vars || theme).palette[ownerState.color!].main,
      borderWidth: 2,
    },
    [`&.${pickersInputClasses.disabled}`]: {
      [`& .${pickersInputClasses.notchedOutline}`]: {
        borderColor: (theme.vars || theme).palette.action.disabled,
      },

      '*': {
        color: (theme.vars || theme).palette.action.disabled,
      },
    },

    [`&.${pickersInputClasses.error} .${pickersInputClasses.notchedOutline}`]: {
      borderColor: (theme.vars || theme).palette.error.main,
    },

    ...(ownerState.size === 'small' && {
      padding: '8.5px 14px',
    }),
  };
});

const PickersInputSectionsContainer = styled('div', {
  name: 'MuiPickersInput',
  slot: 'SectionsContainer',
  overridesResolver: (props, styles) => styles.sectionsContainer,
})<{ ownerState: OwnerStateType }>(({ theme, ownerState }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 'inherit',
  lineHeight: '1.4375em', // 23px
  flexGrow: 1,
  outline: 'none',
  ...(!(ownerState.adornedStart || ownerState.focused || ownerState.filled) && {
    color: 'currentColor',
    ...(ownerState.label == null &&
      (theme.vars
        ? {
            opacity: theme.vars.opacity.inputPlaceholder,
          }
        : {
            opacity: theme.palette.mode === 'light' ? 0.42 : 0.5,
          })),
    ...(ownerState.label != null && { opacity: 0 }),
  }),
}));

const PickersInputSection = styled('span', {
  name: 'MuiPickersInput',
  slot: 'Section',
  overridesResolver: (props, styles) => styles.section,
})(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 'inherit',
  lineHeight: '1.4375em', // 23px
  flexGrow: 1,
}));

const PickersInputContent = styled('span', {
  name: 'MuiPickersInput',
  slot: 'SectionContent',
  overridesResolver: (props, styles) => styles.content,
})(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  lineHeight: '1.4375em', // 23px
  letterSpacing: 'inherit',
  width: 'fit-content',
}));

const PickersInputSeparator = styled('span', {
  name: 'MuiPickersInput',
  slot: 'Separator',
  overridesResolver: (props, styles) => styles.separator,
})(() => ({
  whiteSpace: 'pre',
}));

const PickersInputInput = styled('input', {
  name: 'MuiPickersInput',
  slot: 'Input',
  overridesResolver: (props, styles) => styles.hiddenInput,
})({
  ...visuallyHidden,
});

const NotchedOutlineRoot = styled(Outline, {
  name: 'MuiPickersInput',
  slot: 'NotchedOutline',
  overridesResolver: (props, styles) => styles.notchedOutline,
})<{ ownerState: OwnerStateType }>(({ theme }) => {
  const borderColor =
    theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)';
  return {
    borderColor: theme.vars
      ? `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.23)`
      : borderColor,
  };
});

const useUtilityClasses = (ownerState: OwnerStateType) => {
  const {
    focused,
    disabled,
    error,
    classes,
    fullWidth,
    readOnly,
    color,
    size,
    endAdornment,
    startAdornment,
  } = ownerState;

  const slots = {
    root: [
      'root',
      focused && !disabled && 'focused',
      disabled && 'disabled',
      readOnly && 'readOnly',
      error && 'error',
      fullWidth && 'fullWidth',
      `color${capitalize(color!)}`,
      size === 'small' && 'inputSizeSmall',
      Boolean(startAdornment) && 'adornedStart',
      Boolean(endAdornment) && 'adornedEnd',
    ],
    notchedOutline: ['notchedOutline'],
    input: ['input'],
    sectionsContainer: ['sectionsContainer'],
    sectionContent: ['sectionContent'],
    sectionBefore: ['sectionBefore'],
    sectionAfter: ['sectionAfter'],
  };

  return composeClasses(slots, getPickersInputUtilityClass, classes);
};

interface OwnerStateType
  extends FormControlState,
    Omit<PickersInputProps, keyof FormControlState> {}

export const PickersInput = React.forwardRef(function PickersInput(
  props: PickersInputProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    elements,
    areAllSectionsEmpty,
    defaultValue,
    label,
    value,
    onChange,
    id,
    autoFocus,
    endAdornment,
    startAdornment,
    contentEditable,
    tabIndex,
    fullWidth,

    inputProps,
    inputRef,
    sectionsContainerRef,
    ...other
  } = props;

  const rootRef = React.useRef<HTMLDivElement>(null);
  const handleRootRef = useForkRef(ref, rootRef);
  const handleInputRef = useForkRef(inputProps?.ref, inputRef);

  const muiFormControl = useFormControl();
  if (!muiFormControl) {
    throw new Error('MUI: PickersInput should always be used inside a PickersTextField component');
  }

  const handleInputFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    // Fix a bug with IE11 where the focus/blur events are triggered
    // while the component is disabled.
    if (muiFormControl.disabled) {
      event.stopPropagation();
      return;
    }

    muiFormControl.onFocus?.(event);
  };

  React.useEffect(() => {
    if (muiFormControl) {
      muiFormControl.setAdornedStart(Boolean(startAdornment));
    }
  }, [muiFormControl, startAdornment]);

  React.useEffect(() => {
    if (!muiFormControl) {
      return;
    }

    if (areAllSectionsEmpty) {
      muiFormControl.onEmpty();
    } else {
      muiFormControl.onFilled();
    }
  }, [muiFormControl, areAllSectionsEmpty]);

  const ownerState: OwnerStateType = {
    ...(props as Omit<PickersInputProps, keyof FormControlState>),
    ...muiFormControl,
  };

  const classes = useUtilityClasses(ownerState);

  return (
    <PickersInputRoot
      {...other}
      className={classes.root}
      ownerState={ownerState}
      aria-invalid={muiFormControl.error}
      ref={handleRootRef}
    >
      {startAdornment}
      <PickersInputSectionsContainer
        ownerState={ownerState}
        className={classes.sectionsContainer}
        contentEditable={contentEditable}
        suppressContentEditableWarning
        onFocus={handleInputFocus}
        onBlur={muiFormControl.onBlur}
        tabIndex={tabIndex}
        ref={sectionsContainerRef}
      >
        {contentEditable ? (
          elements
            .map(
              ({ content, before, after }) =>
                `${before.children}${content.children}${after.children}`,
            )
            .join('')
        ) : (
          <React.Fragment>
            {elements.map(({ container, content, before, after }, elementIndex) => (
              <PickersInputSection key={elementIndex} {...container}>
                <PickersInputSeparator
                  {...before}
                  className={clsx(pickersInputClasses.sectionBefore, before?.className)}
                />
                <PickersInputContent
                  {...content}
                  suppressContentEditableWarning
                  className={clsx(pickersInputClasses.sectionContent, content?.className)}
                  {...{ ownerState }}
                />
                <PickersInputSeparator
                  {...after}
                  className={clsx(pickersInputClasses.sectionAfter, after?.className)}
                />
              </PickersInputSection>
            ))}
          </React.Fragment>
        )}
      </PickersInputSectionsContainer>
      {endAdornment}
      <NotchedOutlineRoot
        shrink={muiFormControl.adornedStart || muiFormControl.focused || muiFormControl.filled}
        notched={muiFormControl.adornedStart || muiFormControl.focused || muiFormControl.filled}
        className={classes.notchedOutline}
        label={
          label != null && label !== '' && muiFormControl.required ? (
            <React.Fragment>
              {label}
              &thinsp;{'*'}
            </React.Fragment>
          ) : (
            label
          )
        }
        ownerState={ownerState}
      />
      <PickersInputInput
        className={classes.input}
        value={value}
        onChange={onChange}
        id={id}
        aria-hidden="true"
        tabIndex={-1}
        {...inputProps}
        ref={handleInputRef}
      />
    </PickersInputRoot>
  );
});

(PickersInput as any).muiName = 'Input';
