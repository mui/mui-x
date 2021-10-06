import { GridScrollParams } from '../../../models/params/gridScrollParams';
import { GridRenderContextProps } from '../../../models/gridRenderContextProps';

export interface GridRenderingState {
  virtualPage: number;
  virtualRowsCount: number;
  renderContext: Partial<GridRenderContextProps> | null;
  realScroll: GridScrollParams;
  renderingZoneScroll: GridScrollParams;
}

export const getInitialGridRenderingState = (): GridRenderingState => {
  return {
    realScroll: { left: 0, top: 0 },
    renderContext: null,
    renderingZoneScroll: { left: 0, top: 0 },
    virtualPage: 0,
    virtualRowsCount: 0,
  };
};
