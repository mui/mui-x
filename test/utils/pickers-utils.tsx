import * as React from 'react';
import { parseISO } from 'date-fns';
import {
  createRenderer,
  screen,
  RenderOptions,
  fireEvent,
  userEvent,
} from '@mui/monorepo/test/utils';
import { CreateRendererOptions } from '@mui/monorepo/test/utils/createRenderer';
import { TransitionProps } from '@mui/material/transitions';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// TODO make possible to pass here any utils using cli
/**
 * Wrapper around `@date-io/date-fns` that resolves https://github.com/dmtrKovalenko/date-io/issues/479.
 * We're not using `adapter.date` in the implementation which means the implementation is safe.
 * But we do use it in tests where usage of ISO dates without timezone is problematic
 */
export class AdapterClassToUse extends AdapterDateFns {
  // Inlined AdapterDateFns#date which is not an instance method but instance property
  // eslint-disable-next-line class-methods-use-this
  date = (value?: any): Date => {
    if (typeof value === 'string') {
      return parseISO(value);
    }
    if (typeof value === 'undefined') {
      return new Date();
    }
    if (value === null) {
      // @ts-expect-error AdapterDateFns#date says it returns NotNullable but that's not true
      return null;
    }
    return new Date(value);
  };
}
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
      <LocalizationProvider locale={locale} dateAdapter={AdapterClassToUse}>
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

export const openMobilePicker = () => userEvent.mousePress(screen.getByRole('textbox'));

export const openDesktopPicker = () => userEvent.mousePress(screen.getByLabelText(/choose date/i));

export const openMobileDateRangePicker = (initialFocus: 'start' | 'end') =>
  userEvent.mousePress(screen.getAllByRole('textbox')[initialFocus === 'start' ? 0 : 1]);

export const openDesktopDateRangePicker = (initialFocus: 'start' | 'end') =>
  fireEvent.focus(screen.getAllByRole('textbox')[initialFocus === 'start' ? 0 : 1]);

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
