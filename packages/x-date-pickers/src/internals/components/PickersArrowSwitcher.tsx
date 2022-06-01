import * as React from 'react';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { generateUtilityClasses } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { ArrowLeft, ArrowRight } from './icons';

export interface PickersArrowSwitcherSlotsComponent {
  LeftArrowButton: React.ElementType;
  LeftArrowIcon: React.ElementType;
  RightArrowButton: React.ElementType;
  RightArrowIcon: React.ElementType;
}

export interface PickersArrowSwitcherSlotsComponentsProps {
  leftArrowButton: Record<string, any>;
  rightArrowButton: Record<string, any>;
}

export interface ExportedArrowSwitcherProps {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: Partial<PickersArrowSwitcherSlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: Partial<PickersArrowSwitcherSlotsComponentsProps>;
  /**
   * Left arrow icon aria-label text.
   * @deprecated
   */
  leftArrowButtonText?: string;
  /**
   * Right arrow icon aria-label text.
   * @deprecated
   */
  rightArrowButtonText?: string;
}

interface ArrowSwitcherProps
  extends ExportedArrowSwitcherProps,
    Omit<React.HTMLProps<HTMLDivElement>, 'ref'> {
  children?: React.ReactNode;
  isLeftDisabled: boolean;
  isLeftHidden?: boolean;
  isRightDisabled: boolean;
  isRightHidden?: boolean;
  onLeftClick: () => void;
  onRightClick: () => void;
}

const classes = generateUtilityClasses('MuiPickersArrowSwitcher', ['root', 'spacer', 'button']);

const PickersArrowSwitcherRoot = styled('div', {
  name: 'MuiPickersArrowSwitcher',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{
  ownerState: ArrowSwitcherProps;
}>({
  display: 'flex',
});

const PickersArrowSwitcherSpacer = styled('div', {
  name: 'MuiPickersArrowSwitcher',
  slot: 'Spacer',
  overridesResolver: (props, styles) => styles.spacer,
})<{
  ownerState: ArrowSwitcherProps;
}>(({ theme }) => ({
  width: theme.spacing(3),
}));

const PickersArrowSwitcherButton = styled(IconButton, {
  name: 'MuiPickersArrowSwitcher',
  slot: 'Button',
  overridesResolver: (props, styles) => styles.button,
})<{
  ownerState: ArrowSwitcherProps;
}>(({ ownerState }) => ({
  ...(ownerState.hidden && {
    visibility: 'hidden',
  }),
}));

export const PickersArrowSwitcher = React.forwardRef(function PickersArrowSwitcher(
  props: Omit<ArrowSwitcherProps, 'as'>,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    children,
    className,
    components,
    componentsProps,
    isLeftDisabled,
    isLeftHidden,
    isRightDisabled,
    isRightHidden,
    leftArrowButtonText,
    onLeftClick,
    onRightClick,
    rightArrowButtonText,
    ...other
  } = props;
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';

  const leftArrowButtonProps = componentsProps?.leftArrowButton || {};
  const LeftArrowIcon = components?.LeftArrowIcon || ArrowLeft;

  const rightArrowButtonProps = componentsProps?.rightArrowButton || {};
  const RightArrowIcon = components?.RightArrowIcon || ArrowRight;

  const ownerState = props;

  return (
    <PickersArrowSwitcherRoot
      ref={ref}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      {...other}
    >
      <PickersArrowSwitcherButton
        as={components?.LeftArrowButton}
        size="small"
        aria-label={leftArrowButtonText}
        title={leftArrowButtonText}
        disabled={isLeftDisabled}
        edge="end"
        onClick={onLeftClick}
        {...leftArrowButtonProps}
        className={clsx(classes.button, leftArrowButtonProps.className)}
        ownerState={{ ...ownerState, ...leftArrowButtonProps, hidden: isLeftHidden }}
      >
        {isRtl ? <RightArrowIcon /> : <LeftArrowIcon />}
      </PickersArrowSwitcherButton>
      {children ? (
        <Typography variant="subtitle1" component="span">
          {children}
        </Typography>
      ) : (
        <PickersArrowSwitcherSpacer className={classes.spacer} ownerState={ownerState} />
      )}
      <PickersArrowSwitcherButton
        as={components?.RightArrowButton}
        size="small"
        aria-label={rightArrowButtonText}
        title={rightArrowButtonText}
        edge="start"
        disabled={isRightDisabled}
        onClick={onRightClick}
        {...rightArrowButtonProps}
        className={clsx(classes.button, rightArrowButtonProps.className)}
        ownerState={{ ...ownerState, ...rightArrowButtonProps, hidden: isRightHidden }}
      >
        {isRtl ? <LeftArrowIcon /> : <RightArrowIcon />}
      </PickersArrowSwitcherButton>
    </PickersArrowSwitcherRoot>
  );
});
