import { ChartsBaseSlots, ChartsIconSlots } from '@mui/x-charts/models';
import Tooltip from '@mui/material/Tooltip';
import { defaultSlotsMaterial as communityDefaultSlotsMaterial } from '@mui/x-charts/internals';
import { ChartsBaseSlotsPro } from '../slots/chartsBaseSlots';
import { ChartsZoomInIcon, ChartsZoomOutIcon } from './icons';
import { ChartsIconSlotsPro } from '../slots/chartsIconSlots';

const baseSlots: Omit<ChartsBaseSlotsPro, keyof ChartsBaseSlots> = {
  baseTooltip: Tooltip,
};

const iconSlots: Omit<ChartsIconSlotsPro, keyof ChartsIconSlots> = {
  zoomInIcon: ChartsZoomInIcon,
  zoomOutIcon: ChartsZoomOutIcon,
};

export type ChartsSlotsPro = ChartsBaseSlotsPro & ChartsIconSlotsPro;

export type ChartsSlotPropsPro = {
  [key in keyof ChartsSlotsPro]: React.ComponentProps<ChartsSlotsPro[key]>;
};

export const defaultSlotsMaterial: ChartsSlotsPro = {
  ...communityDefaultSlotsMaterial,
  ...baseSlots,
  ...iconSlots,
};
