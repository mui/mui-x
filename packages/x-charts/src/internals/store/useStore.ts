import { useChartContext } from '../../context/ChartProvider';
import { ChartStore } from '../plugins/utils/ChartStore';
import { UseChartInteractionSignature } from '../plugins/featurePlugins/useChartInteraction';
import { UseChartHighlightSignature } from '../plugins/featurePlugins/useChartHighlight';
import { ChartAnyPluginSignature } from '../plugins/models';

// This hook should be removed because user and us should not interact with the store directly, but with public/private APIs
export function useStore<TSignatures extends ChartAnyPluginSignature[] = []>(): ChartStore<
  [...TSignatures, UseChartInteractionSignature, UseChartHighlightSignature]
> {
  const context = useChartContext();

  if (!context) {
    throw new Error(
      [
        'MUI X: Could not find the charts context.',
        'It looks like you rendered your component outside of a ChartContainer parent component.',
      ].join('\n'),
    );
  }

  return context.store;
}
