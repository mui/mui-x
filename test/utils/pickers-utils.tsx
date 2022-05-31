import * as React from 'react';
import { createRenderer, screen, RenderOptions, userEvent } from '@mui/monorepo/test/utils';
import { CreateRendererOptions } from '@mui/monorepo/test/utils/createRenderer';
import { TransitionProps } from '@mui/material/transitions';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// TODO make possible to pass here any utils using cli
export class AdapterClassToUse extends AdapterDateFns { }

export const adapterToUse = new AdapterDateFns();

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
  // object for date-fns, string for other adapters
  locale?: string | object;
}

export function wrapPickerMount(mount: (node: React.ReactNode) => import('enzyme').ReactWrapper) {
  return (node: React.ReactNode) =>
    mount(<LocalizationProvider dateAdapter={AdapterClassToUse}>{node}</LocalizationProvider>);
}

export function createPickerRenderer({
  locale,
  ...createRendererOptions
}: CreatePickerRendererOptions = {}) {
  const { clock, render: clientRender } = createRenderer(createRendererOptions);

  function Wrapper({ children }: { children?: React.ReactNode }) {
    return (
      <LocalizationProvider adapterLocale={locale} dateAdapter={AdapterClassToUse}>
        {children}
      </LocalizationProvider>
    );
  }

  return {
    clock,
    render(node: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
      return clientRender(node, { ...options, wrapper: Wrapper });
    },
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
export const getClockMouseEvent = (type: 'mousedown' | 'mousemove' | 'mouseup') => {
  const offsetX = 20;
  const offsetY = 15;

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

export const withPickerControls =
  <TValue, Props extends { value: TValue; onChange: Function }>(
    Component: React.ComponentType<Props>,
  ) =>
    <DefaultProps extends Partial<Props>>(defaultProps: DefaultProps) => {
      return (
        props: Omit<Props, 'value' | 'onChange' | keyof DefaultProps> &
          Partial<DefaultProps> & {
            initialValue: TValue;
            onChange?: any;
          },
      ) => {
        const { initialValue, onChange, ...other } = props;

        const [value, setValue] = React.useState<TValue>(initialValue);

        const handleChange = React.useCallback(
          (newValue: TValue, keyboardInputValue?: string) => {
            setValue(newValue);
            onChange?.(newValue, keyboardInputValue);
          },
          [onChange],
        );

        return (
          <Component {...defaultProps} {...(other as any)} value={value} onChange={handleChange} />
        );
      };
    };
