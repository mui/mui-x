import { GridScrollParams } from '../../../models/params/gridScrollParams';
import { GridRenderContextProps } from '../../../models/gridRenderContextProps';

export interface InternalRenderingState {
  virtualPage: number;
  virtualRowsCount: number;
  renderContext: Partial<GridRenderContextProps> | null;
  realScroll: GridScrollParams;
  renderingZoneScroll: GridScrollParams;
}

export const getInitialGridRenderingState = (): InternalRenderingState => {
  return {
    realScroll: { left: 0, top: 0 },
    renderContext: null,
    renderingZoneScroll: { left: 0, top: 0 },
    virtualPage: 0,
    virtualRowsCount: 0,
  };
};
