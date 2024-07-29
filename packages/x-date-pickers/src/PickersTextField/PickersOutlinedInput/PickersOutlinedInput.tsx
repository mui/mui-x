import * as React from 'react';
import PropTypes from 'prop-types';
import { FormControlState, useFormControl } from '@mui/material/FormControl';
import { styled, useThemeProps } from '@mui/material/styles';
import { refType } from '@mui/utils';
import composeClasses from '@mui/utils/composeClasses';
import {
  pickersOutlinedInputClasses,
  getPickersOutlinedInputUtilityClass,
} from './pickersOutlinedInputClasses';
import Outline from './Outline';
import { PickersInputBase, PickersInputBaseProps } from '../PickersInputBase';
import {
  PickersInputBaseRoot,
  PickersInputBaseSectionsContainer,
} from '../PickersInputBase/PickersInputBase';

export interface PickersOutlinedInputProps extends PickersInputBaseProps {
  notched?: boolean;
}

const PickersOutlinedInputRoot = styled(PickersInputBaseRoot, {
  name: 'MuiPickersOutlinedInput',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: OwnerStateType }>(({ theme }) => {
  const borderColor =
    theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)';
  return {
    padding: '0 14px',
    borderRadius: (theme.vars || theme).shape.borderRadius,
    [`&:hover .${pickersOutlinedInputClasses.notchedOutline}`]: {
      borderColor: (theme.vars || theme).palette.text.primary,
    },
    // Reset on touch devices, it doesn't add specificity
    '@media (hover: none)': {
      [`&:hover .${pickersOutlinedInputClasses.notchedOutline}`]: {
        borderColor: theme.vars
          ? `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.23)`
          : borderColor,
      },
    },
    [`&.${pickersOutlinedInputClasses.focused} .${pickersOutlinedInputClasses.notchedOutline}`]: {
      borderStyle: 'solid',
      borderWidth: 2,
    },
    [`&.${pickersOutlinedInputClasses.disabled}`]: {
      [`& .${pickersOutlinedInputClasses.notchedOutline}`]: {
        borderColor: (theme.vars || theme).palette.action.disabled,
      },
      '*': {
        color: (theme.vars || theme).palette.action.disabled,
      },
    },
    [`&.${pickersOutlinedInputClasses.error} .${pickersOutlinedInputClasses.notchedOutline}`]: {
      borderColor: (theme.vars || theme).palette.error.main,
    },
    variants: Object.keys((theme.vars ?? theme).palette)
      // @ts-ignore
      .filter((key) => (theme.vars ?? theme).palette[key]?.main ?? false)
      .map((color) => ({
        props: { color },
        style: {
          [`&.${pickersOutlinedInputClasses.focused}:not(.${pickersOutlinedInputClasses.error}) .${pickersOutlinedInputClasses.notchedOutline}`]:
            {
              // @ts-ignore
              borderColor: (theme.vars || theme).palette[color].main,
            },
        },
      })),
  };
});

const PickersOutlinedInputSectionsContainer = styled(PickersInputBaseSectionsContainer, {
  name: 'MuiPickersOutlinedInput',
  slot: 'SectionsContainer',
  overridesResolver: (props, styles) => styles.sectionsContainer,
})<{ ownerState: OwnerStateType }>({
  padding: '16.5px 0',
  variants: [
    {
      props: { size: 'small' },
      style: {
        padding: '8.5px 0',
      },
    },
  ],
});

const useUtilityClasses = (ownerState: OwnerStateType) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
    notchedOutline: ['notchedOutline'],
    input: ['input'],
  };

  const composedClasses = composeClasses(slots, getPickersOutlinedInputUtilityClass, classes);

  return {
    ...classes, // forward classes to the InputBase
    ...composedClasses,
  };
};

interface OwnerStateType
  extends FormControlState,
    Omit<PickersOutlinedInputProps, keyof FormControlState> {}

/**
 * @ignore - internal component.
 */
const PickersOutlinedInput = React.forwardRef(function PickersOutlinedInput(
  inProps: PickersOutlinedInputProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersOutlinedInput',
  });

  const { label, autoFocus, ownerState: ownerStateProp, notched, ...other } = props;

  const muiFormControl = useFormControl();

  const ownerState = {
    ...props,
    ...ownerStateProp,
    ...muiFormControl,
    color: muiFormControl?.color || 'primary',
  };
  const classes = useUtilityClasses(ownerState);

  return (
    <PickersInputBase
      slots={{ root: PickersOutlinedInputRoot, input: PickersOutlinedInputSectionsContainer }}
      renderSuffix={(state) => (
        <Outline
          shrink={Boolean(notched || state.adornedStart || state.focused || state.filled)}
          notched={Boolean(notched || state.adornedStart || state.focused || state.filled)}
          className={classes.notchedOutline}
          label={
            label != null && label !== '' && muiFormControl?.required ? (
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
      )}
      {...other}
      label={label}
      classes={classes}
      ref={ref as any}
    />
  );
});

PickersOutlinedInput.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Is `true` if the current values equals the empty value.
   * For a single item value, it means that `value === null`
   * For a range value, it means that `value === [null, null]`
   */
  areAllSectionsEmpty: PropTypes.bool.isRequired,
  className: PropTypes.string,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * If true, the whole element is editable.
   * Useful when all the sections are selected.
   */
  contentEditable: PropTypes.bool.isRequired,
  /**
   * The elements to render.
   * Each element contains the prop to edit a section of the value.
   */
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      after: PropTypes.object.isRequired,
      before: PropTypes.object.isRequired,
      container: PropTypes.object.isRequired,
      content: PropTypes.object.isRequired,
    }),
  ).isRequired,
  endAdornment: PropTypes.node,
  fullWidth: PropTypes.bool,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  inputRef: refType,
  label: PropTypes.node,
  margin: PropTypes.oneOf(['dense', 'none', 'normal']),
  name: PropTypes.string,
  notched: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onInput: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  onPaste: PropTypes.func.isRequired,
  ownerState: PropTypes.any,
  readOnly: PropTypes.bool,
  renderSuffix: PropTypes.func,
  sectionListRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.shape({
        getRoot: PropTypes.func.isRequired,
        getSectionContainer: PropTypes.func.isRequired,
        getSectionContent: PropTypes.func.isRequired,
        getSectionIndexFromDOMElement: PropTypes.func.isRequired,
      }),
    }),
  ]),
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * The components used for each slot inside.
   *
   * @default {}
   */
  slots: PropTypes.object,
  startAdornment: PropTypes.node,
  style: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  value: PropTypes.string.isRequired,
} as any;

export { PickersOutlinedInput };

(PickersOutlinedInput as any).muiName = 'Input';
