---
packageName: '@mui/x-telemetry'
---

# MUI X Telemetry guide

<p class="description">MUI X Telemetry collects anonymous usage data to help improve the library. This guide walk you through how to opt-in, opt-out, and configure telemetry.</p>

## Why is Telemetry collected?

Developers widely use MUI X to build highly performant and customized applications.
To further elevate the product experience, and design better features, we aim to gain deeper insights from our users.

So far, we've only been relying on manual ways such as surveys and community engagement to gather feedback. Although valuable, these are inherently limited in reach, capturing only a fraction of our user base.

Telemetry gives us a clearer picture of how MUI X is used in the real world—what features are most helpful, what needs work, and where we should focus next. While community feedback and surveys are valuable, they only tell a part of the story. Telemetry fills in the gaps and helps us make smarter, faster product decisions.

By opting in, you directly contribute to shaping the future of MUI X. You help us build better tools for you and thousands of other developers—without any impact on your production app. And of course, participation is entirely optional and telemetry is off by default.

## What is being collected?

We track the following details anonymously during development mode:

- Unique session ID: This is generated on each run with UUID.
- General machine information (operating system, version and whether or not the command was run within CI)
- Package name and version
- License info
- IP
- Timestamp of the event occurrence.

:::info
**Privacy Assurance**: We are committed to maintaining your privacy. All data collected is anonymized, ensuring that no personally identifiable information is gathered. We focus solely on understanding usage patterns to better serve our customers and developer community.
:::

## Telemetry for Pro and Premium Components

Telemetry collection is specifically associated with the usage of paid MUI X components, such as the advanced versions of the data grid and date/time pickers. This targeted approach allows us to focus on enhancing the premium features that our subscribers rely on.

## Telemetry in Development Mode Only

MUI X Telemetry is designed to operate exclusively during development. In production builds of your application, telemetry is entirely inactive, ensuring no runtime overhead or data collection in your live environment. This guarantees that your production application's performance and behavior remain unaffected.

:::info
Currently, Telemetry is disabled by default and you have full control to opt-in or opt-out as per your preference.
:::

## Opting In

To opt-in, you can use one of the following methods:

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
