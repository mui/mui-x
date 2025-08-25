---
productId: x-charts
title: Charts - Accessibility
packageName: '@mui/x-charts'
---

# Accessibility

<p class="description">Learn how the Charts implement accessibility features and guidelines, including keyboard navigation that follows international standards.</p>

:::info
A common misconception about accessibility is to only consider blind people and the screen reader.
But there are other disability to consider, like:

- **Color blindness**, making it hard to distinguish different series, or low contrast elements.
- **Motion disability**, making it hard to open the tooltip on a given item.
- **Cognitive disability**, making it hard to focus your attention on some details.
- **Vestibular dysfunction**, making you unconformable with animations.

:::

## Guidelines

Common conformance guidelines for accessibility include:

- Globally accepted standard: [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/)
- US:
  - [ADA](https://www.ada.gov/) - US Department of Justice
  - [Section 508](https://www.section508.gov/) - US federal agencies
- Europe: [EAA](https://employment-social-affairs.ec.europa.eu/policies-and-activities/social-protection-social-inclusion/persons-disabilities/union-equality-strategy-rights-persons-disabilities-2021-2030/european-accessibility-act_en) (European Accessibility Act)

WCAG 2.1 has three levels of conformance: A, AA, and AAA.
Level AA exceeds the basic criteria for accessibility and is a common target for most organizations, so this is what we aim to support.

The WAI-ARIA Authoring Practices includes examples on [Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/).

<!-- ### Dialog considerations

Both `Desktop` and `Mobile` Date and Time Pickers are using `role="dialog"` to display their interactive view parts and thus they should follow [Modal accessibility guidelines](/material-ui/react-modal/#accessibility).
This behavior is automated as much as possible, ensuring that the Date and Time Pickers are accessible in most cases.
A correct `aria-labelledby` value is assigned to the dialog component based on the following rules:

- Use `toolbar` id if the toolbar is visible;
- Use the id of the input label if the toolbar is hidden;

:::info
Make sure to provide an `aria-labelledby` prop to `popper` and/or `mobilePaper` slots in case you are using Date and Time Pickers component with **hidden toolbar** and **without a label**.
::: -->

## Animation

Most of the charts have an animation when rendering or when data update.
For users with vestibular motion disorders those animations can be problematic.
By default we skip animation based on the [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) media feature.

<!--
## Screen reader compatibility

Date and Time Pickers use ARIA roles and robust focus management across the interactive elements to convey the necessary information to users, being optimized for use with assistive technologies.
-->

## Keyboard support

Set `enableKeyboardNavigation` to `true` to enable the keyboard navigation on your charts.
This feature is currently supported by line, bar, pie, and scatter charts.

This makes the SVG component focusable thanks to [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex).
When focused, the charts highlight a value item that can be modified with arrow navigation.

|                                                                  Keys | Description                   |
| --------------------------------------------------------------------: | :---------------------------- |
| <kbd class="key">Arrow Left</kbd>, <kbd class="key">Arrow Right</kbd> | Moves focus inside the series |
|    <kbd class="key">Arrow Up</kbd>, <kbd class="key">Arrow Down</kbd> | Move focus between series     |
