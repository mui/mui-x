import * as React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  createRenderer,
  screen,
  RenderOptions,
  userEvent,
  getByRole,
  act,
  fireEvent,
  createEvent,
} from '@mui/monorepo/test/utils';
import { CreateRendererOptions } from '@mui/monorepo/test/utils/createRenderer';
import { unstable_useControlled as useControlled } from '@mui/utils';
import { TransitionProps } from '@mui/material/transitions';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
// import { AdapterJsJoda } from '@mui/x-date-pickers/AdapterJsJoda';
import { AdapterMomentHijri } from '@mui/x-date-pickers/AdapterMomentHijri';
import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import { MuiPickersAdapter } from '@mui/x-date-pickers/models';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CLOCK_WIDTH } from '@mui/x-date-pickers/TimeClock/shared';

export type AdapterName =
  | 'date-fns'
  | 'dayjs'
  | 'luxon'
  | 'moment'
  | 'moment-hijri'
  | 'moment-jalaali'
  // | 'js-joda'
  | 'date-fns-jalali';

const availableAdapters: { [key in AdapterName]: new (...args: any) => MuiPickersAdapter<any> } = {
  'date-fns': AdapterDateFns,
  dayjs: AdapterDayjs,
  luxon: AdapterLuxon,
  moment: AdapterMoment,
  'moment-hijri': AdapterMomentHijri,
  'moment-jalaali': AdapterMomentJalaali,
  'date-fns-jalali': AdapterDateFnsJalali,
  // 'js-joda': AdapterJsJoda,
};

let AdapterClassToExtend = availableAdapters['date-fns'];

// Check if we are in unit tests
if (/jsdom/.test(window.navigator.userAgent)) {
  // Add parameter `--date-adapter luxon` to use AdapterLuxon for running tests
  // adapter available : date-fns (default one), dayjs, luxon, moment
  const args = process.argv.slice(2);
  const flagIndex = args.findIndex((element) => element === '--date-adapter');
  if (flagIndex !== -1 && flagIndex + 1 < args.length) {
    const potentialAdapter = args[flagIndex + 1];
    if (potentialAdapter) {
      if (availableAdapters[potentialAdapter]) {
        AdapterClassToExtend = availableAdapters[potentialAdapter];
      } else {
        const supportedAdapters = Object.keys(availableAdapters);
        const message = `Error: Invalid --date-adapter value "${potentialAdapter}". Supported date adapters: ${supportedAdapters
          .map((key) => `"${key}"`)
          .join(', ')}`;
        // eslint-disable-next-line no-console
        console.log(message); // log message explicitly, because error message gets swallowed by mocha
        throw new Error(message);
      }
    }
  }
}

export class AdapterClassToUse extends AdapterClassToExtend {}

export const adapterToUse = new AdapterClassToUse();

export const FakeTransitionComponent = React.forwardRef<HTMLDivElement, TransitionProps>(
  function FakeTransitionComponent({ children }, ref) {
    // set tabIndex in case it is used as a child of <TrapFocus />
    return (
      <div ref={ref} tabIndex={-1}>
        {children}
      </div>
    );
  },
);

interface CreatePickerRendererOptions extends CreateRendererOptions {
  // Set-up locale with date-fns object. Other are deduced from `locale.code`
  locale?: Locale;
  adapterName?: AdapterName;
}

export function wrapPickerMount(
  mount: (node: React.ReactElement) => import('enzyme').ReactWrapper,
) {
  return (node: React.ReactElement) =>
    mount(<LocalizationProvider dateAdapter={AdapterClassToUse}>{node}</LocalizationProvider>);
}

export function createPickerRenderer({
  locale,
  adapterName,
  ...createRendererOptions
}: CreatePickerRendererOptions = {}) {
  const { clock, render: clientRender } = createRenderer(createRendererOptions);

  let adapterLocale = [
    'date-fns',
    'date-fns-jalali',
    // 'js-joda'
  ].includes(adapterName ?? adapterToUse.lib)
    ? locale
    : locale?.code;

  if (typeof adapterLocale === 'string' && adapterLocale.length > 2) {
    adapterLocale = adapterLocale.slice(0, 2);
  }
  const adapter = adapterName
    ? new availableAdapters[adapterName]({ locale: adapterLocale })
    : new AdapterClassToUse({ locale: adapterLocale });

  function Wrapper({ children }: { children?: React.ReactNode }) {
    return (
      <LocalizationProvider
        adapterLocale={adapterLocale}
        dateAdapter={adapterName ? availableAdapters[adapterName] : AdapterClassToUse}
      >
        {children}
      </LocalizationProvider>
    );
  }

  return {
    clock,
    render(node: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
      return clientRender(node, { ...options, wrapper: Wrapper });
    },
    adapter,
  };
}

