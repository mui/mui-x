import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Divider from '@mui/material/Divider';
import {
  PickersLayoutContentWrapper,
  PickersLayoutProps,
  PickersLayoutRoot,
  pickersLayoutClasses,
  usePickerLayout,
} from '../PickersLayout';
import { DateOrTimeViewWithMeridiem } from '../internals/models/common';
import { usePickerContext } from '../hooks/usePickerContext';

type DesktopDateTimePickerLayoutComponent = (<TValue, TView extends DateOrTimeViewWithMeridiem>(
  props: PickersLayoutProps<TValue, TView> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

/**
 * @ignore - internal component.
 */
const DesktopDateTimePickerLayout = React.forwardRef(function DesktopDateTimePickerLayout<
  TValue,
  TView extends DateOrTimeViewWithMeridiem,
>(props: PickersLayoutProps<TValue, TView>, ref: React.Ref<HTMLDivElement>) {
  const { toolbar, tabs, content, actionBar, shortcuts, ownerState } = usePickerLayout(props);
  const { orientation } = usePickerContext();
  const { sx, className, classes } = props;
  const isActionBarVisible = actionBar && (actionBar.props.actions?.length ?? 0) > 0;

  return (
    <PickersLayoutRoot
      ref={ref}
      className={clsx(pickersLayoutClasses.root, classes?.root, className)}
      sx={[
        {
          [`& .${pickersLayoutClasses.tabs}`]: { gridRow: 4, gridColumn: '1 / 4' },
          [`& .${pickersLayoutClasses.actionBar}`]: { gridRow: 5 },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      ownerState={ownerState}
    >
      {orientation === 'landscape' ? shortcuts : toolbar}
      {orientation === 'landscape' ? toolbar : shortcuts}
      <PickersLayoutContentWrapper
        className={clsx(pickersLayoutClasses.contentWrapper, classes?.contentWrapper)}
        ownerState={ownerState}
        sx={{ display: 'grid' }}
      >
        {content}
        {tabs}
        {isActionBarVisible && <Divider sx={{ gridRow: 3, gridColumn: '1 / 4' }} />}
      </PickersLayoutContentWrapper>
      {actionBar}
    </PickersLayoutRoot>
  );
}) as DesktopDateTimePickerLayoutComponent;

DesktopDateTimePickerLayout.propTypes = {
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

export { DesktopDateTimePickerLayout };
