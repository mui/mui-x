---
title: Licensing
---

# MUI X - Licensing

<p class="description">MUI X is an open-core, MIT-licensed library. Purchase a commercial license for advanced features and support.</p>

## MIT vs. commercial licenses

MUI has been building MIT-licensed React components since 2014, and we are committed to the continued advancement of the open-source community.
You can learn more about our ethos of stewardship in [this document from our company handbook](https://mui-org.notion.site/Stewardship-542a2226043d4f4a96dfb429d16cf5bd).

We offer commercial licenses to developers who need the most advanced features of our components that cannot be easily maintained by the open-source community.
Commercial licenses enable us to support a full-time staff of engineers, which is simply not possible through the MIT model.

Rest assured that when we release features commercially, it's only because we believe that you will not find a better MIT-licensed alternative anywhere else.

See the [Pricing](https://mui.com/pricing/) page for a detailed comparison of features.

## Community Plan

MUI X's Community Plan is published under an [MIT license](https://tldrlegal.com/license/mit-license) and is [free forever](https://mui-org.notion.site/Stewardship-542a2226043d4f4a96dfb429d16cf5bd#20f609acab4441cf9346614119fbbac1).
This plan contains features that we believe are maintainable by the contributions of the open-source community.

Community Plan packages:

- [`@mui/x-data-grid`](https://www.npmjs.com/package/@mui/x-data-grid)
- [`@mui/x-date-pickers`](https://www.npmjs.com/package/@mui/x-date-pickers)

## Pro Plan <span class="plan-pro"></span>

The MUI X Pro Plan expands on the limitations of the Community Plan with more advanced features such as multi-filtering, multi-sorting, column resizing and column pinning for the data grid; as well as the date range picker component.

The Pro Plan is available under a commercial license—visit the [Pricing](https://mui.com/pricing/) page for details.

Pro Plan packages:

- [`@mui/x-data-grid-pro`](https://www.npmjs.com/package/@mui/x-data-grid-pro)
- [`@mui/x-date-pickers-pro`](https://www.npmjs.com/package/@mui/x-date-pickers-pro)

:::info
The features exclusive to the Pro Plan are marked with the <span class="plan-pro"></span> icon across our documentation.
:::

<div class="only-light-mode">
  <img src="/static/x/commercial-header-icon-light.png" style="width: 579px; margin-bottom: 2rem;" alt="">
</div>
<div class="only-dark-mode">
  <img src="/static/x/commercial-header-icon-dark.png" style="width: 560px; margin-bottom: 2rem;" alt="">
</div>

## Premium Plan <span class="plan-premium"></span>

The MUI X Premium Plan contains the most advanced features of the data grid, such as row grouping, Excel export, aggregation, as well as everything that's included in the Pro Plan.

The Premium Plan is available under a commercial license—visit the [Pricing](https://mui.com/pricing/) page for details.

Premium Plan package:

- [`@mui/x-data-grid-premium`](https://www.npmjs.com/package/@mui/x-data-grid-premium)

:::info
The features exclusive to the Premium Plan are marked with the <span class="plan-premium"></span> icon across our documentation.
:::

## Evaluation (trial) licenses

In accordance with our [End User License Agreement](https://mui.com/store/legal/mui-x-eula/#evaluation-trial-licenses), you can use the Pro and Premium components without a commercial license for 30 days without restrictions.
You do not need to contact us to use these components for evaluation purposes.

You will need to purchase a commercial license in order to remove the watermarks and console warnings, or after the 30-day evaluation period.

## License key installation

When you purchase a commercial license, you'll receive a license key by email.
This key removes all watermarks and console warnings.

:::warning
Licenses purchased after **May 13, 2022** are only compatible with MUI X `v5.11.0` or later.

Please update your packages if you are using an earlier version.

If this is not a viable solution for your use case, please contact sales@mui.com.
:::

### How to install the key

```jsx
import { LicenseInfo } from '@mui/x-license-pro';

LicenseInfo.setLicenseKey('YOUR_LICENSE_KEY');
```

### Where to install the key

You must call `setLicenseKey` before React renders the first component.
You only need to install the key once in your application.

### Does each developer need their own key?

No, you only need one key per project.
The Plan you're using determines how many developer seats are available.

### Security

The license key is checked without making any network requests—it's designed to be public.
In fact, it's expected for the license key to be exposed in a JavaScript bundle.
We just ask our licensed users not to publicize their license keys.

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

The license key will work **forever in a production environment** with any version released before your license term ends.

However, when the term ends, you won't be licensed to access newer updates and upgrades, nor use the current or older versions in a **development environment**.
In these cases, the component will display a watermark and a console warning, stating that the license is no longer valid.

For example, if you purchase a one-year license today, you will be able to update to any version—including major versions—released in the next 12 months.
Those versions will always be available for use in a deployed application.
But you'll be required to renew your license if you need to update to a version released 18 months later or continue development with a version released in the first 12 months.

#### Invalid license key

This error indicates that your license key doesn't match what was issued by MUI—this is likely a typo.

#### Invalid license key (TypeError: extracting license expiry timestamp)

The following JavaScript exception indicates that you may be trying to validate the new license's key format on an older version of the npm package.

:::error
Error extracting license expiry timestamp.

TypeError: Cannot read properties of null (reading '1') at verifyLicense.
:::

You can solve this error by updating MUI X to `v5.11.0` or later.
