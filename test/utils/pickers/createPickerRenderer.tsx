import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createRenderer, CreateRendererOptions, RenderOptions } from '@mui/internal-test-utils';
import { vi } from 'vitest';
import { AdapterClassToUse, AdapterName, adapterToUse, availableAdapters } from './adapters';

interface CreatePickerRendererOptions
  extends Omit<CreateRendererOptions, 'clock' | 'clockOptions'> {
  // Set-up locale with date-fns object. Other are deduced from `locale.code`
  locale?: { code: string } | any;
  adapterName?: AdapterName;
  instance?: any;
}

export function createPickerRenderer({
  locale,
  adapterName,
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
  const adapter = adapterName
    ? new availableAdapters[adapterName]({ locale: adapterLocale, instance })
    : new AdapterClassToUse({ locale: adapterLocale, instance });

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
    render(node: React.ReactElement<any>, options?: Omit<RenderOptions, 'wrapper'>) {
      return clientRender(node, { ...options, wrapper: Wrapper });
    },
    adapter,
  };
}
