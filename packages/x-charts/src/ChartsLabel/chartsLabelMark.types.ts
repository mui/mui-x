import { ChartsLabelMarkProps } from './ChartsLabelMark';

export interface ChartsLabelMarkSlots {
  /**
   * Symbol next to the label of a series.
   */
  labelMark?: React.JSXElementConstructor<ChartsLabelMarkProps>;
}

export interface ChartsLabelMarkSlotProps {
  labelMark?: ChartsLabelMarkProps;
}

export interface ChartsLabelMarkSlotExtension {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: ChartsLabelMarkSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ChartsLabelMarkSlotProps;
}