export type OpenPickerParams =
  | {
      type: 'date' | 'date-time' | 'time';
      variant: 'mobile' | 'desktop';
    }
  | {
      type: 'date-range';
      variant: 'mobile' | 'desktop';
      initialFocus: 'start' | 'end';
      /**
       * @default false
       */
      isSingleInput?: boolean;
    };

export const openPicker = (params: OpenPickerParams) => {
  if (params.type === 'date-range') {
    if (params.isSingleInput) {
      const target = screen.getByRole<HTMLInputElement>('textbox');
      userEvent.mousePress(target);
      const cursorPosition = params.initialFocus === 'start' ? 0 : target.value.length - 1;

      return target.setSelectionRange(cursorPosition, cursorPosition);
    }

    const target = screen.getAllByRole('textbox')[params.initialFocus === 'start' ? 0 : 1];

    return userEvent.mousePress(target);
  }

  if (params.variant === 'mobile') {
    return userEvent.mousePress(screen.getByRole('textbox'));
  }

  const target =
    params.type === 'time'
      ? screen.getByLabelText(/choose time/i)
      : screen.getByLabelText(/choose date/i);
  return userEvent.mousePress(target);
};

// TODO: Handle dynamic values
export const getClockMouseEvent = (
  type: 'mousedown' | 'mousemove' | 'mouseup',
  offsetX = 20,
  offsetY = 15,
) => {
  const event = new window.MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    buttons: 1,
  });

  Object.defineProperty(event, 'offsetX', { get: () => offsetX });
  Object.defineProperty(event, 'offsetY', { get: () => offsetY });

  return event;
};

export const getClockTouchEvent = (value: number, view: 'minutes' | '12hours' | '24hours') => {
  // TODO: Handle 24 hours clock
  if (view === '24hours') {
    throw new Error('Do not support 24 hours clock yet');
  }

  let itemCount: number;
  if (view === 'minutes') {
    itemCount = 60;
  } else {
    itemCount = 12;
  }

  const angle = Math.PI / 2 - (Math.PI * 2 * value) / itemCount;
  const clientX = Math.round(((1 + Math.cos(angle)) * CLOCK_WIDTH) / 2);
  const clientY = Math.round(((1 - Math.sin(angle)) * CLOCK_WIDTH) / 2);

  return {
    changedTouches: [
      {
        clientX,
        clientY,
      },
    ],
  };
};

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

export const withPickerControls =
  <
    TValue,
    Props extends { value: TValue; onChange: Function; components?: {}; componentsProps?: {} },
  >(
    Component: React.ComponentType<Props>,
  ) =>
  <DefaultProps extends Partial<Props>>(defaultProps: DefaultProps) => {
    return function WithPickerControls(
      props: Omit<
        Props,
        'value' | 'onChange' | Exclude<keyof DefaultProps, 'components' | 'componentsProps'>
      > &
        Partial<Omit<DefaultProps, 'components' | 'componentsProps'>> & {
          initialValue?: TValue;
          value?: TValue;
          onChange?: any;
        },
    ) {
      const { initialValue, value: inValue, onChange, ...other } = props;

      const [value, setValue] = useControlled({
        controlled: inValue,
        default: initialValue,
        name: 'withPickerControls',
        state: 'value,',
      });

      const handleChange = React.useCallback(
        (newValue: TValue, keyboardInputValue?: string) => {
          setValue(newValue);
          onChange?.(newValue, keyboardInputValue);
        },
        [onChange, setValue],
      );

      return (
        <Component
          {...defaultProps}
          {...(other as any)}
          components={{ ...defaultProps.components, ...(other as any).components }}
          componentsProps={{ ...defaultProps.componentsProps, ...(other as any).componentsProps }}
          value={value}
          onChange={handleChange}
        />
      );
    };
  };

export const stubMatchMedia = (matches = true) =>
  sinon.stub().returns({
    matches,
    addListener: () => {},
    removeListener: () => {},
  });
export const getPickerDay = (name: string, picker = 'January 2018') =>
  getByRole(screen.getByText(picker)?.parentElement?.parentElement!, 'gridcell', { name });

