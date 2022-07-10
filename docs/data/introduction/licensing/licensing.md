# Licensing

<p class="description">MUI X is an open-core, MIT-licensed library. Purchase a commercial license for advanced features and support.</p>

## MIT vs. commercial licenses

MUI has been building MIT-licensed React components since 2014, and we are committed to the continued advancement of the open-source libraries.
Anything we release under an MIT license will remain MIT-licensed forever.
You can learn more about our stewardship ethos in [this document from our company handbook](https://mui-org.notion.site/Stewardship-542a2226043d4f4a96dfb429d16cf5bd).

We offer commercial licenses to developers who need the most advanced features that cannot be easily maintained by the open-source community.
Commercial licenses enable us to support a full-time staff of engineers, which is simply not possible through the MIT model.

Rest assured that when we release features commercially, it's only because we believe that you will not find a better MIT-licensed alternative anywhere else.

See the [Pricing](https://mui.com/pricing/) page for a detailed feature comparison.

## Plans

### Community Plan

The free version of MUI X is [published under an MIT license](https://tldrlegal.com/license/mit-license) and is [free forever](https://mui-org.notion.site/Stewardship-542a2226043d4f4a96dfb429d16cf5bd#20f609acab4441cf9346614119fbbac1).
This version contains features that we believe are maintainable by contributions from the open-source community.

MIT licensed packages:

- [`@mui/x-data-grid`](https://www.npmjs.com/package/@mui/x-data-grid)
- [`@mui/x-date-pickers`](https://www.npmjs.com/package/@mui/x-date-pickers)

### Pro Plan<span class="plan-pro"></span>

The Pro version of MUI X expands on the features of the free version with more advanced capabilities such as multi-filtering, multi-sorting, column resizing and column pinning for the data grid; as well as the date range picker component.

The Pro version is available under a commercial license—visit [the Pricing page](https://mui.com/pricing/) for details.

Pro packages:

- [`@mui/x-data-grid-pro`](https://www.npmjs.com/package/@mui/x-data-grid-pro)
- [`@mui/x-date-pickers-pro`](https://www.npmjs.com/package/@mui/x-date-pickers-pro)

:::info
The features exclusive to the Pro version are marked with the <span class="plan-pro"></span> icon throughout the documentation.
:::

### Premium Plan<span class="plan-premium"></span>

The Premium version of MUI X covers the most advanced features of the data grid, such as row grouping, Excel export, and aggregation, in addition to everything that's included in the Pro Plan.

The Premium version is available under a commercial license—visit [the Pricing page](https://mui.com/pricing/) for details.

Premium package:

- [`@mui/x-data-grid-premium`](https://www.npmjs.com/package/@mui/x-data-grid-premium)

:::info
The features exclusive to the Premium version are marked with the <span class="plan-premium"></span> icon throughout the documentation.
:::

## Upgrading from Pro to Premium

You can use your Pro license as a credit when purchasing MUI X Premium.
We'll provide you with a discount based on the remaining time that your current license is valid.
Please contact us at [sales@mui.com](mailto:sales@mui.com?subject=My%20upgrade%20discount%20to%20Premium) to upgrade.

## Evaluation (trial) licenses

In accordance with our [End User License Agreement](https://mui.com/store/legal/mui-x-eula/#evaluation-trial-licenses), you can use the Pro and Premium components without a commercial license for 30 days without restrictions.
You don't need to contact us to use these components for evaluation purposes.

You will need to purchase a commercial license in order to remove the watermarks and console warnings, and after the 30-day evaluation period.

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

This is [the relevant clause in the EULA.](https://mui.com/store/legal/mui-x-eula/#required-quantity-of-licenses)

## License key installation

When you purchase a commercial license, you'll receive a license key by email.
This key removes all watermarks and console warnings.

:::warning
The orders placed after **May 13, 2022** come with a license key by default that is only compatible with MUI X from `v5.11.0` and upwards.

Please update your package if you're using an earlier version.

If this isn't possible, please contact sales@mui.com to request a compatible license key.
:::

### How to install the key

```jsx
import { LicenseInfo } from '@mui/x-license-pro';

LicenseInfo.setLicenseKey('YOUR_LICENSE_KEY');
```

### Where to install the key

You need to call `setLicenseKey` before React renders the first component.
You only need to install the key once in your application.

:::info
When using Next.js, you should call `setLicenseKey` in [`_app.js`](https://nextjs.org/docs/advanced-features/custom-app):

```tsx
LicenseInfo.setLicenseKey('YOUR_LICENSE_KEY');

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
```

:::

### What is the key for?

The license key is meant to help you [stay compliant](https://mui.com/store/legal/mui-x-eula/#license-key) with the EULA of the commercial licenses.
While each developer needs to be licensed, the license key is set once per project, where the components are used.

### Security

The license key is checked without making any network requests—it's designed to be public.
It's expected that the license key will be exposed in a JavaScript bundle;
we simply ask licensed users not to actively publicize their license key.

### Validation failures

If the validation of the license key fails, the component displays a watermark and provides a console warning in both development and production.
End users can still use the component.

Here are the different possible validation errors:

#### Missing license key

If the license key is missing, the component will look something like this:

<div class="only-light-mode">
  <img src="/static/x/watermark-light.png" style="width: 653px; margin-bottom: 2rem;" alt="" loading="lazy">
</div>
<div class="only-dark-mode">
  <img src="/static/x/watermark-dark.png" style="width: 645px; margin-bottom: 2rem;" alt="" loading="lazy">
</div>

:::info
Note that you are still allowed to use the component for [evaluation purposes](#evaluation-trial-licenses) in this case.
:::

#### License key expired

The license key will work **forever in production** with any version released before your license term ends.

However, when the term ends, you won't be able to use newer releases, nor use the current or older versions in **development**.
In this case, the component will display a watermark and a console warning, stating that the license is no longer valid.

For example, if you purchase a one-year license today, you will be able to update to any version—including major versions—released in the next twelve months.
Those versions will always be available for use in a deployed application,
however you'll be required to renew your license if you need to continue development with a version released after twelve months.

#### Invalid license key

This error indicates that your license key doesn't match what is expected. This is likely a typo.

#### Invalid license key (TypeError: extracting license expiry timestamp)

The following JavaScript exception indicates that you may be trying to validate the new license's key format on an older version of the npm package.

:::error
Error extracting license expiry timestamp.

TypeError: Cannot read properties of null (reading '1') at verifyLicense.
:::

You can solve this error by updating MUI X to `v5.11.0` or later.
