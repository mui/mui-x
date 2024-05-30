export type DragEventTypes =
  | 'dragStart'
  | 'dragOver'
  | 'dragEnter'
  | 'dragLeave'
  | 'dragEnd'
  | 'drop';

export class MockedDataTransfer implements DataTransfer {
  data: Record<string, string>;

  dropEffect: 'none' | 'copy' | 'move' | 'link';

  effectAllowed:
    | 'none'
    | 'copy'
    | 'copyLink'
    | 'copyMove'
    | 'link'
    | 'linkMove'
    | 'move'
    | 'all'
    | 'uninitialized';

  files: FileList;

  img?: Element;

  items: DataTransferItemList;

  types: string[];

  xOffset: number;

  yOffset: number;

  constructor() {
    this.data = {};
    this.dropEffect = 'none';
    this.effectAllowed = 'all';
    this.files = [] as unknown as FileList;
    this.items = [] as unknown as DataTransferItemList;
    this.types = [];
    this.xOffset = 0;
    this.yOffset = 0;
  }

  clearData() {
    this.data = {};
  }

  getData(format: string) {
    return this.data[format];
  }

  setData(format: string, data: string) {
    this.data[format] = data;
  }

  setDragImage(img: Element, xOffset: number, yOffset: number) {
    this.img = img;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
  }
}