export const cleanText = (text) => text.replace(/\u200e|\u2066|\u2067|\u2068|\u2069/g, '');

export const getCleanedSelectedContent = (input: HTMLInputElement) =>
  cleanText(input.value.slice(input.selectionStart ?? 0, input.selectionEnd ?? 0));

export const expectInputValue = (input: HTMLInputElement, expectedValue: string) => {
  const value = cleanText(input.value);
  return expect(value).to.equal(expectedValue);
};

export const expectInputPlaceholder = (input: HTMLInputElement, placeholder: string) => {
  const cleanPlaceholder = cleanText(input.placeholder);
  return expect(cleanPlaceholder).to.equal(placeholder);
};

interface BuildFieldInteractionsParams<P extends {}> {
  // TODO: Export `Clock` from monorepo
  clock: ReturnType<typeof createRenderer>['clock'];
  render: ReturnType<typeof createRenderer>['render'];
  Component: React.FunctionComponent<P>;
}

export interface BuildFieldInteractionsResponse<P extends {}> {
  clickOnInput: (
    input: HTMLInputElement,
    cursorStartPosition: number,
    cursorEndPosition?: number,
  ) => void;
  selectSection: (input: HTMLInputElement, activeSectionIndex: number) => void;
  testFieldKeyPress: (
    params: P & {
      key: string;
      expectedValue: string;
      cursorPosition?: number;
      valueToSelect?: string;
    },
  ) => void;
  testFieldChange: (
    params: P & {
      keyStrokes: { value: string; expected: string }[];
      cursorPosition?: number;
    },
  ) => void;
}

export const getTextbox = (): HTMLInputElement => screen.getByRole('textbox');

export const buildFieldInteractions = <P extends {}>({
  clock,
  render,
  Component,
}: BuildFieldInteractionsParams<P>): BuildFieldInteractionsResponse<P> => {
  const clickOnInput: BuildFieldInteractionsResponse<P>['clickOnInput'] = (
    input,
    cursorStartPosition,
    cursorEndPosition = cursorStartPosition,
  ) => {
    if (document.activeElement !== input) {
      act(() => {
        input.focus();
      });
      clock.runToLast();
    }
    act(() => {
      fireEvent.mouseDown(input);
      fireEvent.mouseUp(input);
      input.setSelectionRange(cursorStartPosition, cursorEndPosition);
      fireEvent.click(input);

      clock.runToLast();
    });
  };

  const selectSection: BuildFieldInteractionsResponse<P>['selectSection'] = (
    input,
    activeSectionIndex,
  ) => {
    const value = input.value.replace(':', '/');

    // TODO: Improve this logic when we will be able to access state.sections from the outside
    let clickPosition: number;
    if (activeSectionIndex === 0) {
      clickPosition = 0;
    } else {
      clickPosition =
        (value.split('/', activeSectionIndex - 1).join('/').length +
          value.split('/', activeSectionIndex).join('/').length) /
        2;
    }

    clickOnInput(input, clickPosition);
  };

  const testFieldKeyPress: BuildFieldInteractionsResponse<P>['testFieldKeyPress'] = ({
    key,
    expectedValue,
    cursorPosition = 1,
    valueToSelect,
    ...props
  }) => {
    render(<Component {...(props as any as P)} />);
    const input = getTextbox();

    // focus input to trigger setting placeholder as value if no value is present
    act(() => {
      input.focus();
    });
    // make sure the value of the input is rendered before proceeding
    clock.runToLast();

    const clickPosition = valueToSelect ? input.value.indexOf(valueToSelect) : cursorPosition;
    if (clickPosition === -1) {
      throw new Error(
        `Failed to find value to select "${valueToSelect}" in input value: ${input.value}`,
      );
    }
    clickOnInput(input, clickPosition);
    userEvent.keyPress(input, { key });
    expectInputValue(input, expectedValue);
  };

  const testFieldChange: BuildFieldInteractionsResponse<P>['testFieldChange'] = ({
    keyStrokes,
    cursorPosition = 1,
    ...props
  }) => {
    render(<Component {...(props as any as P)} />);
    const input = getTextbox();
    clickOnInput(input, cursorPosition);

    keyStrokes.forEach((keyStroke) => {
      fireEvent.change(input, { target: { value: keyStroke.value } });
      expectInputValue(input, keyStroke.expected);
    });
  };

  return { clickOnInput, selectSection, testFieldKeyPress, testFieldChange };
};

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
