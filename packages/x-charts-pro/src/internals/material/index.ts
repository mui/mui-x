import {
  ChartsBaseSlots,
  ChartsIconSlots,
  ChartsBaseSlotsExtension,
  ChartsIconSlotsExtension,
} from '@mui/x-charts/models';
import Tooltip from '@mui/material/Tooltip';
import { materialSlots as communityMaterialSlots } from '@mui/x-charts/internals';
import { ChartsZoomInIcon, ChartsZoomOutIcon } from './icons';

const baseSlots: ChartsBaseSlotsExtension = {
  baseTooltip: Tooltip,
};

const iconSlots: ChartsIconSlotsExtension = {
  zoomInIcon: ChartsZoomInIcon,
  zoomOutIcon: ChartsZoomOutIcon,
};

export type ChartsSlots = ChartsBaseSlots & ChartsIconSlots;

export const materialSlots: ChartsSlots = { ...communityMaterialSlots, ...baseSlots, ...iconSlots };
