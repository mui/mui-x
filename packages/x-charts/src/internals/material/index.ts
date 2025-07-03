import type * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { ChartsBaseSlots } from '../../models/slots/chartsBaseSlots';
import { ChartsIconSlots } from '../../models/slots/chartsIconSlots';

const baseSlots: ChartsBaseSlots = {
  baseButton: Button,
  baseIconButton: IconButton,
};

const iconSlots: ChartsIconSlots = {};

export type ChartsSlots = ChartsBaseSlots & ChartsIconSlots;

export type ChartsSlotProps = {
  [key in keyof ChartsSlots]: React.ComponentProps<ChartsSlots[key]>;
};

export const defaultSlotsMaterial: ChartsSlots = { ...baseSlots, ...iconSlots };
