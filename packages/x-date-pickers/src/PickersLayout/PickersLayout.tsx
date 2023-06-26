import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { PickersLayoutProps } from './PickersLayout.types';
import { pickersLayoutClasses, getPickersLayoutUtilityClass } from './pickersLayoutClasses';
import usePickerLayout from './usePickerLayout';
import { DateOrTimeViewWithMeridiem } from '../internals/models';

const useUtilityClasses = (ownerState: PickersLayoutProps<any, any, any>) => {
  const { isLandscape, classes } = ownerState;
  const slots = {
    root: ['root', isLandscape && 'landscape'],
    contentWrapper: ['contentWrapper'],
  };

  return composeClasses(slots, getPickersLayoutUtilityClass, classes);
};

const PickersLayoutRoot = styled('div', {
  name: 'MuiPickersLayout',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: { isLandscape: boolean } }>(({ theme, ownerState }) => ({
  display: 'grid',
  gridAutoColumns: 'max-content auto max-content',
  gridAutoRows: 'max-content auto max-content',
  [`& .${pickersLayoutClasses.toolbar}`]: ownerState.isLandscape
    ? {
        gridColumn: theme.direction === 'rtl' ? 3 : 1,
        gridRow: '2 / 3',
      }
    : { gridColumn: '2 / 4', gridRow: 1 },
  [`.${pickersLayoutClasses.shortcuts}`]: ownerState.isLandscape
    ? { gridColumn: '2 / 4', gridRow: 1 }
    : {
        gridColumn: theme.direction === 'rtl' ? 3 : 1,
        gridRow: '2 / 3',
      },
  [`& .${pickersLayoutClasses.actionBar}`]: { gridColumn: '1 / 4', gridRow: 3 },
}));

PickersLayoutRoot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  as: PropTypes.elementType,
  ownerState: PropTypes.shape({
    isLandscape: PropTypes.bool.isRequired,
  }).isRequired,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { PickersLayoutRoot };

export const PickersLayoutContentWrapper = styled('div', {
  name: 'MuiPickersLayout',
  slot: 'ContentWrapper',
  overridesResolver: (props, styles) => styles.contentWrapper,
})({
  gridColumn: 2,
  gridRow: 2,
  display: 'flex',
  flexDirection: 'column',
});

const PickersLayout = function PickersLayout<
  TValue,
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
>(inProps: PickersLayoutProps<TValue, TDate, TView>) {
  const props = useThemeProps({ props: inProps, name: 'MuiPickersLayout' });

  const { toolbar, content, tabs, actionBar, shortcuts } = usePickerLayout(props);
  const { sx, className, isLandscape, ref, wrapperVariant } = props;

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  return (
    <PickersLayoutRoot
      ref={ref}
      sx={sx}
      className={clsx(className, classes.root)}
      ownerState={ownerState}
    >
      {isLandscape ? shortcuts : toolbar}
      {isLandscape ? toolbar : shortcuts}
      <PickersLayoutContentWrapper className={classes.contentWrapper}>
        {wrapperVariant === 'desktop' ? (
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
};

PickersLayout.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components: PropTypes.object,
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps: PropTypes.object,
  disabled: PropTypes.bool,
  isLandscape: PropTypes.bool.isRequired,
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
   * Force rendering in particular orientation.
   */
  orientation: PropTypes.oneOf(['landscape', 'portrait']),
  readOnly: PropTypes.bool,
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
  wrapperVariant: PropTypes.oneOf(['desktop', 'mobile']),
} as any;

export { PickersLayout };
