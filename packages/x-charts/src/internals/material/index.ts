import type * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { type ChartsBaseSlots } from '../../models/slots/chartsBaseSlots';
import { type ChartsIconSlots } from '../../models/slots/chartsIconSlots';
import type { ChartBaseToggleButtonProps } from '../../models';

const baseSlots: ChartsBaseSlots = {
  baseButton: Button,
  baseIconButton: IconButton,
  // Toggle button has an href prop that is not compatible with our API.
  baseToggleButton: ToggleButton as unknown as React.ComponentType<ChartBaseToggleButtonProps>,
  baseToggleButtonGroup: ToggleButtonGroup,
};

const iconSlots: ChartsIconSlots = {};

export type ChartsSlots = ChartsBaseSlots & ChartsIconSlots;

export type ChartsSlotProps = {
  [key in keyof ChartsSlots]: React.ComponentProps<ChartsSlots[key]>;
};

export const defaultSlotsMaterial: ChartsSlots = { ...baseSlots, ...iconSlots };
