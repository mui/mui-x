---
productId: x-date-pickers
title: Date and Time Pickers - Date format and localization
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# Date and Time Pickers - Accessibility

<p class="description">The Date and Time Pickers have complete accessibility support, including built-in keyboard navigation that follows international standards.</p>

## Guidelines

The most commonly encountered conformance guidelines for accessibility are:

- Globally accepted standard: [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/)
- US:
  - [ADA](https://www.ada.gov/) - US Department of Justice
  - [Section 508](https://www.section508.gov/) - US federal agencies
- Europe: [EAA](https://ec.europa.eu/social/main.jsp?catId=1202) (European Accessibility Act)

WCAG 2.1 has three levels of conformance: A, AA, and AAA.
Level AA meets the most commonly encountered conformance guidelines.
This is the most common target for organizations so what we aims to support very well.

<!-- Those examples do not cover the clock component -->
The WAI-ARIA Authoring Practices includes examples on [Date Picker Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/) and [Date Picker Spin Button](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/examples/datepicker-spinbuttons/) that provide valuable information on how to optimize the accessibility of the Date and Time Pickers.

## Keyboard support 

The Date and Time Pickers consist on different associations of Field, Calendar, Time and Digital Clock components, each of which listens for keyboard interactions from the user and emits events in response to the pressed keys.

:::info
The following key assignments apply to Windows and Linux users.

On macOS:

- replace <kbd class="key">Ctrl</kbd> with <kbd class="key">⌘ Command</kbd>
- replace <kbd class="key">Alt</kbd> with <kbd class="key">⌥ Option</kbd>

:::

### Field components

|                                                               Keys | Description                                                 |
| -----------------------------------------------------------------: | :---------------------------------------------------------- |
|                                  <kbd class="key">Arrow Left</kbd> | Moves focus among date/time sections                        |
|                                 <kbd class="key">Arrow Right</kbd> | Moves focus among date/time sections                        |
|                                    <kbd class="key">Arrow Up</kbd> | Increases focused section value by 1                        |
|                                  <kbd class="key">Arrow Down</kbd> | Decreases focused section value section by 1                |
|                                     <kbd class="key">Page Up</kbd> | Increases focused section value section by 5                |
|                                   <kbd class="key">Page Down</kbd> | Decreases focused section value section by 5                |
|                                        <kbd class="key">Home</kbd> | Sets focused section to the first value                     |
|                                         <kbd class="key">End</kbd> | Sets focused section to the last value                      |

### Calendar component

|                                                               Keys | Description                                                 |
| -----------------------------------------------------------------: | :---------------------------------------------------------- |
|                                  <kbd class="key">Arrow Left</kbd> | Moves focus among date/time sections                        |
|                                 <kbd class="key">Arrow Right</kbd> | Moves focus among date/time sections                        |
|                                    <kbd class="key">Arrow Up</kbd> | Increases focused section value by 1                        |
|                                  <kbd class="key">Arrow Down</kbd> | Decreases focused section value section by 1                |
|                                     <kbd class="key">Page Up</kbd> | Increases focused section value section by 5                |
|                                   <kbd class="key">Page Down</kbd> | Decreases focused section value section by 5                |
|                                        <kbd class="key">Home</kbd> | Sets focused section to the first value                     |
|                                         <kbd class="key">End</kbd> | Sets focused section to the last value                      |

## API

- [DateTime](/x/api/date-pickers/)