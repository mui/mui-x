# @mui/x-telemetry

Package used by some of MUI X to collects **completely anonymous** temetry data about general usage. Participation in this anonymous program is optional, and you may opt-out if you'd not like to share any information.

## How to opt-in

Currently, **it's disabled by default,** and you could opt-in to it in 3 ways:
1. By using CLI util to enable/disable it for the current machine.
```shell
npx mui-x-telemetry enable
```

2. By setting the flag to global object on the application start (e.g. in main file).
```js
import { ponyfillGlobal } from "@mui/utils";

ponyfillGlobal.__MUI_X_TELEMETRY_ENABLED__ = true;
// or
ponyfillGlobal.__MUI_X_TELEMETRY_DISABLED__ = true;
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
> - REACT_APP_
> - NEXT_PUBLIC_
> - GATSBY_
> - PUBLIC_

## CLI util

This util is purpose to give ability to enable / disable telemetry for the current machine.

### Possible commands

```
mui-x-telemetry <command>

Commands:
  mui-x-telemetry enable   Enable MUI X telemetry
  mui-x-telemetry disable  Disable MUI X telemetry
  mui-x-telemetry status   Check the status of MUI X telemetry

Options:
  --help  Show help                                                    [boolean]
```

### How to enable
```shell
$ mui-x-telemetry enable
[telemetry] MUI X telemetry enabled
```

### How to disable
```shell
$ mui-x-telemetry disable
[telemetry] MUI X telemetry disabled
```

### How to current status 
```shell
$ mui-x-telemetry status
[telemetry] MUI X telemetry is enabled
```
