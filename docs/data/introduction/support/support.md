# Support

<p class="description">Learn how to get support for MUI X components, including feature requests, bug fixes, and technical support from the team.</p>

## GitHub

We use GitHub issues as a bug and feature request tracker.

If you think you've found a bug, or you have a new feature idea:

1. Please start by [making sure it hasn't already been reported or fixed](https://github.com/mui/mui-x/issues?q=is%3Aissue).
   You can search through existing issues and pull requests to see if someone has reported one similar to yours.
2. Then, if no duplicates exist, [open an issue](https://github.com/mui/mui-x/issues/new/choose) in the MUI X repository.

### New issue guidelines

- Please follow one the issue templates provided on GitHub.
- Please begin the title with "[component-name]" (if relevant), and use a succinct description that helps others find similar issues.
  - ❌ _"It doesn't work"_
  - ✅ _"[button] Add support for {{new feature}}"_
- Please don't group multiple topics in one issue.
- Please don't comment "+1" on an issue. It spams the maintainers and doesn't help move the issue forward. Use GitHub reactions instead (👍).

### Bug reproductions

We require bug reports to be accompanied by a **minimal reproduction**.
It significantly increases the odds of fixing the problem.
You have a few possible options to provide it:

#### Use the live editors

You can browse the documentation, find an example close to your use case, and then open it in a live editor:

<a href="/x/react-date-pickers/quickstart/#render-the-component">
<span class="only-light-mode">
<img src="/static/docs-infra/forking-an-example.png" alt="Forking an example" loading="lazy" width="1628" height="700" style="display: block; max-width: 774px;">
</span>
<span class="only-dark-mode">
<img src="/static/docs-infra/forking-an-example-dark.png" alt="Forking an example" loading="lazy" width="1628" height="700" style="display: block; max-width: 774px;">
</span>
</a>

- [Data Grid](/x/react-data-grid/#community-version-free-forever)
- [Date Pickers](/x/react-date-pickers/quickstart/#render-the-component)
- [Charts](/x/react-charts/quickstart/#self-contained-charts)
- [Tree View](/x/react-tree-view/)

#### Use starter templates

You can use a starter template to build a reproduction case with:

<!-- #target-branch-reference -->
<!-- Replace `master` with the new branch `vX.x` when creating the first PR on the vX.x branch -->
<!-- For example, when creating v9 from v8, `master -> v8.x` -->

- A minimal Data Grid [TypeScript template](https://stackblitz.com/github/mui/mui-x/tree/master/bug-reproductions/x-data-grid?file=src/index.tsx)
- A plain React [JavaScript](https://stackblitz.com/github/stackblitz/starters/tree/main/react) or [TypeScript](https://stackblitz.com/github/stackblitz/starters/tree/main/react-ts) template

## Stack Overflow

We use Stack Overflow for how-to questions. Answers are crowdsourced from expert developers in the MUI X community as well as MUI X maintainers.

You can search through existing questions and answers to see if someone has asked a similar question using one of these tags:

- [mui-x-data-grid](https://stackoverflow.com/questions/tagged/mui-x-data-grid)
- [mui-x-date-picker](https://stackoverflow.com/questions/tagged/mui-x-date-picker)
- [mui-x-charts](https://stackoverflow.com/questions/tagged/mui-x-charts)
- [mui-x-tree-view](https://stackoverflow.com/questions/tagged/mui-x-tree-view)

If you cannot find your answer, [ask a new question](https://stackoverflow.com/questions/ask?tags=reactjs) using the relevant tags.

## Technical support

MUI offers two support plans, Standard(free) and Priority(paid).

### Standard Support

When purchasing a MUI X Pro or Premium license you get access to free technical support until the end of your active license.

### Priority Support [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

Priority Support is an add-on service for Premium plan users.
With priority support you get expedited assistance and troubleshooting for your critical applications.

#### Why teams choose Priority Support

Priority Support is tailored for enterprise teams who rely on the MUI ecosystem at scale and want faster turnaround on bug reports, closer collaboration on issue triaging, and coverage across the entire component library.

In addition to the MUI X components, Priority Support covers the entire MUI ecosystem, including:

- The entire MUI X suite: Data Grid, Date and Time Pickers, Tree View, and Charts
- Material UI
- Base UI
- MUI System
- Pigment CSS
- Joy UI

#### Service-level agreement (SLA)

Priority Support is governed by a service-level agreement (SLA) that ensures:

- **24-hour response times**: Priority Support requests receive an initial response within one business day.
- **Four-hour pre-screenings**: Priority requests undergo a review of up to four hours to validate and reproduce the issues.
- **Issue escalation**: Critical issues are escalated to senior engineers for focused attention and prompt resolutions.

For complete details, see our [SLA for technical support](https://mui.com/legal/technical-support-sla/).

#### How to purchase Priority Support

Priority Support is available as an add-on for Premium users and can be purchased from the [pricing page](https://mui.com/pricing/).
Community and Pro users must upgrade to a Premium license to purchase Priority Support.

### How to request technical support

Support is available on multiple channels, but the recommended channels are:

- GitHub: You can [open a new issue](https://github.com/mui/mui-x/issues/new/choose) and leave your Order ID (or Support key), so we can prioritize accordingly. In case of Priority Support:
  - Create a new issue using the **Priority Support: SLA ⏰** template—this ensures it will include the necessary labels to trigger our automated process.
  - After you've created the issue, a GitHub action will prompt you to follow an external link to validate your support key (which was issued to you upon purchase).
  - Once your support key is validated, the action comment will update to confirm that your SLA is now in effect, and the issue labels will update accordingly to alert our team to review your request as soon as possible.

- Email: If you need to share **private information** you can [submit a request](https://support.mui.com/hc/en-us/requests/new?tf_360023797420=mui_x) or send an email to [x@mui.com](mailto:x@mui.com).

Including your Order ID (or Support key) in the issue helps us prioritize the issues based on the following support levels:

1. MUI X Priority Support: Provides a 24h SLA for the first answer.
2. MUI X Premium: The same as MUI X Pro, but with higher priority. There is no SLA.
3. MUI X Pro: maintainers give these issues more attention than the ones from the community.
4. Community license

## Long-term support (LTS)

Bug fixes, performance enhancements, and other improvements are delivered in new releases.
However, we remain committed to providing security updates and addressing regressions for **two years** after a version enters LTS.

This includes issues introduced by external sources, like browser upgrades or changes to upstream dependencies.

### Supported versions

| MUI X version | Release    | Supported                                                                       |
| ------------: | :--------- | :------------------------------------------------------------------------------ |
|        ^9.0.0 | March 2026 | 🚧 Pre release (Continuous support)                                             |
|        ^8.0.0 | 2025-04-17 | ✅ Current stable major (Continuous support).                                   |
|        ^7.0.0 | 2024-03-23 | ⚠️ LTS - Support for security issues and regressions **until April 17th 2027**. |
|        ^6.0.0 | 2023-03-03 | ⚠️ LTS - Support for security issues and regressions **until March 23th 2026**. |
|        ^5.0.0 | 2021-11-23 | ❌                                                                              |
|        ^4.0.0 | 2021-09-28 | ❌                                                                              |

## Community

### Social media

The MUI X community is active on both [X/Twitter](https://x.com/MUI_hq) and [LinkedIn](https://www.linkedin.com/company/mui/).
These are great platforms to share what you're working on and connect with other developers.

### Discord

We have a [Discord Server](https://mui.com/r/discord/) to bring the MUI X community together.
Our tools are used by thousands of developers and teams all around the world, many of whom actively engage with the community.

You can join Discord to engage in lively discussions, share your projects, and interact with developers just like you from all around the world. We'd love for you to join us!

:::warning
How-to questions are not accepted on Discord, they should be asked on [Stack Overflow](#stack-overflow).
:::

## Custom work

If your team gets stuck and needs help getting unblocked, MUI X's engineers may be available on a contract basis.

Keep in mind that the work must be directly related to MUI X's products—we don't accept general web development or React work.

Our contracting price starts at $200/hour or $1,500/day.

[Send us an email](mailto:custom-work@mui.com) summarizing of your needs, and we'll let you know whether we can help (or else try to suggest alternatives).
