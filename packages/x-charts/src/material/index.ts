import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { ChartsBaseSlots } from '../models/slots/chartsBaseSlots';
import { ChartsIconSlots } from '../models/slots/chartsIconSlots';
import { ChartsZoomInIcon, ChartsZoomOutIcon } from './icons';

const baseSlots: ChartsBaseSlots = {
  baseTooltip: Tooltip,
  baseIconButton: IconButton,
};

const iconSlots: ChartsIconSlots = {
  zoomInIcon: ChartsZoomInIcon,
  zoomOutIcon: ChartsZoomOutIcon,
};

export type ChartsSlots = ChartsBaseSlots & ChartsIconSlots;

const materialSlots: ChartsSlots = { ...baseSlots, ...iconSlots };

export default materialSlots;
