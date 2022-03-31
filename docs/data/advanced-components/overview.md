---
title: MUI X - Overview
---

# MUI X - Overview

<p class="description">MUI X is a collection of advanced UI components for complex use cases.</p>

## Licenses

While MUI Core is entirely licensed under MIT, MUI X serves a part of its components under a commercial license.
Please pay attention to the license.

### Community Plan

MUI X's Community Plan is published under [MIT license](https://tldrlegal.com/license/mit-license) and [free forever](https://mui-org.notion.site/Stewardship-542a2226043d4f4a96dfb429d16cf5bd).

Community Plan packages:

- [`@mui/x-data-grid`](https://www.npmjs.com/package/@mui/x-data-grid)
- [`@mui/x-date-pickers`](https://www.npmjs.com/package/@mui/x-date-pickers)

### Pro Plan

This plan contains the features that are at the limit of what the open-source model can sustain. From a price perspective, the plan is designed to be accessible to most professionals.

See [Pricing](https://mui.com/store/items/material-ui-pro/) for details on purchasing licenses.

Pro Plan packages:

- [`@mui/x-data-grid-pro`](https://www.npmjs.com/package/@mui/x-data-grid-pro)
- [`@mui/x-date-pickers-pro`](https://www.npmjs.com/package/@mui/x-date-pickers-pro)

The features exclusives to the **Pro** Plan are marked with the <span class="plan-pro"></span> icon across our documentation.

<div class="only-light-mode">
  <img src="/static/x/commercial-header-icon-light.png" style="width: 579px; margin-bottom: 2rem;" alt="">
</div>
<div class="only-dark-mode">
  <img src="/static/x/commercial-header-icon-dark.png" style="width: 560px; margin-bottom: 2rem;" alt="">
</div>

### 🚧 Premium Plan

This plan contains the most advanced features.

The features exclusives to the **Premium** Plan are marked with the <span class="plan-premium"></span> icon across our documentation.
The **Premium** Plan also contains all the features of the **Pro** Plan

## MIT vs. commercial

_How do we decide if a feature is MIT or commercial?_

We have been building MIT React components since 2014,
and have learned much about the strengths and weaknesses of the MIT license model.
The health of this model is improving every day. As the community grows, it increases the probability that developers contribute improvements to the project.
However, we believe that we have reached the sustainability limits of what the model can support for advancing our mission forward. We have seen too many MIT licensed components moving slowly or getting abandoned. The community isn't contributing improvements as fast as the problems deserved to be solved.

We are using a commercial license to forward the development of the most advanced features, where the MIT model can't sustain it.
A solution to a problem should only be commercial if it has no MIT alternatives.

For each set of component, you can check the feature comparison table:

- [Data Grid](/x/react-data-grid/getting-started/#feature-comparison)

## Evaluation (trial) licenses

You are [free to install](https://mui.com/store/legal/mui-x-eula/#evaluation-trial-licenses) and try our **Pro** / **Premium** components as long as it is not used for the development of a feature intended for production.
Please take the component for a test run, no need to contact us.

## License key

For commercially licensed software, a license key is provided.
This removes the watermark and console warning when valid.
This license key is meant as a reminder for developers and their team to know when they forgot to license the software or renew the license.

### License key installation

Once you purchase a license, you'll receive a license key by email.
This key should be installed to remove the watermark and
console warnings.
You must set the license key before rendering the first component.
You only need to install the key once in your application.

```jsx
import { LicenseInfo } from '@mui/x-license-pro';

LicenseInfo.setLicenseKey(
  'x0jTPl0USVkVZV0SsMjM1kDNyADM5cjM2ETPZJVSQhVRsIDN0YTM6IVREJ1T0b9586ef25c9853decfa7709eee27a1e',
);
```

### Security

The check of the license key is done without making any network requests.

The license key is designed to be public, the only thing we ask of licensed users is to not proactively publicize their license key.
Exposing the license key in a JavaScript bundle is expected.

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

The licenses are perpetual, the license key will work forever with the current version of the software.

However, **access to updates/upgrades** is not perpetual.
Installing a version of the component released after the license key has expired will trigger a watermark and console message.
For example, if you purchase a one-year license today, you are not licensed to install a version released two years in the future, but you can optionally update to any version, including major versions, if it's released in the next 12 months.

#### Invalid license key

The license key you have installed is not as issued by MUI.

## Support

### GitHub

We use GitHub issues as a bug and feature request tracker. If you think you have found a bug, or have a new feature idea, please start by making sure it hasn't already been [reported or fixed](https://github.com/mui/mui-x/issues?utf8=%E2%9C%93&q=is%3Aopen+is%3Aclosed). You can search through existing issues and pull requests to see if someone has reported one similar to yours.

[Open an issue](https://github.com/mui/mui-x/issues/new/choose)

### StackOverflow

For crowdsourced answers from expert MUI developers in our community.
StackOverflow is also visited from time to time by the maintainers of MUI.

[Post a question](https://stackoverflow.com/questions/tagged/mui)

### Professional support

When purchasing an MUI X Pro or Premium license you get access to professional support for a limited duration.
Support is available on multiple channels, but the recommended channel is GitHub issues.
If you need to share private information, you can also use email.

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

Here is [the public roadmap](https://github.com/mui/mui-x/projects/1).
It's organized by quarter.

> ⚠️ **Disclaimer**: We operate in a dynamic environment, and things are subject to change.
> The information provided is intended to outline the general framework direction, for informational purposes only.
> We may decide to add or remove new items at any time, depending on our capability to deliver while meeting our quality standards.
> The development, releases, and timing of any features or functionality remains at the sole discretion of MUI.
> The roadmap does not represent a commitment, obligation, or promise to deliver at any time.
