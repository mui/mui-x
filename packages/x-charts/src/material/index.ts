import Tooltip from '@mui/material/Tooltip';
import { ChartsBaseSlots } from '../models/slots/chartsBaseSlots';
import { ChartsIconSlots } from '../models/slots/chartsIconSlots';
import { ChartsZoomInIcon, ChartsZoomOutIcon } from './icons';

const baseSlots: ChartsBaseSlots = {
  baseTooltip: Tooltip,
};

const iconSlots: ChartsIconSlots = {
  zoomInIcon: ChartsZoomInIcon,
  zoomOutIcon: ChartsZoomOutIcon,
};

export type ChartsSlots = ChartsBaseSlots & ChartsIconSlots;

const materialSlots: ChartsSlots = { ...baseSlots, ...iconSlots };

export default materialSlots;
