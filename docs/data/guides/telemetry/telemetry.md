---
packageName: '@mui/x-telemetry'
---

# MUI X Telemetry guide

<p class="description">MUI X Telemetry collects anonymous usage data to help improve the library. This guide walk you through how to opt-in, opt-out, and configure telemetry.</p>

## Why is Telemetry collected?

MUI X is widely used by developers to build highly performant and customizable components. To further elevate the product experience, and design better features, we aim to gain deeper insights from our users.

So far, we've only been relying on manual ways such as surveys and community engagement to gather feedback. Although valuable, these are inherently limited in reach, capturing only a fraction of our user base.

Telemetry enables us to accurately measure usage patterns at scale, enabling data-driven decision-making that helps us improve the product. While we appreciate the insights this information provides, we also know that not everyone wants to send usage data and you can choose to keep the telemetry disabled.

## What is being collected?

We track the following details anonymously:

- Unique session ID: This is generated on each run with UUID.
- General machine information (operating system, version and whether or not the command was run within CI)
- Package name and version
- License info
- IP
- Timestamp of the event occurrence.

## Opting In

Currently, **Telemetry is disabled by default**. To opt-in, you can use one of the following methods:

### Setting the Environment Variable

You can set the `MUI_X_TELEMETRY_DISABLED` environment variable to `false` to enable telemetry:

```bash
MUI_X_TELEMETRY_DISABLED=false
```

> Note that some frameworks may require you to prefix the environment variable with `REACT_APP_`, `NEXT_PUBLIC_`, etc.

### Import telemetry settings from `@mui/x-license` package

You can use `muiXTelemetrySettings` to enable telemetry:

```js
import { muiXTelemetrySettings } from '@mui/x-license';

muiXTelemetrySettings.enableTelemetry();
```

### Setting the Flag in Your Application

You can set the `__MUI_X_TELEMETRY_DISABLED__` flag in your application to `false` to enable telemetry:

```js
import { ponyfillGlobal } from '@mui/utils';

ponyfillGlobal.__MUI_X_TELEMETRY_DISABLED__ = false;
```

## Opting Out

To opt-out of telemetry, you can use one of the following methods:

### Setting the Environment Variable

You can set the `MUI_X_TELEMETRY_DISABLED` environment variable to `true` to disable telemetry:

```bash
MUI_X_TELEMETRY_DISABLED=true
```

> Note that some frameworks may require you to prefix the environment variable with `REACT_APP_`, `NEXT_PUBLIC_`, etc.

### Import telemetry settings from `@mui/x-license` package

You can use `muiXTelemetrySettings` to disable telemetry:

```js
import { muiXTelemetrySettings } from '@mui/x-license';

muiXTelemetrySettings.disableTelemetry();
```

### Setting the Flag in Your Application

You can set the `__MUI_X_TELEMETRY_DISABLED__` flag in your application to `true` to disable telemetry:

```js
import { ponyfillGlobal } from '@mui/utils';

ponyfillGlobal.__MUI_X_TELEMETRY_DISABLED__ = true;
```
