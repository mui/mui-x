# @mui/x-telemetry

Package used by some of MUI X to collect **anonymous** telemetry data about general usage during development. Telemetry is **enabled by default** in development mode and is completely removed in production builds. Participation in this anonymous program is optional, and you may opt out if you'd not like to share any information.

## How to configure telemetry

Telemetry is **enabled by default** in development mode. You can enable or disable it in any of the following ways:

1. By setting the environment variable.

```dotenv
MUI_X_TELEMETRY_DISABLED=true # Disable telemetry
# or
MUI_X_TELEMETRY_DISABLED=false # Enable telemetry
```

> ⚠️ Note that some frameworks require prefixing the variable with `REACT_APP_`, `NEXT_PUBLIC_`, etc.

2. By using the package settings on application start (for example, in the main file).

```js
import { muiXTelemetrySettings } from '@mui/x-telemetry';
// or
import { muiXTelemetrySettings } from '@mui/x-license';

muiXTelemetrySettings.enableTelemetry(); // to enable telemetry collection and sending
// or
muiXTelemetrySettings.disableTelemetry(); // to disable telemetry collection and sending
```

3. By setting the flag on the global object on application start (for example, in the main file).

```js
globalThis.__MUI_X_TELEMETRY_DISABLED__ = false; // enabled
// or
globalThis.__MUI_X_TELEMETRY_DISABLED__ = true; // disabled
```
