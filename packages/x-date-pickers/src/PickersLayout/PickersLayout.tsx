import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { PickersLayoutProps } from './PickersLayout.types';
import { pickersLayoutClasses } from './pickersLayoutClasses';
import usePickerLayout from './usePickerLayout';

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
        gridRow: '1 / 3',
      }
    : { gridColumn: '1 / 4', gridRow: 1 },
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

const PickersLayout = React.forwardRef(function PickersLayout(
  inProps: PickersLayoutProps<any, any>,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiPickersLayout' });

  const { toolbar, content, tabs, actionBar } = usePickerLayout(props);
  const { sx, className, isLandscape } = props;

  return (
    <PickersLayoutRoot
      ref={ref}
      sx={sx}
      className={clsx(className, pickersLayoutClasses.root)}
      ownerState={{ isLandscape }}
    >
      {toolbar}
      <PickersLayoutContentWrapper className={pickersLayoutClasses.contentWrapper}>
        {tabs}
        {content}
      </PickersLayoutContentWrapper>
      {actionBar}
    </PickersLayoutRoot>
  );
});

PickersLayout.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * Overrideable components.
   * @default {}
   */
  components: PropTypes.object,
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps: PropTypes.object,
  disabled: PropTypes.bool,
  isLandscape: PropTypes.bool.isRequired,
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  onSetToday: PropTypes.func.isRequired,
  onViewChange: PropTypes.func.isRequired,
  /**
   * Force rendering in particular orientation.
   */
  orientation: PropTypes.oneOf(['landscape', 'portrait']),
  readOnly: PropTypes.bool,
  showToolbar: PropTypes.bool,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  value: PropTypes.any.isRequired,
  view: PropTypes.any.isRequired,
  views: PropTypes.array.isRequired,
  wrapperVariant: PropTypes.oneOf(['desktop', 'mobile']),
} as any;

export { PickersLayout };
