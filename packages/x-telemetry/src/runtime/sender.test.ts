import { vi } from 'vitest';
import { muiXTelemetrySettings } from '@mui/x-telemetry';
import { isJSDOM } from '@mui/x-internals/platform';
import telemetryContext from '../context';
import { getTelemetryEnvConfig } from './config';

vi.mock('../context', () => ({
  default: {
    config: { isInitialized: true, runtimePackageNameHashResolved: true },
    traits: {
      machineId: 'test-machine-id',
      projectId: 'test-project-id',
      runtimePackageNameHash: 'test-runtime-hash',
      sessionId: 'test-session-id',
      anonymousId: 'test-anonymous-id',
      isCI: false,
      isDocker: false,
    },
  },
}));

const testEvent = {
  eventName: 'test.event',
  payload: { foo: 'bar' },
  context: {},
};

describe.runIf(isJSDOM)('Telemetry: sendMuiXTelemetryEvent', () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'development');
    fetchSpy = vi.fn().mockResolvedValue(new Response('ok', { status: 200 }));
    vi.stubGlobal('fetch', fetchSpy);
    telemetryContext.traits.isCI = false;
    // Reset env config cache
    getTelemetryEnvConfig(true);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    getTelemetryEnvConfig(true);
  });

  it('should send telemetry by default', async () => {
    const { default: sendMuiXTelemetryEvent } = await import('./sender');
    await sendMuiXTelemetryEvent(testEvent);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('should not send telemetry in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const { default: sendMuiXTelemetryEvent } = await import('./sender');
    await sendMuiXTelemetryEvent(testEvent);

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('should not send telemetry when event is null', async () => {
    const { default: sendMuiXTelemetryEvent } = await import('./sender');
    await sendMuiXTelemetryEvent(null);

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('should not send telemetry in CI environments', async () => {
    telemetryContext.traits.isCI = true;

    const { default: sendMuiXTelemetryEvent } = await import('./sender');
    await sendMuiXTelemetryEvent(testEvent);

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('should not send telemetry when opted out via env var', async () => {
    vi.stubEnv('MUI_X_TELEMETRY_DISABLED', '1');
    getTelemetryEnvConfig(true);

    const { default: sendMuiXTelemetryEvent } = await import('./sender');
    await sendMuiXTelemetryEvent(testEvent);

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('should not send telemetry when opted out via settings', async () => {
    muiXTelemetrySettings.disableTelemetry();

    const { default: sendMuiXTelemetryEvent } = await import('./sender');
    await sendMuiXTelemetryEvent(testEvent);

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('should send telemetry when explicitly enabled via settings', async () => {
    muiXTelemetrySettings.enableTelemetry();

    const { default: sendMuiXTelemetryEvent } = await import('./sender');
    await sendMuiXTelemetryEvent(testEvent);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('should send correct payload to the telemetry endpoint', async () => {
    const { default: sendMuiXTelemetryEvent } = await import('./sender');
    await sendMuiXTelemetryEvent(testEvent);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, options] = fetchSpy.mock.calls[0];
    expect(url).toBe('https://x-telemetry.mui.com/v2/telemetry/record');
    expect(options.method).toBe('POST');

    const body = JSON.parse(options.body);
    expect(body[0].eventName).toBe('test.event');
    expect(body[0].payload).toEqual({ foo: 'bar' });
  });
});
