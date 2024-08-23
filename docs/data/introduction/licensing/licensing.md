# Licensing

<p class="description">MUI X is an open-core, MIT-licensed library. Purchase a commercial license for advanced features and support.</p>

## MIT vs. commercial licenses

The MUI X team has been building MIT-licensed React components since 2014, starting with Material UI.
We are committed to the continued advancement of the open-source libraries.
Anything we release under an MIT license will remain MIT-licensed forever.
You can learn more about our stewardship ethos in [this document from our company handbook](https://mui-org.notion.site/Stewardship-542a2226043d4f4a96dfb429d16cf5bd).

We offer commercial licenses to developers who need the most advanced features that cannot be easily maintained by the open-source community.
Commercial licenses enable us to support a full-time staff of engineers, which is simply not possible through the MIT model.

Rest assured that when we release features commercially, it's only because we believe that you will not find a better MIT-licensed alternative anywhere else.

See [the Pricing page](https://mui.com/r/x-get-license/) for a detailed feature comparison.

## Plans

### Community plan

The MUI X Community plan is [published under an MIT license](https://www.tldrlegal.com/license/mit-license) and is [free forever](https://mui-org.notion.site/Stewardship-542a2226043d4f4a96dfb429d16cf5bd#20f609acab4441cf9346614119fbbac1).
This version contains features that we believe are maintainable by contributions from the open-source community.

These are the Community MIT-licensed npm packages:

- [`@mui/x-data-grid`](https://www.npmjs.com/package/@mui/x-data-grid)
- [`@mui/x-date-pickers`](https://www.npmjs.com/package/@mui/x-date-pickers)
- [`@mui/x-charts`](https://www.npmjs.com/package/@mui/x-charts)
- [`@mui/x-tree-view`](https://www.npmjs.com/package/@mui/x-tree-view)

### Pro plan <span class="plan-pro"></span>

MUI X Pro expands on the Community version with more advanced features and functionality.
The Data Grid Pro comes with multi-filtering, multi-sorting, column resizing, and column pinning in addition to the baseline features.
You also gain access to the Date and Time Range Picker components.

The Pro version is available under a commercial license—visit [the Pricing page](https://mui.com/r/x-get-license/) for details.
Exclusive features are marked with the <span class="plan-pro" aria-label="MUI X Pro plan icon"></span> icon throughout the documentation.

These are the Pro npm packages:

- [`@mui/x-data-grid-pro`](https://www.npmjs.com/package/@mui/x-data-grid-pro)
- [`@mui/x-date-pickers-pro`](https://www.npmjs.com/package/@mui/x-date-pickers-pro)
- [`@mui/x-tree-view-pro`](https://www.npmjs.com/package/@mui/x-tree-view-pro)
- [`@mui/x-charts-pro`](https://www.npmjs.com/package/@mui/x-charts-pro)

### Premium plan <span class="plan-premium"></span>

MUI X Premium unlocks the most advanced features of the Data Grid, including row grouping and Excel exporting, on top of everything else offered in the Pro plan.

The Premium version is available under a commercial license—visit [the Pricing page](https://mui.com/r/x-get-license/) for details.
Exclusive features are marked with the <span class="plan-premium" aria-label="MUI X Premium plan icon"></span> icon throughout the documentation.

These are the Premium npm packages:

- [`@mui/x-data-grid-premium`](https://www.npmjs.com/package/@mui/x-data-grid-premium)

## Upgrading

The [npm packages](#plans) of any given plan are a **superset** of the packages in the Community version.
To upgrade, you must install the respective paid package and replace all imports with the new path.

Below are upgrading scenarios using the Data Grid as an example:

### From Community to Pro

`@mui/x-data-grid-pro` is a superset of `@mui/x-data-grid`.
Install the Pro package, then update all imports accordingly:

```diff
-import { DataGrid } from '@mui/x-data-grid';
+import { DataGridPro } from '@mui/x-data-grid-pro';
```

:::warning
There is an exception to the superset rule: the Data Grid's `pagination` prop default value changes.
See [the Pagination page](/x/react-data-grid/pagination/) for details.
:::

### From Pro to Premium

`@mui/x-data-grid-premium` is a superset of `@mui/x-data-grid-pro`.
Install the Premium package, then update all imports accordingly:

```diff
-import { DataGridPro } from '@mui/x-data-grid-pro';
+import { DataGridPremium } from '@mui/x-data-grid-premium';
```

:::success
Upgrading from Pro to Premium?
Please contact [sales@mui.com](mailto:sales@mui.com?subject=My%20upgrade%20discount%20to%20Premium) to get started.

We'll provide you with a discount based on the remaining time of your current license term.
:::

For more details on how to install each package, visit the [package installation guide](/x/introduction/installation/).

## Evaluation (trial) licenses

Per the [End User License Agreement](https://mui.com/legal/mui-x-eula/#evaluation-trial-licenses), you can use the Pro and Premium components without a commercial license for 30 days for non-production environments.
You can also use it for the development of code not intended for production (for example the reproduction of an issue, doing a benchmark).

You don't need to contact us to use these components for the above cases.
You will need to purchase a commercial license in order to remove the watermarks and console warnings.

## How many developer seats do I need?

The number of seats purchased on your license must correspond to the number of concurrent developers contributing changes to the front-end code of the project that uses MUI X Pro or Premium.

- **Example 1.** Company 'A' is developing an application named 'AppA'.
  The app needs to render 10K rows of data in a table and allow users to group, filter, and sort.
  The dev team adds MUI X Pro to the project to satisfy this requirement.
  Five front-end and ten back-end developers are working on 'AppA'.
  Only one developer is tasked with maintaining the Data Grid, but there are five total developers who work on the front-end.
  Company 'A' must purchase five seats.

- **Example 2.** A UI development team at Company 'B' creates its own UI library for internal development that includes MUI X Pro components.
  The teams working on 'AppY' and 'AppZ' both adopt this new library.
  'AppY' has five front-end developers, and 'AppZ' has three; additionally, there are two front-end developers on the company's UI development team.
  Company 'B' must purchase ten seats.

This is [the relevant clause in the EULA.](https://mui.com/legal/mui-x-eula/#required-quantity-of-licenses)

## License key

When you purchase a commercial license, you'll receive a license key by email.
This key removes all watermarks and console warnings.

:::warning
Orders placed after **May 13, 2022** come with a license key by default that is only compatible with MUI X from `v5.11.0` and upwards.

Please update your npm package if you're using an earlier version.

If this isn't possible, please contact sales@mui.com to request a compatible license key.
:::

### How to install the key

The license key depends on a package called `@mui/x-license` that validates whether or not it's active.
Once you have your license key, import the `LicenseInfo` method from that package and call the `setLicenseKey()` function:

```jsx
import { LicenseInfo } from '@mui/x-license';

LicenseInfo.setLicenseKey('YOUR_LICENSE_KEY');
```

You'll only need to do this once in your app.

### Where to install the key

You must call the `setLicenseKey()` function before React renders the first component in your app.

Its bundle size is relatively small, so it should be fine to call it in all of your bundles, regardless of whether a commercial MUI X component is rendered.

## Next.js integration

### Next.js App Router

When using Next.js App Router, you have multiple options to install the license key.

1. If your [`layout.js`](https://nextjs.org/docs/app/api-reference/file-conventions/layout) is using `'use client'`, you can set the license key in it:

```tsx
'use client';
import { LicenseInfo } from '@mui/x-license';

LicenseInfo.setLicenseKey('YOUR_LICENSE_KEY');
```

2. Otherwise (**recommended**), you can create a dummy component called `MuiXLicense.tsx`:

```tsx
'use client';
import { LicenseInfo } from '@mui/x-license';

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

### Next.js Pages Router

When using Next.js pages, a great place to call `setLicenseKey` is in [`_app.js`](https://nextjs.org/docs/pages/building-your-application/routing/custom-app).

```tsx
import { LicenseInfo } from '@mui/x-license';

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

The license key is validated on the server and client-side so you must expose the environment variable to the browser.
To do this, you need to prefix the environment variables with `NEXT_PUBLIC_` as explained in the [Next.js documentation](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser):

```tsx
import { LicenseInfo } from '@mui/x-license';

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

### 1. Missing license key

This error indicates that your license key is missing. You might not be allowed to use the software.
The component will look something like this:

<div class="only-light-mode">
  <img src="/static/x/watermark-light.png" width="1290" height="536" style="width: 645px; margin-bottom: 2rem;" alt="" loading="lazy">
</div>
<div class="only-dark-mode">
  <img src="/static/x/watermark-dark.png" width="1290" height="536" style="width: 645px; margin-bottom: 2rem;" alt="" loading="lazy">
</div>

To solve the issue, you can check the [free trial conditions](#evaluation-trial-licenses), if you are eligible no actions are required.
If you are not eligible to the free trial, you need to [purchase a license](https://mui.com/r/x-get-license/) or stop using the software immediately.

### 2. Expired package version

This error indicates that you have installed a version of MUI X Pro / Premium released after the end of your license term.
By default, commercial licenses provide access to new versions released during the first year after the purchase.

To solve the issue, you can [renew your license](https://mui.com/r/x-get-license/) or install an older version of the npm package that is compatible with your license key.

For example, if you purchase a one-year license today, you will be able to update to any version—including major versions—released in the next twelve months.

### 3. Expired license key

This error indicates that your annual license key is expired.

The annual license works **forever in production** with any version of MUI X Pro / Premium released before your license term ends.
However, when the term ends, you are not allowed to use the current or older versions in **development**.

To solve the issue, you can [renew your license](https://mui.com/r/x-get-license/) or stop making changes to code depending on MUI X's APIs.

:::warning
Make sure to set `process.env.NODE_ENV` to `'production'` in your build process to avoid the watermark in production.
Most bundlers set this environment variable automatically when building for production, but for custom setups, you might need to set it manually.

Note that `NODE_ENV=production` is not MUI X-specific and is a common practice in the JavaScript ecosystem.
It allows bundlers and libraries to optimize the output for production and eliminate dead code, so it's worth checking if it's set correctly in your project.
See related documentation for [Webpack](https://webpack.js.org/guides/production/#specify-the-mode), [Node.js](https://nodejs.org/en/learn/getting-started/nodejs-the-difference-between-development-and-production) and [Next.js](https://nextjs.org/docs/messages/non-standard-node-env) for more information.
:::

### 4. License key plan mismatch

This error indicates that your use of MUI X is not compatible with the plan of your license key.
The feature you are trying to use is not included in the plan of your license key.
This happens if you try to use `DataGridPremium` with a license key for the Pro plan.

To solve the issue, you can [upgrade your plan](https://mui.com/r/x-get-license/?scope=premium) from Pro to Premium.
Or if you didn\'t intend to use Premium features, you can replace the import of `@mui/x-data-grid-premium` with `@mui/x-data-grid-pro`.

### 5. Component not included in your license

This error indicates that the component you are trying to use is not covered by your current license.
This happens if you try to use `ChartsPro` or `TreeViewPro` with a license that does not cover these products.

To solve the issue, please consider an earlier [renewal](https://mui.com/r/x-get-license/).

You might be eligible for a discount if you have an active Pro license.
Contact [sales@mui.com](mailto:sales@mui.com?subject=My%20upgrade%20discount) for additional information.

Or if you didn't intend to use the Pro features, you can replace the import of `@mui/x-charts-pro` or `@mui/x-tree-view-pro` with `@mui/x-charts` or `@mui/x-tree-view` respectively.

### 6. Invalid license key

This error indicates that your MUI X license key format isn't valid.
It could be because the license key is missing a character or has a typo.

To solve the issue, you need to double-check that `setLicenseKey()` is called with the right argument.
Please check the [license key installation](/x/introduction/licensing/#license-key).

### 7. Invalid license key (TypeError: extracting license expiry timestamp)

The following JavaScript exception indicates that you may be trying to validate the new license's key format on an older version of the npm package.

:::error
Error extracting license expiry timestamp.

TypeError: Cannot read properties of null (reading '1') at verifyLicense.
:::

To solve the issue, you can update MUI X to `v5.11.0` or a later version or contact the support to get a legacy license key.
