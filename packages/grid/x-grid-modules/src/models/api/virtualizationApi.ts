import { ScrollParams } from '../../hooks/utils';
import { CellIndexCoordinates } from '../rows';
import { ContainerProps } from '../containerProps';
import { RenderContextProps } from '../renderContextProps';

export interface VirtualizationApi {
  scroll: (params: Partial<ScrollParams>) => void;
  scrollToIndexes: (params: CellIndexCoordinates) => void;
  isColumnVisibleInWindow: (colIndex: number) => boolean;
  getContainerPropsState: () => ContainerProps | null;
  getRenderContextState: () => Partial<RenderContextProps> | undefined;
  renderPage: (page: number) => void;
}
