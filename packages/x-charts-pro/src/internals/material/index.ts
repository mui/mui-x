import { ChartsBaseSlots, ChartsIconSlots } from '@mui/x-charts/models';
import { defaultSlotsMaterial as communityDefaultSlotsMaterial } from '@mui/x-charts/internals';
import { BaseDivider } from './components/BaseDivider';
import { BaseMenuItem } from './components/BaseMenuItem';
import { BaseMenuList } from './components/BaseMenuList';
import { BasePopper } from './components/BasePopper';
import { BaseTooltip } from './components/BaseTooltip';
import { ChartsBaseSlotPropsPro, ChartsBaseSlotsPro } from '../slots/chartsBaseSlots';
import { ChartsExportIcon, ChartsZoomInIcon, ChartsZoomOutIcon } from './icons';
import { ChartsIconSlotPropsPro, ChartsIconSlotsPro } from '../slots/chartsIconSlots';

import './augmentation';

const baseSlots: Omit<ChartsBaseSlotsPro, keyof ChartsBaseSlots> = {
  baseTooltip: BaseTooltip,
  basePopper: BasePopper,
  baseMenuList: BaseMenuList,
  baseMenuItem: BaseMenuItem,
  baseDivider: BaseDivider,
};

const iconSlots: Omit<ChartsIconSlotsPro, keyof ChartsIconSlots> = {
  zoomInIcon: ChartsZoomInIcon,
  zoomOutIcon: ChartsZoomOutIcon,
  exportIcon: ChartsExportIcon,
};

export type ChartsSlotsPro = ChartsBaseSlotsPro & ChartsIconSlotsPro;

export type ChartsSlotPropsPro = ChartsBaseSlotPropsPro & ChartsIconSlotPropsPro;

export const defaultSlotsMaterial: ChartsSlotsPro = {
  ...communityDefaultSlotsMaterial,
  ...baseSlots,
  ...iconSlots,
};
