import * as React from 'react';
import PropTypes from 'prop-types';
import { FormControlState, useFormControl } from '@mui/material/FormControl';
import { styled, useThemeProps } from '@mui/material/styles';
import { refType } from '@mui/utils';
import composeClasses from '@mui/utils/composeClasses';
import { pickersInputClasses, getPickersInputUtilityClass } from './pickersInputClasses';
import { PickersInputBase, PickersInputBaseProps } from '../PickersInputBase';
import { PickersInputBaseRoot } from '../PickersInputBase/PickersInputBase';

export interface PickersInputProps extends PickersInputBaseProps {
  disableUnderline?: boolean;
}

const PickersInputRoot = styled(PickersInputBaseRoot, {
  name: 'MuiPickersInput',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: OwnerStateType }>(({ theme }) => {
  const light = theme.palette.mode === 'light';
  let bottomLineColor = light ? 'rgba(0, 0, 0, 0.42)' : 'rgba(255, 255, 255, 0.7)';
  if (theme.vars) {
    bottomLineColor = `rgba(${theme.vars.palette.common.onBackgroundChannel} / ${theme.vars.opacity.inputUnderline})`;
  }
  return {
    'label + &': {
      marginTop: 16,
    },
    variants: [
      ...Object.keys((theme.vars ?? theme).palette)
        // @ts-ignore
        .filter((key) => (theme.vars ?? theme).palette[key].main)
        .map((color) => ({
          props: { color },
          style: {
            '&::after': {
              // @ts-ignore
              borderBottom: `2px solid ${(theme.vars || theme).palette[color].main}`,
            },
          },
        })),
      {
        props: { disableUnderline: false },
        style: {
          '&::after': {
            background: 'red',
            left: 0,
            bottom: 0,
            // Doing the other way around crash on IE11 "''" https://github.com/cssinjs/jss/issues/242
            content: '""',
            position: 'absolute',
            right: 0,
            transform: 'scaleX(0)',
            transition: theme.transitions.create('transform', {
              duration: theme.transitions.duration.shorter,
              easing: theme.transitions.easing.easeOut,
            }),
            pointerEvents: 'none', // Transparent to the hover style.
          },
          [`&.${pickersInputClasses.focused}:after`]: {
            // translateX(0) is a workaround for Safari transform scale bug
            // See https://github.com/mui/material-ui/issues/31766
            transform: 'scaleX(1) translateX(0)',
          },
          [`&.${pickersInputClasses.error}`]: {
            '&:before, &:after': {
              borderBottomColor: (theme.vars || theme).palette.error.main,
            },
          },
          '&::before': {
            borderBottom: `1px solid ${bottomLineColor}`,
            left: 0,
            bottom: 0,
            // Doing the other way around crash on IE11 "''" https://github.com/cssinjs/jss/issues/242
            content: '"\\00a0"',
            position: 'absolute',
            right: 0,
            transition: theme.transitions.create('border-bottom-color', {
              duration: theme.transitions.duration.shorter,
            }),
            pointerEvents: 'none', // Transparent to the hover style.
          },
          [`&:hover:not(.${pickersInputClasses.disabled}, .${pickersInputClasses.error}):before`]: {
            borderBottom: `2px solid ${(theme.vars || theme).palette.text.primary}`,
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
              borderBottom: `1px solid ${bottomLineColor}`,
            },
          },
          [`&.${pickersInputClasses.disabled}:before`]: {
            borderBottomStyle: 'dotted',
          },
        },
      },
    ],
  };
});

const useUtilityClasses = (ownerState: OwnerStateType) => {
  const { classes, disableUnderline } = ownerState;

  const slots = {
    root: ['root', !disableUnderline && 'underline'],
    input: ['input'],
  };

  const composedClasses = composeClasses(slots, getPickersInputUtilityClass, classes);

  return {
    ...classes, // forward classes to the PickersInputBase
    ...composedClasses,
  };
};

interface OwnerStateType
  extends FormControlState,
    Omit<PickersInputProps, keyof FormControlState> {}

/**
 * @ignore - internal component.
 */
const PickersInput = React.forwardRef(function PickersInput(
  inProps: PickersInputProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersInput',
  });

  const {
    label,
    autoFocus,
    disableUnderline = false,
    ownerState: ownerStateProp,
    ...other
  } = props;

  const muiFormControl = useFormControl();

  const ownerState = {
    ...props,
    ...ownerStateProp,
    ...muiFormControl,
    disableUnderline,
    color: muiFormControl?.color || 'primary',
  };
  const classes = useUtilityClasses(ownerState);

  return (
    <PickersInputBase
      slots={{ root: PickersInputRoot }}
      {...other}
      label={label}
      classes={classes}
      ref={ref as any}
    />
  );
});

PickersInput.propTypes = {
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
  disableUnderline: PropTypes.bool,
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

export { PickersInput };

(PickersInput as any).muiName = 'Input';
