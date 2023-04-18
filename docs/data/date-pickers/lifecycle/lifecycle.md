---
product: date-pickers
title: Components lifecycle
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# Components lifecycle

<p class="description">This page explains when callbacks like `onChange`, `onAccept`, `onOpen` or `onClose` are called.</p>

## Fields lifecycle

### When is `onChange` called ?

#### On simple fields

:::info
The information below are applicable on standalone fields (when rendering `<DateField />`),
but also on pickers for the field editing (when rendering `<DatePicker />` and using the input to edit the value).
:::

The field components have an internal state to update the visible value.

It will only call the `onChange` callback when:

- the user fills one section of an empty input. The value equals `Invalid date`.
- the user completes all sections of an input. The value reflects the input.
- the user cleans one section of a completed input. The value equals `Invalid date`.
- the user cleans all sections of an input. The value equals `null`.

In the example below, `onChange` will be called when any of the conditions are triggered:

{{"demo": "LifeCycleDateFieldEmpty.js", "defaultCodeOpen": false}}

#### On range fields [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

On range fields (`SingleInputDateRangeField` / `MultiInputDateRangeField` / ... ),
`onChange` will be called if the date you are modifying is matching one of the condition above,
even if the other date does not.

In the example below, changing the value of the start date section will call `onChange` even if the end date is empty or partially filled.

{{"demo": "LifeCycleDateRangeField.js", "defaultCodeOpen": false}}

## Pickers lifecycle

### When is `onClose` called ?

#### When the last view is completed and `closeOnSelect={true}`

The `closeOnSelect` prop determines if the picker should close one the last view is completed.
By default, it is set to `true` on desktop and `false` on mobile.

Here are a few examples:

:::info
The example below are using the desktop and mobile variant of the pickers, but the behavior is exactly the same when using the responsive variant (`DatePicker`, `TimePicker`, ...) on mobile or on desktop.
:::

- ```tsx
  <DesktopDatePicker />
  ```

  - Default `views` prop: `['year', 'month', 'day']`
  - Default `closeOnSelect` prop: `true`

  **Behavior:** The picker will automatically close when selecting the day.

- ```tsx
  <DesktopDatePicker closeOnSelect={false} />
  ```

  - Default `views` prop: `['year', 'month', 'day']`
  - Explicit `closeOnSelect` prop: `false`

  **Behavior:** The picker never close when selecting a value.

  :::warning
  If you want to set `closeOnSelect` to `false` on a desktop picker, you should probably also enable the action bar to allow user to validate the value:

  ```tsx
  <DesktopDatePicker
    closeOnSelect={false}
    slotProps={{ actionBar: { actions: ['cancel', 'accept'] } }}
  />
  ```

  :::

- ```tsx
  <DesktopDatePicker views={['day', 'month', 'year']} />
  ```

  - Explicit `views` prop: `['day', 'month', 'year']`
  - Default `closeOnSelect` prop: `true`

  **Behavior:** The picker will automatically close when selecting the year

- ```tsx
  <DesktopTimePicker />
  ```

  - Default `views` prop: `['hours', 'minutes']`
  - Default `closeOnSelect` prop: `true`

  **Behavior:** The picker will automatically close when selecting the minutes

:::info
You don't have to fill all the views for the picker to close automatically.
For example, on the `DatePicker`, the `year` and `month` views are not in the default workflow since they are before the opening view (`day`),
so the picker will close even if you never went to those views.
:::

#### When the picker is manually closed

Pressing <kbd class="key">Escape</kbd> or clicking outside the picker will close the picker.

#### When a value is picked using the action bar

Clicking on any built-in button of the action bar will close the picker.

### When is `onChange` called ?

#### When the field used calls `onChange`

When editing your value through the input(s) of your field, the picker will just re-publish the `onChange` event.
Take a look at the [dedicated section](/x/react-date-pickers/lifecycle/#when-is-onchange-called-on-fields) for more information.

#### When the picker closes automatically

On mobile, the picker will not automatically close, you have to manually close it using the [action bar buttons](/x/)

#### When a view is completed

#### When a value is picked using the action bar

If the component is controlled (i.e: if it has a `value` prop),
clicking on any built-in actions will call `onChange` if the newly published value is different from the current value.

If the component is not controlled, clicking on the _Cancel_ button will call `onChange` if the newly published value is different from the current value.
For the other built-in actions, `onChange` will be called if the newly published value is different from the last published value or if no value has ever be published.

### When is `onAccept` called ?

#### When the picker closes automatically

#### When the picker is manually closed

When the user presses <kbd class="key">Escape</kbd> or clicks outside the picker, we call `onAccept` with the last

- if the last view has been completed, we call `onAccept` with the current value.
- if the last view has not been completed, we call `onAccept` with the last validated value

#### When a value is validated using the action bar

## Only update when the value is valid

The `onChange` callback received a 2nd parameter containing the validation error associated to the current value.
If you only want to update your state when the value is valid, you can ignore any `onChange` call with a non-null `validationError`.

In the example below, `onChange` will only be called if the date is valid and its year is 2022:

{{"demo": "LifeCycleIgnoreInvalidValue.js"}}

## Server interaction

If the selected value is used to interact with the server, you might want to avoid sending all the intermediate states.

Especially if the user is setting the date using the arrow interaction.

In such a case, the recommended UI is to add a button for validating the form.
If for some reason, you need to send the data to the server without having the user pressing a validation button, you can debouce the `onChange` as follow.

In the following demo, `<DateField />` is extended adding an `onAccept` prop which is a debounced version of the `onChange`.

{{"demo": "ServerInteraction.js"}}

:::info
Most of the pickers have an `onAccept` prop.
This prop does concern only views and not fields.

It will be called only if the user presses the "accept" button, or if they finish the selection and the view is closing.
:::
