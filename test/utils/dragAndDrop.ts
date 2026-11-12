export type DragEventTypes =
  'dragStart' | 'dragOver' | 'dragEnter' | 'dragLeave' | 'dragEnd' | 'drop';

export class MockedDataTransfer implements DataTransfer {
  declare data: Record<string, string>;

  declare dropEffect: 'none' | 'copy' | 'move' | 'link';

  declare effectAllowed:
    | 'none'
    | 'copy'
    | 'copyLink'
    | 'copyMove'
    | 'link'
    | 'linkMove'
    | 'move'
    | 'all'
    | 'uninitialized';

  declare files: FileList;

  img?: Element;

  declare items: DataTransferItemList;

  declare types: string[];

  declare xOffset: number;

  declare yOffset: number;

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
