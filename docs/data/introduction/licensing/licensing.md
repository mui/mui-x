---
title: Overview
---

# MUI X - Licensing

<p class="description">MUI X is an open-core, MIT-licensed library. Purchase a commercial license for advanced features and support.</p>

## MIT vs. commercial

_How do we decide if a feature is MIT or commercial?_

We have been building MIT React components since 2014,
and have learned much about the strengths and weaknesses of the MIT license model.
The health of this model is improving every day.
As the community grows, it increases the probability that developers contribute improvements to the project.
You can find our pledge to nurture the MIT licensed content on [this Stewardship page](https://mui-org.notion.site/Stewardship-542a2226043d4f4a96dfb429d16cf5bd).

However, we believe that we have reached the sustainability limits of what the model can support for advancing our mission forward.
We have seen too many MIT licensed components moving slowly or getting abandoned.
The community isn't contributing improvements as fast as the problems deserved to be solved.

We are using a commercial license to forward the development of the most advanced features, where the MIT model can't sustain it.
A feature should only be commercial if it has no great MIT alternatives.

The detailed feature comparison is available on the [Pricing](https://mui.com/pricing/) page.

## Community Plan

MUI X's Community Plan is published under [MIT license](https://tldrlegal.com/license/mit-license) and [free forever](https://mui-org.notion.site/Stewardship-542a2226043d4f4a96dfb429d16cf5bd#20f609acab4441cf9346614119fbbac1).
This plan contains features we believe are sustainable by the contributions of the open-source community.

Community Plan packages:

- [`@mui/x-data-grid`](https://www.npmjs.com/package/@mui/x-data-grid)
- [`@mui/x-date-pickers`](https://www.npmjs.com/package/@mui/x-date-pickers)

## Pro Plan <span class="plan-pro"></span>

The MUI X Pro Plan expands on the limitations of the Community Plan with more advanced features such as multi-filtering, multi-sorting, column resizing and column pinning for the data grid; and the date range picker.

The Pro Plan is available under a commercial license—visit the [Pricing](https://mui.com/pricing/) page for details.
This plan contains the features that are at the limit of what the open-source model can sustain.
For instance, providing support for handling massive amounts of data, in a flexible data grid integrated with a comprehensive set of components.

Pro Plan packages:

- [`@mui/x-data-grid-pro`](https://www.npmjs.com/package/@mui/x-data-grid-pro)
- [`@mui/x-date-pickers-pro`](https://www.npmjs.com/package/@mui/x-date-pickers-pro)

The features exclusive to the Pro Plan are marked with the <span class="plan-pro"></span> icon across our documentation.

<div class="only-light-mode">
  <img src="/static/x/commercial-header-icon-light.png" style="width: 579px; margin-bottom: 2rem;" alt="">
</div>
<div class="only-dark-mode">
  <img src="/static/x/commercial-header-icon-dark.png" style="width: 560px; margin-bottom: 2rem;" alt="">
</div>

## Premium Plan <span class="plan-premium"></span>

The MUI X Premium Plan contains the most advanced features of the data grid, such as row grouping, Excel export, aggregation, as well as everything that's included in the Pro Plan.

The Premium Plan is available under a commercial license—visit the [Pricing](https://mui.com/pricing/) page for details.
This plan contains highly complex features that can be useful to analyze and group data without the use of an external application.
The price of the plan targets small to medium-size teams.

Premium Plan package:

- [`@mui/x-data-grid-premium`](https://www.npmjs.com/package/@mui/x-data-grid-premium)

The features exclusive to the Premium Plan are marked with the <span class="plan-premium"></span> icon across our documentation.

## Evaluation (trial) licenses

In accordance with our [End User License Agreement](https://mui.com/store/legal/mui-x-eula/#evaluation-trial-licenses), you can use the Pro and Premium components without a commercial license for 30 days without restrictions.
You do not need to contact us to use these components for evaluation purposes.

You will need to purchase a commercial license in order to remove the watermarks and console warnings, or after the given 30 days period of evaluation.

## License key installation

When you purchase a commercial license, you'll receive a license key by email.
This key removes all watermarks and console warnings.

:::warning
Licenses purchased after **May 13, 2022** are only compatible with MUI X `v5.11.0` or later.

Please update your packages if you are using an earlier version.

If this is not a viable solution for your use case, please contact sales@mui.com.
:::

### How to install the key?

```jsx
import { LicenseInfo } from '@mui/x-license-pro';

LicenseInfo.setLicenseKey('YOUR_LICENSE_KEY');
```

### Where to install the key?

You must call `setLicenseKey` before React renders the first component.
You only need to install the key **once** in your application.

### Does each developer need its own key?

No. The license key is meant to help you get compliant with the [EULA](https://mui.com/store/legal/mui-x-eula/) of the commercial licenses.
While each developer needs to be licensed, the license key is set once, where the components are used.

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

> Note that you are still allowed to use the component for [evaluation purposes](#evaluation-trial-licenses) in this case.

#### License key expired

The license key will work **forever in a production environment** with any version released before your license term ends.

However, when the term ends, you won't be licensed to access newer updates and upgrades, nor use the current or older versions in a **development environment**.
In these cases, the component will display a watermark and a console warning, stating that the license is no longer valid.

For example, if you purchase a one-year license today, you will be able to update to any version—including major versions—released in the next 12 months.
Those versions will always be available for use in a deployed application.
But you'll be required to renew your license if you need to update to a version released 18 months later or continue development with a version released in the first 12 months.

#### Invalid license key

This error indicates that your license key doesn't match what was issued by MUI—this is likely a typo.
