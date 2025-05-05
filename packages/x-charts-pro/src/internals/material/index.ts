import { ChartsBaseSlots, ChartsIconSlots } from '@mui/x-charts/models';
import Tooltip from '@mui/material/Tooltip';
import { materialSlots as communityMaterialSlots } from '@mui/x-charts/internals';
import type * as React from 'react';
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

export type ChartsToolbarSlotsPro = ChartsBaseSlotsPro & ChartsIconSlotsPro;

export type ChartsToolbarSlotPropsPro = {
  [key in keyof ChartsToolbarSlotsPro]: React.ComponentProps<ChartsToolbarSlotsPro[key]>;
};

export const materialSlots: ChartsToolbarSlotsPro = {
  ...communityMaterialSlots,
  ...baseSlots,
  ...iconSlots,
};
