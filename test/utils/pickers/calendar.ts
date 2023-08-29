import { fireEvent, createEvent } from '@mui/monorepo/test/utils';

export const rangeCalendarDayTouches = {
  '2018-01-01': {
    clientX: 85,
    clientY: 125,
  },
  '2018-01-02': {
    clientX: 125,
    clientY: 125,
  },
  '2018-01-09': {
    clientX: 125,
    clientY: 165,
  },
  '2018-01-10': {
    clientX: 165,
    clientY: 165,
  },
  '2018-01-11': {
    clientX: 205,
    clientY: 165,
  },
} as const;

export const buildPickerDragInteractions = (getDataTransfer: () => DataTransfer | null) => {
  const createDragEvent = (type: DragEventTypes, target: ChildNode) => {
    const createdEvent = createEvent[type](target);
    Object.defineProperty(createdEvent, 'dataTransfer', {
      value: getDataTransfer(),
    });
    return createdEvent;
  };

  const executeDateDragWithoutDrop = (startDate: ChildNode, ...otherDates: ChildNode[]) => {
    const endDate = otherDates[otherDates.length - 1];
    fireEvent(startDate, createDragEvent('dragStart', startDate));
    fireEvent(startDate, createDragEvent('dragLeave', startDate));
    otherDates.slice(0, otherDates.length - 1).forEach((date) => {
      fireEvent(date, createDragEvent('dragEnter', date));
      fireEvent(date, createDragEvent('dragOver', date));
      fireEvent(date, createDragEvent('dragLeave', date));
    });
    fireEvent(endDate, createDragEvent('dragEnter', endDate));
    fireEvent(endDate, createDragEvent('dragOver', endDate));
  };

  const executeDateDrag = (startDate: ChildNode, ...otherDates: ChildNode[]) => {
    executeDateDragWithoutDrop(startDate, ...otherDates);
    const endDate = otherDates[otherDates.length - 1];
    fireEvent(endDate, createDragEvent('drop', endDate));
    fireEvent(endDate, createDragEvent('dragEnd', endDate));
  };

  return { executeDateDragWithoutDrop, executeDateDrag };
};

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
