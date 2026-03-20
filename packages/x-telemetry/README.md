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

### How to test

#### Postinstall output

The postinstall script writes to two places:

1. **`<pkg-root>/context.js` + `<pkg-root>/context.mjs`** — all traits (`machineId`, `projectId`, `anonymousId`, `sessionId`, `isDocker`, `isCI`). Lives inside `node_modules` and gets regenerated on each install.
2. **Platform-specific config directory** — persists `anonymousId` and `notifiedAt` across reinstalls, so the `anonymousId` stays stable even if `node_modules` is wiped.
   - **macOS:** `~/Library/Preferences/mui-x/config.json`
   - **Windows:** `%APPDATA%\mui-x\Config\config.json`
   - **Linux:** `$XDG_CONFIG_HOME/mui-x/config.json` (defaults to `~/.config/mui-x/config.json`)
   - **CI/Docker:** `<cwd>/cache/mui-x/config.json` (ephemeral, inside the project)

#### Postinstall (builds context.js with machineId, projectId, etc.)

```bash
# 1. Build the package
pnpm --filter @mui/x-telemetry run build

# 2. Run the postinstall script
node packages/x-telemetry/build/postinstall/index.js

# 3. Check the generated context
cat packages/x-telemetry/build/context.js
cat packages/x-telemetry/build/context.mjs

# 4. Check the persistent config (macOS)
cat ~/Library/Preferences/mui-x/config.json
```

#### Unit tests

```bash
# Run all x-telemetry unit tests (jsdom)
pnpm test:unit --project "x-telemetry" --run
```
