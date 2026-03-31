---
title: MUI X Telemetry guide
packageName: '@mui/x-telemetry'
---

# MUI X Telemetry guide [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">MUI X Telemetry collects pseudonymous usage data to improve the library and support license compliance. Learn how it works and how to opt out.</p>

## Why is Telemetry collected?

Developers widely use MUI X to build highly performant and customized applications.
To further elevate the product experience, design better features, and ensure proper license compliance, we aim to gain deeper insights from our users.

So far, we've only been relying on manual ways such as surveys and community engagement to gather feedback. Although valuable, these are inherently limited in reach, capturing only a fraction of our user base.

Telemetry gives us a clearer picture of how MUI X is used in the real world—what features are most helpful, what needs work, and where we should focus next. While community feedback and surveys are valuable, they only tell part of the story. It also helps us verify that the number of developers using MUI X aligns with the licensed seat count. Telemetry fills in the gaps with both product usage insights and compliance verification, helping us make smarter, faster product decisions.

By keeping telemetry enabled, you directly contribute to shaping the future of MUI X. You help us build better tools for you and thousands of other developers—without any impact on your production app. And of course, participation is entirely optional and you can opt out at any time.

## What is being collected?

We track the following details pseudonymously during development mode:

- **Machine ID:** A SHA-256 hash of the [machine identifier](https://www.npmjs.com/package/node-machine-id). Used to approximate the number of developers.
- **Project ID:** A SHA-256 hash computed from the best available project identifier. Used to differentiate projects.
- **Repo Hash:** A SHA-256 hash of the git remote URL. Used to identify the repository.
- **Postinstall Package Name Hash:** A SHA-256 hash of the nearest `package.json` name, resolved at install time. In a monorepo this gives the root name.
- **Runtime Package Name Hash:** A SHA-256 hash of the `package.json` name, resolved at runtime via `npm_package_name` or `fetch('/package.json')`. In a monorepo this gives the individual app name.
- **Root Path Hash:** A SHA-256 hash of the git root path or working directory. Used as a last-resort project identifier.
- **Anonymous ID:** A randomly generated identifier stored in `localStorage`. Used as a complementary signal to the machine ID in browser environments.
- **Session ID:** A randomly generated identifier stored in `sessionStorage`. Scoped to a single browser session.
- **Fingerprint:** A browser-level device identifier using hardware and software signals. Used as a complementary signal to the machine ID.
- **Package and version used**
- **License info**
- **Environment flags:** Whether the environment is a Docker container or CI system.
- **Timestamp** of the event occurrence (for example, license key verification)
- **IP address** is not explicitly collected, but is inherent to any network request made to our servers.

:::info
**Privacy Assurance**: We are committed to maintaining your privacy. All data collected is pseudonymized—hashed or randomly generated—so it cannot be traced back to you without additional information. We focus on understanding usage patterns and ensuring license compliance to better serve our customers and developer community.
:::

## Where does Telemetry apply?

Telemetry collection is specifically associated with the usage of paid MUI X Pro and Premium components, such as the advanced versions of the data grid and date/time pickers. This targeted approach allows us to focus on enhancing the premium features that our subscribers rely on.

## Telemetry in development mode only

MUI X Telemetry is designed to operate exclusively during development.
In production builds of your application, telemetry is entirely removed, ensuring no data collection in your live environment and almost no runtime overhead ([proof](https://bundlephobia.com/package/@mui/x-telemetry)).
This guarantees that your production application's performance and behavior remain unaffected.

:::info
Telemetry is enabled by default in development mode. You have full control to opt out as per your preference.
:::

## Opting out

To opt out of telemetry, you can use one of the following methods:

### Setting the environment variable

You can set the `MUI_X_TELEMETRY_DISABLED` environment variable to `true` to disable telemetry:

```bash
MUI_X_TELEMETRY_DISABLED=true
```

Note that some frameworks may require you to prefix the environment variable with `REACT_APP_`, `NEXT_PUBLIC_`, etc.

### Import telemetry settings from `@mui/x-license` package

You can use `muiXTelemetrySettings` to disable telemetry:

```js
import { muiXTelemetrySettings } from '@mui/x-license';

muiXTelemetrySettings.disableTelemetry();
```

Note: You can use `muiXTelemetrySettings.enableDebug();` to log telemetry data to your browser console and inspect what's being sent.

### Setting the flag in your application

You can set the `__MUI_X_TELEMETRY_DISABLED__` flag in your application to `true` to disable telemetry:

```js
globalThis.__MUI_X_TELEMETRY_DISABLED__ = true;
```
