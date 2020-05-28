import { ElementSize } from './elementSize';

export interface ContainerProps {
  renderingZonePageSize: number;
  viewportPageSize: number;
  viewportAutoPageSize: number;
  lastPage: number;

  hasScrollY: boolean;
  hasScrollX: boolean;
  scrollBarSize: number;

  totalSizes: ElementSize;
  windowSizes: ElementSize;
  renderingZone: ElementSize;
  viewportSize: ElementSize;
  dataContainerSizes: ElementSize;
}
