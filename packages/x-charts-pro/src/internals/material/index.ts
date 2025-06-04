import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import { ChartsBaseSlots, ChartsIconSlots } from '@mui/x-charts/models';
import { defaultSlotsMaterial as communityDefaultSlotsMaterial } from '@mui/x-charts/internals';
import { BaseMenuItem } from './components/BaseMenuItem';
import { BasePopper } from './components/BasePopper';
import { ChartsBaseSlotsPro } from '../slots/chartsBaseSlots';
import { ChartsExportIcon, ChartsZoomInIcon, ChartsZoomOutIcon } from './icons';
import { ChartsIconSlotsPro } from '../slots/chartsIconSlots';

const baseSlots: Omit<ChartsBaseSlotsPro, keyof ChartsBaseSlots> = {
  baseTooltip: Tooltip,
  basePopper: BasePopper,
  baseMenuList: MenuList,
  baseMenuItem: BaseMenuItem,
};

const iconSlots: Omit<ChartsIconSlotsPro, keyof ChartsIconSlots> = {
  zoomInIcon: ChartsZoomInIcon,
  zoomOutIcon: ChartsZoomOutIcon,
  exportIcon: ChartsExportIcon,
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
