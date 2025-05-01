import IconButton from '@mui/material/IconButton';
import type * as React from 'react';
import { ChartsBaseSlots } from '../models/slots/chartsBaseSlots';
import { ChartsIconSlots } from '../models/slots/chartsIconSlots';

const baseSlots: ChartsBaseSlots = {
  baseIconButton: IconButton,
};

const iconSlots: ChartsIconSlots = {};

export interface ChartsToolbarSlots extends ChartsBaseSlots, ChartsIconSlots {}

export type ChartsToolbarSlotProps = {
  [key in keyof ChartsToolbarSlots]: React.ComponentProps<ChartsToolbarSlots[key]>;
};

const materialSlots: ChartsToolbarSlots = { ...baseSlots, ...iconSlots };

export default materialSlots;
