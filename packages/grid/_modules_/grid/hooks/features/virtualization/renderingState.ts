import { GridScrollParams } from '../../../models/params/gridScrollParams';
import { GridRenderContextProps } from '../../../models/gridRenderContextProps';

export interface GridRenderingState {
  virtualPage: number;
  virtualRowsCount: number;
  renderContext: Partial<GridRenderContextProps> | null;
  realScroll: GridScrollParams;
  renderingZoneScroll: GridScrollParams;
}
