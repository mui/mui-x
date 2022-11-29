import * as React from 'react';
import {
  createRenderer,
  screen,
  RenderOptions,
  userEvent,
  getByRole,
} from '@mui/monorepo/test/utils';
import { CreateRendererOptions } from '@mui/monorepo/test/utils/createRenderer';
import { TransitionProps } from '@mui/material/transitions';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
// import { AdapterJsJoda } from '@mui/x-date-pickers/AdapterJsJoda';
import { AdapterMomentHijri } from '@mui/x-date-pickers/AdapterMomentHijri';
import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import { MuiPickerFieldAdapter } from '@mui/x-date-pickers/internals/models';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import sinon from 'sinon';
import { expect } from 'chai';
import { unstable_useControlled as useControlled } from '@mui/utils';

export type AdapterName =
  | 'date-fns'
  | 'dayjs'
  | 'luxon'
  | 'moment'
  | 'moment-hijri'
  | 'moment-jalaali'
  // | 'js-joda'
  | 'date-fns-jalali';

const availableAdapters: { [key: string]: new (...args: any) => MuiPickerFieldAdapter<any> } = {
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

export function wrapPickerMount(mount: (node: React.ReactNode) => import('enzyme').ReactWrapper) {
  return (node: React.ReactNode) =>
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

type OpenPickerParams =
  | {
      type: 'date' | 'date-time' | 'time';
      variant: 'mobile' | 'desktop';
    }
  | {
      type: 'date-range';
      variant: 'mobile' | 'desktop';
      initialFocus: 'start' | 'end';
    };

export const openPicker = (params: OpenPickerParams) => {
  if (params.type === 'date-range') {
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

// TODO: Handle dynamic values
export const getClockTouchEvent = () => {
  return {
    changedTouches: [
      {
        clientX: 20,
        clientY: 15,
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

export const expectInputValue = (input: HTMLInputElement, expectedValue: string) =>
  expect(input.value.replace(/\u200e|\u2068|\u2069/g, '')).to.equal(expectedValue);

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

export const getPickerDay = (name: string, picker = 'January 2018') =>
  getByRole(screen.getByText(picker)?.parentElement?.parentElement, 'gridcell', { name });
