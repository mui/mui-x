import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MuiPickersAdapter } from '@mui/x-date-pickers/models';
import { createRenderer, CreateRendererOptions, RenderOptions } from '@mui/internal-test-utils';
import { vi } from 'vitest';
import { AdapterClassToUse, AdapterName, adapterToUse, availableAdapters } from './adapters';

type AdapterConstructor = new (...args: any) => MuiPickersAdapter;

interface CreatePickerRendererOptions extends Omit<
  CreateRendererOptions,
  'clock' | 'clockOptions'
> {
  // Set-up locale with date-fns object. Other are deduced from `locale.code`
  locale?: { code: string } | any;
  adapterName?: AdapterName;
  /**
   * Direct adapter class. Pass this for adapters not registered in
   * `availableAdapters` (e.g. regional adapters like `AdapterMomentJalaali`)
   * to avoid loading their date libraries by default.
   */
  Adapter?: AdapterConstructor;
  instance?: any;
}

export function createPickerRenderer({
  locale,
  adapterName,
  Adapter,
  instance,
  clockConfig,
  ...createRendererOptions
}: CreatePickerRendererOptions = {}) {
  const { render: clientRender } = createRenderer({
    ...createRendererOptions,
  });

  beforeEach(() => {
    if (clockConfig) {
      vi.setSystemTime(clockConfig);
    }
  });
  afterEach(() => {
    if (clockConfig) {
      vi.useRealTimers();
    }
  });

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

  let AdapterClass: AdapterConstructor;
  if (Adapter) {
    AdapterClass = Adapter;
  } else if (adapterName) {
    const constructor = availableAdapters[adapterName];
    if (!constructor) {
      throw new Error(
        `MUI X: Adapter "${adapterName}" is not registered in availableAdapters. ` +
          `Import the Adapter class directly and pass it via the \`Adapter\` option.`,
      );
    }
    AdapterClass = constructor;
  } else {
    AdapterClass = AdapterClassToUse;
  }

  const adapter = new AdapterClass({ locale: adapterLocale, instance });

  function Wrapper({ children }: { children?: React.ReactNode }) {
    return (
      <LocalizationProvider adapterLocale={adapterLocale} dateAdapter={AdapterClass}>
        {children}
      </LocalizationProvider>
    );
  }

  return {
    render(node: React.ReactElement<any>, options?: Omit<RenderOptions, 'wrapper'>) {
      return clientRender(node, { ...options, wrapper: Wrapper });
    },
    adapter,
  };
}
