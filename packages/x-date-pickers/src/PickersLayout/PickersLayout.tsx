'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { PickerLayoutOwnerState, PickersLayoutProps } from './PickersLayout.types';
import {
  pickersLayoutClasses,
  getPickersLayoutUtilityClass,
  PickersLayoutClasses,
} from './pickersLayoutClasses';
import usePickerLayout from './usePickerLayout';
import { DateOrTimeViewWithMeridiem } from '../internals/models';
import { usePickerContext } from '../hooks/usePickerContext';

const useUtilityClasses = (
  classes: Partial<PickersLayoutClasses> | undefined,
  ownerState: PickerLayoutOwnerState,
) => {
  const { pickerOrientation } = ownerState;
  const slots = {
    root: ['root', pickerOrientation === 'landscape' && 'landscape'],
    contentWrapper: ['contentWrapper'],
  };

  return composeClasses(slots, getPickersLayoutUtilityClass, classes);
};

export const PickersLayoutRoot = styled('div', {
  name: 'MuiPickersLayout',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: PickerLayoutOwnerState }>({
  display: 'grid',
  gridAutoColumns: 'max-content auto max-content',
  gridAutoRows: 'max-content auto max-content',
  [`& .${pickersLayoutClasses.actionBar}`]: { gridColumn: '1 / 4', gridRow: 3 },
  variants: [
    {
      props: { pickerOrientation: 'landscape' },
      style: {
        [`& .${pickersLayoutClasses.toolbar}`]: {
          gridColumn: 1,
          gridRow: '2 / 3',
        },
        [`.${pickersLayoutClasses.shortcuts}`]: { gridColumn: '2 / 4', gridRow: 1 },
      },
    },
    {
      props: { pickerOrientation: 'landscape', isRtl: true },
      style: {
        [`& .${pickersLayoutClasses.toolbar}`]: {
          gridColumn: 3,
        },
      },
    },
    {
      props: { pickerOrientation: 'portrait' },
      style: {
        [`& .${pickersLayoutClasses.toolbar}`]: { gridColumn: '2 / 4', gridRow: 1 },
        [`& .${pickersLayoutClasses.shortcuts}`]: {
          gridColumn: 1,
          gridRow: '2 / 3',
        },
      },
    },
    {
      props: { pickerOrientation: 'portrait', isRtl: true },
      style: {
        [`& .${pickersLayoutClasses.shortcuts}`]: {
          gridColumn: 3,
        },
      },
    },
  ],
});

export const PickersLayoutContentWrapper = styled('div', {
  name: 'MuiPickersLayout',
  slot: 'ContentWrapper',
  overridesResolver: (props, styles) => styles.contentWrapper,
})<{ ownerState: PickerLayoutOwnerState }>({
  gridColumn: 2,
  gridRow: 2,
  display: 'flex',
  flexDirection: 'column',
});

type PickersLayoutComponent = (<TValue, TView extends DateOrTimeViewWithMeridiem>(
  props: PickersLayoutProps<TValue, TView> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

/**
 * Demos:
 *
 * - [Custom layout](https://mui.com/x/react-date-pickers/custom-layout/)
 *
 * API:
 *
 * - [PickersLayout API](https://mui.com/x/api/date-pickers/pickers-layout/)
 */
const PickersLayout = React.forwardRef(function PickersLayout<
  TValue,
  TView extends DateOrTimeViewWithMeridiem,
>(inProps: PickersLayoutProps<TValue, TView>, ref: React.Ref<HTMLDivElement>) {
  const props = useThemeProps({ props: inProps, name: 'MuiPickersLayout' });

  const { toolbar, content, tabs, actionBar, shortcuts, ownerState } = usePickerLayout(props);
  const { orientation, variant } = usePickerContext();
  const { sx, className, classes: classesProp } = props;

  const classes = useUtilityClasses(classesProp, ownerState);

  return (
    <PickersLayoutRoot
      ref={ref}
      sx={sx}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
    >
      {orientation === 'landscape' ? shortcuts : toolbar}
      {orientation === 'landscape' ? toolbar : shortcuts}
      <PickersLayoutContentWrapper className={classes.contentWrapper} ownerState={ownerState}>
        {variant === 'desktop' ? (
          <React.Fragment>
            {content}
            {tabs}
          </React.Fragment>
        ) : (
          <React.Fragment>
            {tabs}
            {content}
          </React.Fragment>
        )}
      </PickersLayoutContentWrapper>
      {actionBar}
    </PickersLayoutRoot>
  );
}) as PickersLayoutComponent;

PickersLayout.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  isValid: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  onSelectShortcut: PropTypes.func.isRequired,
  onSetToday: PropTypes.func.isRequired,
  onViewChange: PropTypes.func.isRequired,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  value: PropTypes.any,
  view: PropTypes.oneOf(['day', 'hours', 'meridiem', 'minutes', 'month', 'seconds', 'year']),
  views: PropTypes.arrayOf(
    PropTypes.oneOf(['day', 'hours', 'meridiem', 'minutes', 'month', 'seconds', 'year']).isRequired,
  ).isRequired,
} as any;

export { PickersLayout };
