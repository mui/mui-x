# @mui/x-telemetry

Package used by some of MUI X to collects **anonymous** telemetry data about general usage. Participation in this anonymous program is optional, and you may opt-out if you'd not like to share any information.

## How to opt-in

Currently, **it's disabled by default,** and you could opt-in to it in 3 ways:

1. By setting it directly to package settings on the application start (for example, in the main file).

```js
import { muiXTelemetrySettings } from '@mui/x-telemetry';
// or
import { muiXTelemetrySettings } from '@mui/x-license';

muiXTelemetrySettings.enableTelemetry(); // to enable telemetry collection and sending
// or
muiXTelemetrySettings.disableTelemetry(); // to disable telemetry collection and sending
```

2. By setting the environment variable.

```dotenv
MUI_X_TELEMETRY_DISABLED=false # Enable telemetry
# or
MUI_X_TELEMETRY_DISABLED=true # Enable telemetry
```

> ⚠️ Note that some frameworks requires to prefix the variable with `REACT_APP_`, `NEXT_PUBLIC_`, etc.

3. By setting the flag to global object on the application start (for example, in the main file).

```js
globalThis.__MUI_X_TELEMETRY_DISABLED__ = false; // enabled
// or
globalThis.__MUI_X_TELEMETRY_DISABLED__ = true; // disabled
```

OR

```js
if (typeof window !== 'undefined') {
  window.__MUI_X_TELEMETRY_DISABLED__ = false; // enabled
}
// or
if (typeof window !== 'undefined') {
  window.__MUI_X_TELEMETRY_DISABLED__ = true; // disabled
}
```
