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
import { PickerValidValue } from '../internals/models';
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
})<{ ownerState: PickerLayoutOwnerState }>({
  display: 'grid',
  gridAutoColumns: 'max-content auto max-content',
  gridAutoRows: 'max-content auto max-content',
  [`& .${pickersLayoutClasses.actionBar}`]: { gridColumn: '1 / 4', gridRow: 3 },
  variants: [
    {
      props: { pickerOrientation: 'landscape', hasShortcuts: false },
      style: {
        [`& .${pickersLayoutClasses.toolbar}`]: {
          gridColumn: 1,
          gridRow: '1 / 3',
        },
      },
    },
    {
      props: {
        pickerOrientation: 'landscape',
        hasShortcuts: true,
      },
      style: {
        [`& .${pickersLayoutClasses.toolbar}`]: {
          gridColumn: '2 / 4',
          gridRow: 1,
          maxWidth: 'max-content',
        },
        [`& .${pickersLayoutClasses.shortcuts}`]: {
          gridColumn: 1,
          gridRow: 2,
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
      props: { hasShortcuts: true, layoutDirection: 'rtl' },
      style: {
        [`& .${pickersLayoutClasses.shortcuts}`]: {
          gridColumn: 4,
        },
      },
    },
  ],
});

export const PickersLayoutContentWrapper = styled('div', {
  name: 'MuiPickersLayout',
  slot: 'ContentWrapper',
})<{ ownerState: PickerLayoutOwnerState }>({
  gridColumn: '2 / 4',
  gridRow: 2,
  display: 'flex',
  flexDirection: 'column',
  variants: [
    {
      props: (p) => p.shouldRenderTimeInASingleColumn === true,
      style: {
        gridColumn: '1 / 4',
      },
    },
  ],
});

type PickersLayoutComponent = (<TValue extends PickerValidValue>(
  props: PickersLayoutProps<TValue> & React.RefAttributes<HTMLDivElement>,
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
const PickersLayout = React.forwardRef(function PickersLayout<TValue extends PickerValidValue>(
  inProps: PickersLayoutProps<TValue>,
  ref: React.Ref<HTMLDivElement>,
) {
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
} as any;

export { PickersLayout };
