import IconButton from '@mui/material/IconButton';
import { ChartsBaseSlots } from '../../models/slots/chartsBaseSlots';
import { ChartsIconSlots } from '../../models/slots/chartsIconSlots';

const baseSlots: ChartsBaseSlots = {
  baseIconButton: IconButton,
};

const iconSlots: ChartsIconSlots = {};

export type ChartsSlots = ChartsBaseSlots & ChartsIconSlots;

export const materialSlots: ChartsSlots = { ...baseSlots, ...iconSlots };
