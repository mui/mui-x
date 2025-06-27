import { BaseButton } from './components/BaseButton';
import { BaseIconButton } from './components/BaseIconButton';
import { ChartsBaseSlotProps, ChartsBaseSlots } from '../../models/slots/chartsBaseSlots';
import { ChartsIconSlotProps, ChartsIconSlots } from '../../models/slots/chartsIconSlots';

import './augmentation';

const baseSlots: ChartsBaseSlots = {
  baseButton: BaseButton,
  baseIconButton: BaseIconButton,
};

const iconSlots: ChartsIconSlots = {};

export type ChartsSlots = ChartsBaseSlots & ChartsIconSlots;

export type ChartsSlotProps = ChartsBaseSlotProps & ChartsIconSlotProps;

export const defaultSlotsMaterial: ChartsSlots = { ...baseSlots, ...iconSlots };
