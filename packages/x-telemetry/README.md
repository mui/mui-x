# @mui/x-telemetry

Package used by some of MUI X to collects **completely anonymous** temetry data about general usage. Participation in this anonymous program is optional, and you may opt-out if you'd not like to share any information.

## How to opt-in

Currently, **it's disabled by default,** and you could opt-in to it in 3 ways:

1. By using CLI util to enable/disable it for the current machine.

```shell
npx mui-x-telemetry enable
```

2. By setting it directly to package settings on the application start (e.g. in main file).

```js
import { muiXTelemetrySettings } from '@mui/x-telemetry';
// or
import { muiXTelemetrySettings } from '@mui/x-license';

muiXTelemetrySettings.enableTelemetry(); // to enable telemetry collection and sending
// or
muiXTelemetrySettings.disableTelemetry(); // to disable telemetry collection and sending
```

3. By setting the environment variable.

```dotenv
MUI_X_TELEMETRY_ENABLED=true
# or
MUI_X_TELEMETRY_DISABLED=true
```

> ⚠️ Note that some frameworks requires to prefix the variable with `REACT_APP_` or `NEXT_PUBLIC_` or other.
>
> Supported prefixes are:
>
> - REACT*APP*
> - NEXT*PUBLIC*
> - GATSBY\_
> - PUBLIC\_

4. By setting the flag to global object on the application start (e.g. in main file).

```js
import { ponyfillGlobal } from '@mui/utils';

ponyfillGlobal.__MUI_X_TELEMETRY_ENABLED__ = true;
// or
ponyfillGlobal.__MUI_X_TELEMETRY_DISABLED__ = true;
```

OR

```js
if (typeof window !== 'undefined') {
  window.__MUI_X_TELEMETRY_ENABLED__ = true;
}
// or
if (typeof window !== 'undefined') {
  window.__MUI_X_TELEMETRY_DISABLED__ = true;
}
```

## CLI util

The purpose of this utility is to enable/disable telemetry for the current machine.

### Possible commands

```
npx mui-x-telemetry <command>

Commands:
  npx mui-x-telemetry enable   Enable MUI X telemetry
  npx mui-x-telemetry disable  Disable MUI X telemetry
  npx mui-x-telemetry status   Check the status of MUI X telemetry
  npx mui-x-telemetry config   Get path where the global config is stored

Options:
  --help  Show help                                                    [boolean]
```

### How to enable

```shell
$ npx mui-x-telemetry enable
[telemetry] MUI X telemetry enabled
```

### How to disable

```shell
$ npx mui-x-telemetry disable
[telemetry] MUI X telemetry disabled
```

### How to current status

```shell
$ npx mui-x-telemetry status
[telemetry] MUI X telemetry is enabled
```
