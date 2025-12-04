import { type Store } from '@mui/x-internals/store';
import { useChartContext } from '../../context/ChartProvider';
import { type ChartAnyPluginSignature, type ChartState } from '../plugins/models';

// This hook should be removed because user and us should not interact with the store directly, but with public/private APIs
export function useStore<TSignatures extends ChartAnyPluginSignature[] = []>(): Store<
  ChartState<TSignatures>
> {
  const context = useChartContext<TSignatures>();

  if (!context) {
    throw new Error(
      [
        'MUI X Charts: Could not find the charts context.',
        'It looks like you rendered your component outside of a ChartContainer parent component.',
      ].join('\n'),
    );
  }

  return context.store;
}
