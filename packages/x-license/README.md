# @mui/x-license

Package used by all MUI X to validate license and collect **anonymous** telemetry data about general usage during development. Telemetry is **enabled by default** in development mode and is completely removed in production builds. Participation in this anonymous program is optional, and you may opt out if you'd not like to share any information.

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

## Development

### Building

```bash
pnpm --filter "@mui/x-license" run build
```

This produces both CJS and ESM output under `build/`:

```text
build/
├── index.js              # CJS entry point
├── telemetry/
│   ├── context.js        # CJS telemetry context (written by postinstall)
│   ├── postinstall/
│   └── runtime/
├── esm/
│   ├── index.js          # ESM entry point
│   ├── telemetry/
│   │   ├── context.js    # ESM telemetry context (written by postinstall)
│   │   ├── postinstall/
│   │   └── runtime/
└── package.json
```

### Postinstall

The postinstall script runs automatically when the package is installed by consumers. It collects anonymous environment information and writes it to the `context.js` files.

To run it manually after a build:

```bash
node packages/x-license/build/esm/telemetry/postinstall/index.js
```

This writes telemetry context to both:

- `build/telemetry/context.js` (CJS)
- `build/esm/telemetry/context.js` (ESM)

### Verifying stored data

The postinstall script writes persistent configuration (anonymousId, notification status) to a platform-specific directory:

- **macOS**: `~/Library/Preferences/mui-x/config.json`
- **Windows**: `%APPDATA%\mui-x\Config\config.json`
- **Linux**: `$XDG_CONFIG_HOME/mui-x/config.json` (defaults to `~/.config/mui-x/config.json`)
- **CI/Docker**: `<cwd>/cache/mui-x/config.json`

To inspect:

```bash
# macOS
cat ~/Library/Preferences/mui-x/config.json

# Linux
cat ~/.config/mui-x/config.json

# Context files (after build + postinstall)
cat packages/x-license/build/esm/telemetry/context.js
cat packages/x-license/build/telemetry/context.js
```
