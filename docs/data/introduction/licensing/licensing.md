# Licensing

<p class="description">MUI X is an open-core, MIT-licensed library. Purchase a commercial license for advanced features and support.</p>

## MIT vs. commercial licenses

The MUI team has been building MIT-licensed React components since 2014 with Material UI.
We are committed to the continued advancement of the open-source libraries.
Anything we release under an MIT license will remain MIT-licensed forever.
You can learn more about our stewardship ethos in [this document from our company handbook](https://mui-org.notion.site/Stewardship-542a2226043d4f4a96dfb429d16cf5bd).

We offer commercial licenses to developers who need the most advanced features that cannot be easily maintained by the open-source community.
Commercial licenses enable us to support a full-time staff of engineers, which is simply not possible through the MIT model.

Rest assured that when we release features commercially, it's only because we believe that you will not find a better MIT-licensed alternative anywhere else.

See the [Pricing](https://mui.com/r/x-get-license/) page for a detailed feature comparison.

## Plans

### Community Plan

The community version of MUI X is [published under an MIT license](https://www.tldrlegal.com/license/mit-license) and is [free forever](https://mui-org.notion.site/Stewardship-542a2226043d4f4a96dfb429d16cf5bd#20f609acab4441cf9346614119fbbac1).
This version contains features that we believe are maintainable by contributions from the open-source community.

MIT licensed npm packages:

- [`@mui/x-data-grid`](https://www.npmjs.com/package/@mui/x-data-grid)
- [`@mui/x-date-pickers`](https://www.npmjs.com/package/@mui/x-date-pickers)

### Pro Plan <span class="plan-pro"></span>

The Pro version of MUI X expands on the features of the community version with more advanced capabilities such as multi-filtering, multi-sorting, column resizing and column pinning for the data grid; as well as the date range picker component.

The Pro version is available under a commercial license—visit [the Pricing page](https://mui.com/r/x-get-license/) for details.

Pro npm packages:

- [`@mui/x-data-grid-pro`](https://www.npmjs.com/package/@mui/x-data-grid-pro)
- [`@mui/x-date-pickers-pro`](https://www.npmjs.com/package/@mui/x-date-pickers-pro)

:::info
The features exclusive to the Pro version are marked with the <span class="plan-pro"></span> icon throughout the documentation.
:::

### Premium Plan <span class="plan-premium"></span>

The Premium version of MUI X covers the most advanced features of the data grid, such as row grouping, Excel export, and aggregation, in addition to everything that's included in the Pro Plan.

The Premium version is available under a commercial license—visit [the Pricing page](https://mui.com/r/x-get-license/) for details.

Premium npm package:

- [`@mui/x-data-grid-premium`](https://www.npmjs.com/package/@mui/x-data-grid-premium)

:::info
The features exclusive to the Premium version are marked with the <span class="plan-premium"></span> icon throughout the documentation.
:::

## Upgrading

The npm packages of any given plan are a **superset** of the packages on the plan below.
So to upgrade, replace the [npm packages](#plans) and the components' imports with the ones from the target plan.

For example, when you want to upgrade the Data Grid:

- **Upgrading from Community to Pro.**

  `@mui/x-data-grid-pro` is a superset of `@mui/x-data-grid`, so you can upgrade from the Community to the Pro plan like this:

  ```diff
  -import { DataGrid } from '@mui/x-data-grid';
  +import { DataGridPro } from '@mui/x-data-grid-pro';
  ```

  :::warning
  However, there is an exception to the superset rule. The default value of the `pagination` prop changes, [see the docs of the pagination](/x/react-data-grid/pagination/).
  :::

- **Upgrading from Pro to Premium.**

  `@mui/x-data-grid-premium` is a superset of `@mui/x-data-grid-pro`, so you can upgrade from Pro to Premium like this:

  ```diff
  -import { DataGridPro } from '@mui/x-data-grid-pro';
  +import { DataGridPremium } from '@mui/x-data-grid-premium';
  ```

  :::info
  If you are looking for upgrading from Pro to Premium, please contact us at [sales@mui.com](mailto:sales@mui.com?subject=My%20upgrade%20discount%20to%20Premium).
  We'll provide you with a discount based on the remaining time of your current license term.
  :::

For more details on how to install the packages, please check out our [package installation guide](/x/introduction/installation/).

## Evaluation (trial) licenses

In accordance with the [End User License Agreement](https://mui.com/r/x-license-trial/), you can use the Pro and Premium components without a commercial license for 30 days for non-production environments.
You can also use it for the development of code not intended for production (for example the reproduction of an issue, doing a benchmark).

You don't need to contact us to use these components for the above cases.
You will need to purchase a commercial license in order to remove the watermarks and console warnings.

## How many developer seats do I need?

The number of seats purchased on your license must correspond to the number of concurrent developers contributing changes to the front-end code of the project that uses MUI X Pro or Premium.

**Example 1.** Company 'A' is developing an application named 'AppA'.
The app needs to render 10K rows of data in a table and allow users to group, filter, and sort.
The dev team adds MUI X Pro to the project to satisfy this requirement.
Five front-end and ten back-end developers are working on 'AppA'.
Only one developer is tasked with configuring and modifying the data grid.
The front-end developers and only are contributing code to the front-end.
Company 'A' purchases five licenses.

**Example 2.** A UI development team at Company 'B' creates its own UI library for
internal development and includes MUI X Pro as a component.
The team working on 'AppA' uses the new library and so does the team working on 'AppB'.
'AppA' has 5 front-end developers and 'AppB' has three.
There are two front-end developers on the UI development team.
Company 'B' purchases ten licenses.

This is [the relevant clause in the EULA.](https://mui.com/legal/mui-x-eula/#required-quantity-of-licenses)

## License key installation

When you purchase a commercial license, you'll receive a license key by email.
This key removes all watermarks and console warnings.

:::warning
The orders placed after **May 13, 2022** come with a license key by default that is only compatible with MUI X from `v5.11.0` and upwards.

Please update your npm package if you're using an earlier version.

If this isn't possible, please contact sales@mui.com to request a compatible license key.
:::

## How to install the key

First, make sure you have [any](#plans) of the commercial packages installed.
They include a dependency called `@mui/x-license-pro`, used to validate the license.

If you're upgrading from community, you may want to check the [upgrading](#upgrading-from-community) section.

With a commercial packaged installed, use `LicenseInfo` to set your licence key as in the code snippet below.
Calling `setLicenseKey()` "install" the key.

```jsx
import { LicenseInfo } from '@mui/x-license-pro';

LicenseInfo.setLicenseKey('YOUR_LICENSE_KEY');
```

You only need to install the key once in your application.

## Where to install the key

You need to call `setLicenseKey()` before React renders the first component.

The bundle size of `setLicenseKey()` is relatively small, it should be small enough for you to be able to call it in all your bundles, regardless of whether a commercial MUI X component is rendered or not.

## Next.js integration

### Next.js App Router

When using Next.js App Router, you have multiple options to install the license key.

1. If your [`layout.js`](https://nextjs.org/docs/app/api-reference/file-conventions/layout) is using `'use client'`, you can set the license key in it:

```tsx
'use client';

import { LicenseInfo } from '@mui/x-license-pro';

LicenseInfo.setLicenseKey('YOUR_LICENSE_KEY');
```

2. Otherwise (**recommended**), you can create a dummy component called `MuiXLicense.tsx`:

```tsx
'use client';

import { LicenseInfo } from '@mui/x-license-pro';

LicenseInfo.setLicenseKey('YOUR_LICENSE_KEY');

export default function MuiXLicense() {
  return null;
}
```

And render `<MuiXLicense>` in your [`layout.js`](https://nextjs.org/docs/app/api-reference/file-conventions/layout):

```tsx
import MuiXLicense from './MuiXLicense';

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {props.children}
        <MuiXLicense />
      </body>
    </html>
  );
}
```

### Next.js pages

When using Next.js pages, a great place to call `setLicenseKey` is in [`_app.js`](https://nextjs.org/docs/pages/building-your-application/routing/custom-app).

```tsx
import { LicenseInfo } from '@mui/x-license-pro';

LicenseInfo.setLicenseKey('YOUR_LICENSE_KEY');

export default function MyApp(props) {
  const { Component, pageProps } = props;
  return <Component {...pageProps} />;
}
```

### Environment variable with Next.js

:::info
While we recommend hard-coding the license key in git, you can also use an environment variable to set the license key.
This method is required if your codebase is "source-available" (to hide the license key), and can be preferred if you want to granularly share the license key with your licensed developers.
:::

The license key is validated on the server and client side so you must expose the environment variable to the browser.
To do this, you need to prefix the environment variables with `NEXT_PUBLIC_` as explained in the [Next.js documentation](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser):

```tsx
import { LicenseInfo } from '@mui/x-license-pro';

LicenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_MUI_X_LICENSE_KEY);
```

## What is the key for?

The license key is meant to help you [stay compliant](https://mui.com/legal/mui-x-eula/#license-key) with the EULA of the commercial licenses.
While each developer needs to be licensed, the license key is set once per project, where the components are used.

## License key security

The license key is checked without making any network requests—it's designed to be public.
It's expected that the license key will be exposed in a JavaScript bundle;
we simply ask licensed users not to actively publicize their license key.

## Validation failures

If the validation of the license key fails, the component displays a watermark and provides a console warning in both development and production.
End users can still use the component.

Here are the different possible validation errors:

### 1. `Missing license key`

This error indicates that your license key is missing. You might not be allowed to use the software.
The component will look something like this:

<div class="only-light-mode">
  <img src="/static/x/watermark-light.png" style="width: 653px; margin-bottom: 2rem;" alt="" loading="lazy">
</div>
<div class="only-dark-mode">
  <img src="/static/x/watermark-dark.png" style="width: 645px; margin-bottom: 2rem;" alt="" loading="lazy">
</div>

To solve the issue, you can check the [free trial conditions](#evaluation-trial-licenses), if you are eligible no actions are required.
If you are not eligible to the free trial, you need to [purchase a license](https://mui.com/r/x-get-license/) or stop using the software immediately.

### 2. `Expired package version`

This error indicates that you have installed a version of the software released after the end of your license term.
By default, commercial licenses provide access to new versions released during the first year after the purchase.

To solve the issue, you can [renew your license](https://mui.com/r/x-get-license/) or install an older version of the npm package that is compatible with your license key.

For example, if you purchase a one-year license today, you will be able to update to any version—including major versions—released in the next twelve months.

### 3. `Expired license key`

This error indicates that your annual license key is expired.

The annual license works **forever in production** with any version released before your license term ends.
However, when the term ends, you are not allowed to use the current or older versions in **development**.

To solve the issue, you can [renew your license](https://mui.com/r/x-get-license/) or stop making changes to code depending on MUI X's APIs.

### 4. `License key plan mismatch`

This error indicates that your use of MUI X is not compatible with the plan of your license key.
The feature you are trying to use is not included in the plan of your license key.
This happens if you try to use `DataGridPremium` with a license key for the Pro plan.

To solve the issue, you can [upgrade your plan](https://mui.com/r/x-get-license/?scope=premium) from Pro to Premium.
Or if you didn\'t intend to use Premium features, you can replace the import of `@mui/x-data-grid-premium` with `@mui/x-data-grid-pro`.

### 5. `Invalid license key`

This error indicates that your MUI X license key format isn't valid.
It could be because the license key is missing a character or has a typo.

To solve the issue, you need to double check that `setLicenseKey()` is called with the right argument.
Please check the [license key installation](#license-key-installation).

### 6. Invalid license key (`TypeError: extracting license expiry timestamp`)

The following JavaScript exception indicates that you may be trying to validate the new license's key format on an older version of the npm package.

:::error
Error extracting license expiry timestamp.

TypeError: Cannot read properties of null (reading '1') at verifyLicense.
:::

To solve the issue, you can update MUI X to `v5.11.0` or a later version or contact the support to get a legacy license key.
