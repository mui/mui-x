import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createRenderer, CreateRendererOptions, RenderOptions } from '@mui/internal-test-utils';
import sinon from 'sinon';
import { AdapterClassToUse, AdapterName, adapterToUse, availableAdapters } from './adapters';

interface CreatePickerRendererOptions extends CreateRendererOptions {
  // Set-up locale with date-fns object. Other are deduced from `locale.code`
  locale?: { code: string } | any;
  adapterName?: AdapterName;
  instance?: any;
}

export function createPickerRenderer({
  locale,
  adapterName,
  instance,
  clock: inClock,
  clockConfig,
  ...createRendererOptions
}: CreatePickerRendererOptions = {}) {
  // TODO: Temporary until vitest is enabled
  // If only clockConfig='2020/02/20' is provided, we just fake the Date, not the timers
  // Most of the time we are using the clock we just want to fake the Date
  // If timers are faked it can create inconsistencies with the tests.
  // In some cases it also prevents us from really testing the real behavior of the component.
  if (!inClock && clockConfig) {
    let timer: sinon.SinonFakeTimers | null = null;
    beforeEach(() => {
      timer = sinon.useFakeTimers({ now: clockConfig, toFake: ['Date'] });
    });
    afterEach(() => {
      timer?.restore();
    });
  }

  const { clock, render: clientRender } = createRenderer({
    ...createRendererOptions,
    // TODO: Temporary until vitest is enabled
    ...(inClock ? { clock: inClock, clockConfig } : {}),
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
    clock,
    render(node: React.ReactElement<any>, options?: Omit<RenderOptions, 'wrapper'>) {
      return clientRender(node, { ...options, wrapper: Wrapper });
    },
    adapter,
  };
}
