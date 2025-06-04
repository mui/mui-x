import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';
import { ChartBaseDividerProps } from '../models';
import { useChartsSlots } from '../context/ChartsSlotsContext';
import { chartsToolbarClasses } from './chartToolbarClasses';
import { NotRendered } from '../internals/components/NotRendered';

export interface ToolbarDividerProps extends ChartBaseDividerProps {}

// Need this cast because api-docs-builder does not support the `NotRendered<ChartBaseDividerProps>` expression.
const NotRenderedDivider = NotRendered as unknown as React.ComponentType<ChartBaseDividerProps>;

const Divider = styled(NotRenderedDivider, {
  name: 'MuiChartsToolbar',
  slot: 'Divider',
})(({ theme }) => ({
  margin: theme.spacing(0, 0.5),
  height: '50%',
}));

const ToolbarDivider = React.forwardRef<HTMLHRElement, ToolbarDividerProps>(
  function ToolbarDivider(props, ref) {
    const { className, ...other } = props;
    const { slots, slotProps } = useChartsSlots();

    return (
      <Divider
        as={slots.baseDivider}
        orientation="vertical"
        className={chartsToolbarClasses.divider}
        {...slotProps.baseDivider}
        {...other}
        ref={ref}
      />
    );
  },
);

ToolbarDivider.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  style: PropTypes.object,
} as any;

export { ToolbarDivider };
