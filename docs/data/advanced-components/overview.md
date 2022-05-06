---
title: MUI X - Overview
---

# MUI X - Overview

<p class="description">MUI X is a collection of advanced UI components for complex use cases.</p>

## Licenses

> While [MUI Core](/core/) is entirely licensed under MIT, [MUI X](/x/) serves a part of its components as MIT and the rest under a commercial license.
> You will need to purchase a license to access features that are only available with the Pro and Premium Plans.
> See [Pricing](https://mui.com/pricing/) for details.

### MIT vs. commercial

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

### Community Plan

MUI X's Community Plan is published under [MIT license](https://tldrlegal.com/license/mit-license) and [free forever](https://mui-org.notion.site/Stewardship-542a2226043d4f4a96dfb429d16cf5bd#20f609acab4441cf9346614119fbbac1).
This plan contains features we believe are sustainable by the contributions of the open-source community.

Community Plan packages:

- [`@mui/x-data-grid`](https://www.npmjs.com/package/@mui/x-data-grid)
- [`@mui/x-date-pickers`](https://www.npmjs.com/package/@mui/x-date-pickers)

### Pro Plan <span class="plan-pro"></span>

The MUI X Pro Plan expands on the limitations of the Community Plan with more advanced features such as multi-filtering, multi-sorting, column resizing and column pinning.

The Pro Plan is available under a commercial license—visit the [Pricing](https://mui.com/pricing/) page for details.
This plan contains the features that are at the limit of what the open-source model can sustain. For instance, providing a very comprehensive set of components.
The price of the plan is designed to be accessible to most professionals.

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

### Premium Plan <span class="plan-premium"></span>

The MUI X Premium Plan contains the most advanced features such as Row grouping, Excel export, Aggregation, as well as everything that's included in the Pro Plan.

The features exclusive to the Premium Plan are marked with the <span class="plan-premium"></span> icon across our documentation.
This plan contains the most advanced features, ones that we haven't seen any open-source libraries able to deliver well.

The Premium Plan is not available yet (🚧) but will soon be available under a commercial license—visit the [Pricing](https://mui.com/pricing/) page for details.

## Evaluation (trial) licenses

In accordance with our [End User License Agreement](https://mui.com/store/legal/mui-x-eula/#evaluation-trial-licenses), you can use our Pro and Premium components without a commercial license as long as they are not used for the **development** of a feature intended for production.
You do not need to contact us to use these components for evaluation purposes.

You will need to purchase a commercial license in order to remove the watermarks and console warnings.

## License key installation

When you purchase a commercial license, you'll receive a license key by email.
This key removes all watermarks and console warnings.

```jsx
import { LicenseInfo } from '@mui/x-license-pro';

LicenseInfo.setLicenseKey(
  '61628ce74db2c1b62783a6d438593bc5Tz1NVUktRG9jLEU9MTY4MzQ0NzgyMTI4NCxTPXByZW1pdW0sTE09c3Vic2NyaXB0aW9uLEtWPTI=',
);
```

### Where to install the key?

You must call `setLicenseKey` before React renders the first component.
You only need to install the key once in your application.

### Does each developer need its own key?

No. The license key is meant to help you get compliant with the [EULA](https://mui.com/store/legal/mui-x-eula/) of the commercial licenses.
While each developer needs to be licensed, the license key is set once, where the components are used.

### Security

The license key is checked without making any network requests—it's designed to be public.
In fact, it's expected for the license key to be exposed in a JavaScript bundle.
We just ask our licensed users not to publicize their license keys.

### Validation errors

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

Licenses are perpetual: the license key will work forever with the current version of the software.

But **access to updates and upgrades** is not perpetual.
An expired license key will always work with the version of the component it was licensed to cover.
But if you try to install a newer version of the component with an expired license, it will display a watermark and a console warning.
For example, if you purchase a one-year license today, you will be able to update to any version—including major versions—released in the next 12 months.
But you will not be able to install a newer version released two years from now, unless you purchase a new license to cover it.

#### Invalid license key

This error indicates that your license key doesn't match what was issued by MUI—this is likely a typo.

## Support

### GitHub

We use GitHub issues as a bug and feature request tracker. If you think you have found a bug, or have a new feature idea, please start by making sure it hasn't already been [reported or fixed](https://github.com/mui/mui-x/issues?utf8=%E2%9C%93&q=is%3Aopen+is%3Aclosed). You can search through existing issues and pull requests to see if someone has reported one similar to yours.

[Open an issue](https://github.com/mui/mui-x/issues/new/choose) in the MUI X repo.

### Stack Overflow

Visit Stack Overflow to ask questions and read crowdsourced answers from expert developers in the MUI community, as well as MUI maintainers.

[Post a question about MUI X](https://stackoverflow.com/questions/tagged/mui) on Stack Overflow.

### Professional support

When purchasing an MUI X Pro or Premium license you get access to professional support for a limited duration.
Support is available on multiple channels, but the recommended channel is GitHub issues.
You can also reach us by email at x@mui.com if you need to share private information.

- **MUI X Pro**: No SLA is provided but MUI's maintainers give these issues more attention than the ones from the Community plan. The channels:
  - GitHub: [Open a new issue](https://github.com/mui/mui-x/issues/new/choose) and leave your Order ID.
  - Email (only to share private information): [Open a new issue](https://support.mui.com/hc/en-us/requests/new?tf_360023797420=mui_x) or send an email at x@mui.com.
- **MUI X Premium**: Same as MUI X Pro, but with priority over Pro, and a 48 hour SLA for the first answer.
  - GitHub: this plan is not available yet
  - Emails: this plan is not available yet
- **MUI X Premium Priority**: Same as MUI X Premium but with a 24 hours SLA for the first answer.
  - GitHub: this plan is not available yet
  - Emails: this plan is not available yet

## Roadmap

To learn more about our plans and goals for the MUI X product line, visit our [public roadmap](https://github.com/mui/mui-x/projects/1).

> ⚠️ **Disclaimer**: We operate in a dynamic environment, and things are subject to change.
> The information provided is intended to outline the general framework direction, for informational purposes only.
> We may decide to add or remove new items at any time, depending on our capability to deliver while meeting our quality standards.
> The development, releases, and timing of any features or functionality remains at the sole discretion of MUI.
> The roadmap does not represent a commitment, obligation, or promise to deliver at any time.
