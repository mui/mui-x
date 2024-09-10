import * as React from 'react';
import PropTypes from 'prop-types';
import { FormControlState, useFormControl } from '@mui/material/FormControl';
import { styled, useThemeProps } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system';
import { refType } from '@mui/utils';
import composeClasses from '@mui/utils/composeClasses';
import {
  pickersFilledInputClasses,
  getPickersFilledInputUtilityClass,
} from './pickersFilledInputClasses';
import { PickersInputBaseProps, PickersInputBase } from '../PickersInputBase';
import {
  PickersInputBaseRoot,
  PickersInputBaseSectionsContainer,
} from '../PickersInputBase/PickersInputBase';

export interface PickersFilledInputProps extends PickersInputBaseProps {
  disableUnderline?: boolean;
  hiddenLabel?: boolean;
}

const PickersFilledInputRoot = styled(PickersInputBaseRoot, {
  name: 'MuiPickersFilledInput',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'disableUnderline',
})<{ ownerState: OwnerStateType }>(({ theme }) => {
  const light = theme.palette.mode === 'light';
  const bottomLineColor = light ? 'rgba(0, 0, 0, 0.42)' : 'rgba(255, 255, 255, 0.7)';
  const backgroundColor = light ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.09)';
  const hoverBackground = light ? 'rgba(0, 0, 0, 0.09)' : 'rgba(255, 255, 255, 0.13)';
  const disabledBackground = light ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)';

  return {
    backgroundColor: theme.vars ? theme.vars.palette.FilledInput.bg : backgroundColor,
    borderTopLeftRadius: (theme.vars || theme).shape.borderRadius,
    borderTopRightRadius: (theme.vars || theme).shape.borderRadius,
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeOut,
    }),
    '&:hover': {
      backgroundColor: theme.vars ? theme.vars.palette.FilledInput.hoverBg : hoverBackground,
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: theme.vars ? theme.vars.palette.FilledInput.bg : backgroundColor,
      },
    },
    [`&.${pickersFilledInputClasses.focused}`]: {
      backgroundColor: theme.vars ? theme.vars.palette.FilledInput.bg : backgroundColor,
    },
    [`&.${pickersFilledInputClasses.disabled}`]: {
      backgroundColor: theme.vars ? theme.vars.palette.FilledInput.disabledBg : disabledBackground,
    },
    variants: [
      ...Object.keys((theme.vars ?? theme).palette)
        // @ts-ignore
        .filter((key) => (theme.vars ?? theme).palette[key].main)
        .map((color) => ({
          props: { color, disableUnderline: false },
          style: {
            '&::after': {
              // @ts-ignore
              borderBottom: `2px solid ${(theme.vars || theme).palette[color]?.main}`,
            },
          },
        })),
      {
        props: { disableUnderline: false },
        style: {
          '&::after': {
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
          [`&.${pickersFilledInputClasses.focused}:after`]: {
            // translateX(0) is a workaround for Safari transform scale bug
            // See https://github.com/mui/material-ui/issues/31766
            transform: 'scaleX(1) translateX(0)',
          },
          [`&.${pickersFilledInputClasses.error}`]: {
            '&:before, &:after': {
              borderBottomColor: (theme.vars || theme).palette.error.main,
            },
          },
          '&::before': {
            borderBottom: `1px solid ${
              theme.vars
                ? `rgba(${theme.vars.palette.common.onBackgroundChannel} / ${theme.vars.opacity.inputUnderline})`
                : bottomLineColor
            }`,
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
          [`&:hover:not(.${pickersFilledInputClasses.disabled}, .${pickersFilledInputClasses.error}):before`]:
            {
              borderBottom: `1px solid ${(theme.vars || theme).palette.text.primary}`,
            },
          [`&.${pickersFilledInputClasses.disabled}:before`]: {
            borderBottomStyle: 'dotted',
          },
        },
      },
      {
        props: ({ startAdornment }: OwnerStateType) => !!startAdornment,
        style: {
          paddingLeft: 12,
        },
      },
      {
        props: ({ endAdornment }: OwnerStateType) => !!endAdornment,
        style: {
          paddingRight: 12,
        },
      },
    ],
  };
});

const PickersFilledSectionsContainer = styled(PickersInputBaseSectionsContainer, {
  name: 'MuiPickersFilledInput',
  slot: 'sectionsContainer',
  overridesResolver: (props, styles) => styles.sectionsContainer,
})<{ ownerState: OwnerStateType }>({
  paddingTop: 25,
  paddingRight: 12,
  paddingBottom: 8,
  paddingLeft: 12,
  variants: [
    {
      props: { size: 'small' },
      style: {
        paddingTop: 21,
        paddingBottom: 4,
      },
    },
    {
      props: ({ startAdornment }: OwnerStateType) => !!startAdornment,
      style: {
        paddingLeft: 0,
      },
    },
    {
      props: ({ endAdornment }: OwnerStateType) => !!endAdornment,
      style: {
        paddingRight: 0,
      },
    },
    {
      props: { hiddenLabel: true },
      style: {
        paddingTop: 16,
        paddingBottom: 17,
      },
    },
    {
      props: { hiddenLabel: true, size: 'small' },
      style: {
        paddingTop: 8,
        paddingBottom: 9,
      },
    },
  ],
});

const useUtilityClasses = (ownerState: OwnerStateType) => {
  const { classes, disableUnderline } = ownerState;

  const slots = {
    root: ['root', !disableUnderline && 'underline'],
    input: ['input'],
  };

  const composedClasses = composeClasses(slots, getPickersFilledInputUtilityClass, classes);

  return {
    ...classes, // forward classes to the InputBase
    ...composedClasses,
  };
};

interface OwnerStateType
  extends FormControlState,
    Omit<PickersFilledInputProps, keyof FormControlState> {}

/**
 * @ignore - internal component.
 */
const PickersFilledInput = React.forwardRef(function PickersFilledInput(
  inProps: PickersFilledInputProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPickersFilledInput',
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
    color: muiFormControl?.color || 'primary',
  };
  const classes = useUtilityClasses(ownerState);

  return (
    <PickersInputBase
      slots={{ root: PickersFilledInputRoot, input: PickersFilledSectionsContainer }}
      slotProps={{ root: { disableUnderline } }}
      {...other}
      label={label}
      classes={classes}
      ref={ref as any}
    />
  );
});

PickersFilledInput.propTypes = {
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
  hiddenLabel: PropTypes.bool,
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

export { PickersFilledInput };

(PickersFilledInput as any).muiName = 'Input';
