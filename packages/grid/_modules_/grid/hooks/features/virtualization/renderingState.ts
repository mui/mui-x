import { ContainerProps } from '../../../models/containerProps';
import { RenderContextProps } from '../../../models/renderContextProps';
import { ScrollParams } from '../../utils/useScrollFn';

export interface InternalRenderingState {
  virtualPage: number;
  virtualRowsCount: number;
  renderContext: Partial<RenderContextProps> | null;
  realScroll: ScrollParams;
  renderingZoneScroll: ScrollParams;
  renderedSizes: ContainerProps | null;
}

export const getInitialRenderingState = (): InternalRenderingState => {
  return {
    realScroll: { left: 0, top: 0 },
    renderContext: null,
    renderingZoneScroll: { left: 0, top: 0 },
    virtualPage: 0,
    virtualRowsCount: 0,
    renderedSizes: null,
  };
};
