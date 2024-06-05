---
productId: x-date-pickers
title: Date and Time Pickers - Accessibility
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# Accessibility

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
This is the most common target for organizations so it is what we aim to support.

The WAI-ARIA Authoring Practices includes examples on [Date Picker Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/) and [Date Picker Spin Button](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/examples/datepicker-spinbuttons/) patterns, which provide valuable information on how to optimize the accessibility of these components.

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

All the available [views](/x/react-date-pickers/date-calendar/#views) implement the same basic keyboard support:

|                                                                                                                                          Keys | Description                            |
| --------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------- |
|                                                                                                                    <kbd class="key">Tab</kbd> | Moves focus to the next element        |
|                                                                                       <kbd class="key">Shift</kbd>+<kbd class="key">Tab</kbd> | Moves focus to the previous element    |
| <kbd class="key">Arrow Up</kbd>, <kbd class="key">Arrow Down</kbd>,<br> <kbd class="key">Arrow Left</kbd>, <kbd class="key">Arrow Right</kbd> | Moves focus among the available values |

In addition to the basic keyboard support above, the day view component implements its own keyboard interactions:

|                             Keys | Description                                                       |
| -------------------------------: | :---------------------------------------------------------------- |
|   <kbd class="key">Page Up</kbd> | Moves calendar to next month, keeping focus on the same day       |
| <kbd class="key">Page Down</kbd> | Moves calendar to previous month, keeping focus on the same day   |
|      <kbd class="key">Home</kbd> | Moves focus to the first day of the week within the current month |
|       <kbd class="key">End</kbd> | Moves focus to the last day of the week within the current month  |

### Date Picker

The [Date Picker](/x/react-date-pickers/date-picker/) combines the functionalities of the Date Field and Date Calendar components.

Depending on which component is in focus, the Picker will provide the corresponding keyboard support, either from [Date Field](/x/react-date-pickers/accessibility/#fields) or [Date Calendar](/x/react-date-pickers/accessibility/#date-calendar).

### Date Range Calendar

The [Date Range Calendar](/x/react-date-pickers/date-range-calendar/) implements a similar keyboard support as the day view of the [Date Calendar](/x/react-date-pickers/accessibility/#date-calendar) component, with a difference on the navigation among the previous and next months that must be achieved using the arrows in the calendar header.

|                                                                                                                                          Keys | Description                               |
| --------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------- |
| <kbd class="key">Arrow Up</kbd>, <kbd class="key">Arrow Down</kbd>,<br> <kbd class="key">Arrow Left</kbd>, <kbd class="key">Arrow Right</kbd> | Moves focus among the available values    |
|                                                                                                                <kbd class="key">Page Up</kbd> | Moves focus to the last day of the month  |
|                                                                                                              <kbd class="key">Page Down</kbd> | Moves focus to the first day of the month |
|                                                                                                                   <kbd class="key">Home</kbd> | Moves focus to first day of the week      |
|                                                                                                                    <kbd class="key">End</kbd> | Moves focus to last day of the week       |

### Date Range Picker

The [Date Range Picker](/x/react-date-pickers/date-range-picker/) keeps the focus on the field all the time and thus has the same keyboard navigation as Date Range [Field](/x/react-date-pickers/accessibility/#fields).

To ensure a more fluid and accessible user experience, Date Range Picker supports the same keyboard navigation and interactions of the [Field](/x/react-date-pickers/accessibility/#fields) components, having the changes consistently updated on the calendar component.
