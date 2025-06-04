'use client';

import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useChartsSlots } from '../context/ChartsSlotsContext';
import { ChartsSlotProps } from '../internals/material';
import { chartsToolbarClasses } from './chartToolbarClasses';

export type ToolbarDividerProps = ChartsSlotProps['baseDivider'];

export function NotRendered<T>(_props: T): React.ReactNode {
  throw new Error('Failed assertion: should not be rendered');
}

const Divider = styled(NotRendered<ChartsSlotProps['baseDivider']>, {
  name: 'MuiChartsToolbar',
  slot: 'Divider',
})(({ theme }) => ({
  margin: theme.spacing(0, 0.5),
  height: '50%',
}));

export const ToolbarDivider = React.forwardRef<HTMLHRElement, ToolbarDividerProps>(
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
