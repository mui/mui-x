import { useChartContext } from '../../context/ChartProvider';
import { ChartStore } from '../plugins/utils/ChartStore';
import { UseChartInteractionSignature } from '../plugins/featurePlugins/useChartInteraction/useChartInteraction.types';

// This hook should be removed because user and us should not interact with the store directly, but with public/private APIs
export function useStore(skipError?: boolean): ChartStore<[UseChartInteractionSignature]> {
  const context = useChartContext();

  if (skipError) {
    // TODO: Remove once store is used by all charts.
    // This line is only for `useAxisEvents` which is in the surface of the Gauge.
    // But the Gauge don't have store yet because it does not need the interaction provider.
    // Will be fixed when every thing move to the store since every component will have access to it.
    // @ts-ignore
    return context?.store;
  }
  if (!context) {
    throw new Error(
      [
        'MUI X: Could not find the charts context.',
        'It looks like you rendered your component outside of a ChartsContainer parent component.',
      ].join('\n'),
    );
  }

  return context.store;
}
