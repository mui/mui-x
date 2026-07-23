import type { BarItemIdentifier, ChartsClickEvent, ChartsReactClickEvent } from '../models';

declare module '@mui/x-charts/BarChart' {
  export interface BarPlotProps {
    /**
     * Callback fired when a bar item is clicked.
     * @param {ChartsClickEvent | ChartsReactClickEvent<SVGElement>} event The event source of the callback.
     *        It is a native MouseEvent for `svg-batch` renderer and a React MouseEvent for `svg-single` renderer.
     * @param {BarItemIdentifier} barItemIdentifier The bar item identifier.
     */
    onItemClick?(
      event: ChartsClickEvent | ChartsReactClickEvent<SVGElement>,
      barItemIdentifier: BarItemIdentifier,
    ): void;
  }
}
