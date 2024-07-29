---
productId: x-date-pickers
title: Date and Time Pickers - Accessibility
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# Accessibility

<p class="description">Learn how the Date and Time Pickers implement accessibility features and guidelines, including keyboard navigation that follows international standards.</p>

## Guidelines

Common conformance guidelines for accessibility include:

- Globally accepted standard: [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/)
- US:
  - [ADA](https://www.ada.gov/) - US Department of Justice
  - [Section 508](https://www.section508.gov/) - US federal agencies
- Europe: [EAA](https://ec.europa.eu/social/main.jsp?catId=1202) (European Accessibility Act)

WCAG 2.1 has three levels of conformance: A, AA, and AAA.
Level AA exceeds the basic criteria for accessibility and is a common target for most organizations, so this is what we aim to support.

The WAI-ARIA Authoring Practices includes examples on [Date Picker Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/) and [Date Picker Spin Button](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/examples/datepicker-spinbuttons/) patterns, which provide valuable information on how to optimize the accessibility of these components.

### Dialog considerations

Both `Desktop` and `Mobile` Date and Time Pickers are using `role="dialog"` to display their interactive view parts and thus they should follow [Modal accessibility guidelines](/material-ui/react-modal/#accessibility).
This behavior is automated as much as possible, ensuring that the Date and Time Pickers are accessible in most cases.
A correct `aria-labelledby` value is assigned to the dialog component based on the following rules:

- Use `toolbar` id if the toolbar is visible;
- Use the id of the input label if the toolbar is hidden;

:::info
Make sure to provide an `aria-labelledby` prop to `popper` and/or `mobilePaper` slots in case you are using Date and Time Pickers component with **hidden toolbar** and **without a label**.
:::

## Screen reader compatibility

Date and Time Pickers use ARIA roles and robust focus management across the interactive elements to convey the necessary information to users, being optimized for use with assistive technologies.

## Keyboard support

The Date and Time Pickers consist of different associations of Field, Calendar, and Clock components.
Each of these components is designed to respond intuitively to keyboard interactions, providing extensive keyboard navigation support.

### Fields

The following table describes the keyboard support for all [field components](/x/react-date-pickers/fields/):

|                                                                  Keys | Description                                  |
| --------------------------------------------------------------------: | :------------------------------------------- |
| <kbd class="key">Arrow Left</kbd>, <kbd class="key">Arrow Right</kbd> | Moves focus among date/time sections         |
|                                       <kbd class="key">Arrow Up</kbd> | Increases focused section value by 1         |
|                                     <kbd class="key">Arrow Down</kbd> | Decreases focused section value section by 1 |
|                                        <kbd class="key">Page Up</kbd> | Increases focused section value section by 5 |
|                                      <kbd class="key">Page Down</kbd> | Decreases focused section value section by 5 |
|                                           <kbd class="key">Home</kbd> | Sets focused section to the minimal value    |
|                                            <kbd class="key">End</kbd> | Sets focused section to the maximal value    |

### Date Calendar

Among the [available view components](https://mui.com/x/react-date-pickers/date-calendar/#views), `day` is the only one that implements specific keyboard support:

|                             Keys | Description                                                     |
| -------------------------------: | :-------------------------------------------------------------- |
|   <kbd class="key">Page Up</kbd> | Moves calendar to next month, keeping focus on the same day     |
| <kbd class="key">Page Down</kbd> | Moves calendar to previous month, keeping focus on the same day |
|      <kbd class="key">Home</kbd> | Moves focus to the first day of the week                        |
|       <kbd class="key">End</kbd> | Moves focus to the last day of the week                         |

### Date Picker

The [Date Picker](/x/react-date-pickers/date-picker/) combines the functionalities of the Date Field and Date Calendar components.

Depending on which component is in focus, the Picker will provide the corresponding keyboard support, either from [Date Field](/x/react-date-pickers/accessibility/#fields) or [Date Calendar](/x/react-date-pickers/accessibility/#date-calendar).

### Date Range Calendar

The [Date Range Calendar](/x/react-date-pickers/date-range-calendar/) implements a similar keyboard support as the day view of the [Date Calendar](/x/react-date-pickers/accessibility/#date-calendar) component, with a difference on the navigation among the previous and next months that must be achieved using the arrows in the calendar header.

|                                                                                                                                          Keys | Description                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------ |
| <kbd class="key">Arrow Up</kbd>, <kbd class="key">Arrow Down</kbd>,<br> <kbd class="key">Arrow Left</kbd>, <kbd class="key">Arrow Right</kbd> | Moves focus among the available values                        |
|                                                                                                                <kbd class="key">Page Up</kbd> | Moves focus to the last day of the month                      |
|                                                                                                              <kbd class="key">Page Down</kbd> | Moves focus to the first day of the month                     |
|                                                                                                                   <kbd class="key">Home</kbd> | Moves focus to first day of the week within the current month |
|                                                                                                                    <kbd class="key">End</kbd> | Moves focus to last day of the week within the current month  |

### Date Range Picker

When interacting with the keyboard, the [Date Range Picker](/x/react-date-pickers/date-range-picker/) keeps the focus on the Field component, thereby offering the same keyboard navigation support as the [Date Range Field](/x/react-date-pickers/accessibility/#fields), having the changes consistently updated on the calendar component.
