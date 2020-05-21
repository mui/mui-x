import { ElementSize } from './elementSize';

export interface ContainerProps {
  renderingZonePageSize: number;
  viewportPageSize: number;
  totalWidth: number;
  totalHeight: number;
  hasScrollY: boolean;
  hasScrollX: boolean;
  scrollBarSize: number;
  windowSizes: ElementSize;
  renderingZone: ElementSize;
  viewportSize: ElementSize;
  lastPage: number;
}
