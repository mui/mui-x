import { ChartAnyPluginSignature, ChartUsedInstance } from '../../models/plugin';
import { UseChartInteractionInstance } from './useChartInteraction.types';

export function isWithInteractionPlugin<T extends ChartAnyPluginSignature>(
  instance: ChartUsedInstance<T>,
): instance is ChartUsedInstance<T> & UseChartInteractionInstance {
  return (instance as unknown as UseChartInteractionInstance).setPointerCoordinate !== undefined;
}
