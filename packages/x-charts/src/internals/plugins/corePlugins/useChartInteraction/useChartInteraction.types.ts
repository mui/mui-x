import { ChartPluginSignature } from '../../models';

export type ChartInteraction =
  | 'pan'
  | 'panStart'
  | 'panEnd'
  | 'pinch'
  | 'pinchStart'
  | 'pinchEnd'
  | 'scroll'
  | 'scrollStart'
  | 'scrollEnd'
  | 'move'
  | 'moveStart'
  | 'moveEnd';

export type ChartInteractionOptions = {
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
  signal: AbortSignal;
};

export type AddInteractionListener = (
  interaction: ChartInteraction,
  // TODO: Custom Event type/data
  callback: () => void,
  options: ChartInteractionOptions,
) => void;

export interface UseChartInteractionParameters {}

export type UseChartInteractionDefaultizedParameters = UseChartInteractionParameters & {};

export interface UseChartInteractionState {}

export interface UseChartInteractionInstance {
  /**
   * Adds an interaction listener to the SVG element.
   *
   * An interrupt signal is required to stop the interaction listener.
   * We don't provide a way to remove the listener.
   *
   * @example
   * ```tsx
   * const { instance } = useChartInteraction();
   *
   * useEffect(() => {
   *   const abortController = new AbortController();
   *
   *   instance.addInteractionListener(
   *     'move',
   *     () => console.log('Move'),
   *     { signal: abortController.signal }
   *   );
   *
   *   return () => {
   *     abortController.abort();
   *   };
   * }, []);
   * ```
   *
   * @param interaction The interaction to listen to.
   * @param callback The callback to call when the interaction occurs.
   * @param options The options to use when adding the event listener.
   */
  addInteractionListener: AddInteractionListener;
}

export type UseChartInteractionSignature = ChartPluginSignature<{
  params: UseChartInteractionParameters;
  defaultizedParams: UseChartInteractionDefaultizedParameters;
  state: UseChartInteractionState;
  instance: UseChartInteractionInstance;
}>;
