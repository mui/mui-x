---
productId: x-date-pickers
title: Components lifecycle
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# Components lifecycle

<p class="description">This page explains when the onChange, onAccept, and onClose callbacks are called.</p>

## Lifecycle on simple fields

:::info
The information below is applicable to standalone fields (when rendering `<DateField />`),
as well as to pickers for field editing (when rendering `<DatePicker />` and using the input to edit the value).
:::

The field components have an internal state controlling the visible value.

It will only call the `onChange` callback when:

- the user fills one section of an empty field. The value equals `Invalid date`.
- the user completes all sections of a field. The value reflects the field.
- the user cleans one section of a completed field. The value equals `Invalid date`.
- the user cleans all sections of a field. The value equals `null`.

The example below shows the last value received by `onChange`.

{{"demo": "LifeCycleDateFieldEmpty.js", "defaultCodeOpen": false}}

## Lifecycle on range fields [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

On range fields (`SingleInputDateRangeField` / `MultiInputDateRangeField` / ... ),
`onChange` is called if the date you are modifying is matching one of the conditions above,
regardless of the other date state.

The example below shows the last value received by `onChange`.
Note how changing the value of the start date section will call `onChange` even if the end date is empty or partially filled.

{{"demo": "LifeCycleDateRangeField.js", "defaultCodeOpen": false}}

## Lifecycle on pickers: "onClose"

### When is "onClose" called?

:::info
In all the below scenarios, the picker closes when `onClose` is called, except if you are controlling the `open` prop.
:::

#### When the last view is completed

When a selection in the last view is made, `onClose` will be called only if the `closeOnSelect` prop is equal to `true`.
By default, it is set to `true` on desktop and `false` on mobile.

Here are a few examples:

:::info
The examples below are using the desktop and mobile variants of the pickers, but the behavior is exactly the same when using the responsive variant (`DatePicker`, `TimePicker`, ...) on a mobile or desktop environment.
:::

- ```tsx
  <DesktopDatePicker />
  ```

  - Default `views` prop: `['year', 'day']`
  - Default `closeOnSelect` prop: `true`

  **Behavior:** The picker will close when selecting the day.

- ```tsx
  <DesktopDatePicker closeOnSelect={false} />
  ```

  - Default `views` prop: `['year', 'day']`
  - Explicit `closeOnSelect` prop: `false`

  **Behavior:** The picker won't close when selecting a day. The user will have to click on the _OK_ action to close it.

  :::success
  If you want to set `closeOnSelect` to `false` on a desktop picker, you should consider enabling the action bar to allow the user to validate the value:

  ```tsx
  <DesktopDatePicker
    closeOnSelect={false}
    slotProps={{ actionBar: { actions: ['cancel', 'accept'] } }}
  />
  ```

  :::

- ```tsx
  <MobileDatePicker />
  ```

  - Default `views` prop: `['year', 'day']`
  - Default `closeOnSelect` prop: `false`

  **Behavior:** The picker won't close when selecting a day. The user will have to click on the _OK_ action to close it.

- ```tsx
  <DesktopDatePicker views={['day', 'month', 'year']} />
  ```

  - Explicit `views` prop: `['day', 'month', 'year']`
  - Default `closeOnSelect` prop: `true`

  **Behavior:** The picker will close when selecting the year.

- ```tsx
  <DesktopTimePicker />
  ```

  - Default `views` prop: `['hours', 'minutes']` (plus a `meridiem` view if the locale is in 12-hours format)
  - Default `closeOnSelect` prop: `true`

  **Behavior:** The picker will close when selecting the minutes or meridiem (if a 12-hour clock is used).

:::info
You don't have to fill all the views for the picker to close automatically.
For example, on the `DatePicker`, the `year` and `month` views are not in the default workflow since they are before the opening view (`day`),
so the picker will close even if you never went to those views.
:::

#### When the picker is manually closed

Pressing <kbd class="key">Escape</kbd> or clicking outside the picker will close the picker.

#### When a value is selected using the action bar

Clicking on any built-in button of the action bar will close the picker.

#### When a shortcut is picked

Clicking on a shortcut will close the picker, except if the `changeImportance` property has been set to `"set"` instead of the default value `"accept"`.
You can find more information [in the dedicated doc section](/x/react-date-pickers/shortcuts/#behavior-when-selecting-a-shortcut).

## Lifecycle on pickers: "onChange"

### Usage

The `onChange` callback is called whenever the current value changes.

If you don't want to listen to the intermediary steps, consider using the [`onAccept` prop](/x/react-date-pickers/lifecycle/#lifecycle-on-pickers-quot-onaccept-quot) instead.

```tsx
<DatePicker onChange={(value) => setValue(value)} />
```

:::success
You can use the second argument passed to the `onChange` callback to get the validation error associated with the current value:

```tsx
<DatePicker
  onChange={(newValue, context) => {
    setValue(value);
    if (context.validationError == null) {
      runSomeLogic();
    }
  }}
/>
```

:::

### When is "onChange" called?

#### When the field calls "onChange"

When editing your value through the input(s) of your field, the picker will just re-publish the `onChange` callback.
Take a look at the [dedicated section](/x/react-date-pickers/lifecycle/#lifecycle-on-simple-fields) for more information.

#### When the user interacts with the view

If the component is controlled (i.e: if it has a `value` prop),
clicking on a value will call `onChange` if the value to publish is different from the current value
(e.g: clicking on the already selected day in the `day` view will not call `onChange`).

If the component is not controlled, the behavior is the same, except if no value has ever been published, in which case clicking on the current value will fire `onChange`
(e.g: clicking on the already selected day in the `day` view will call `onChange` if `onChange` has never been called before).

Some views can decide not to call `onChange` for some value modifications.
The most common example is the mobile time views (using the [`TimeClock`](/x/react-date-pickers/time-clock/) component).
The `onChange` is only fired once when the dragging (touching) of the clock hand ends even though the UI updates on each position change.

#### When a value is selected using the action bar

If the component is controlled (i.e: if it has a `value` prop),
clicking on any built-in actions will call `onChange` if the value to publish is different from the current value.

If the component is not controlled, the behavior is the same, except for the _Clear_, _Today_, and _OK_ actions that will call `onChange` if no value has ever been published, even if the current value equals the value to publish.

#### When a shortcut is picked

Clicking on a shortcut will call `onChange`.
You can find more information [in the dedicated doc section](/x/react-date-pickers/shortcuts/#behavior-when-selecting-a-shortcut).

## Lifecycle on pickers: "onAccept"

### Usage

The `onAccept` callback allows you to get the final value selected by the user without caring about the intermediary steps.

```tsx
<DatePicker onAccept={(value) => sendValueToServer(value)} />
```

:::success
You can use the second argument passed to the `onAccept` callback to get the validation error associated with the current value:

```tsx
<DatePicker
  onAccept={(newValue, context) => {
    if (context.validationError == null) {
      runSomeLogic();
    }
  }}
/>
```

:::

### When is "onAccept" called?

#### When the last view is completed

When a selection in the last view is made, `onAccept` will be called only if the `closeOnSelect` prop is equal to `true` and the value has been modified since the last time `onAccept` was called.
By default, `closeOnSelect`, is set to `true` on desktop and `false` on mobile.

Here are a few examples:

:::info
The examples below are using the desktop and mobile variants of the pickers, but the behavior is exactly the same when using the responsive variant (`DatePicker`, `TimePicker`, ...) on a mobile or desktop environment.
:::

- ```tsx
  <DesktopDatePicker />
  ```

  - Default `views` prop: `['year', 'day']`
  - Default `closeOnSelect` prop: `true`

  **Behavior:** The picker will call `onAccept` when selecting the day.

- ```tsx
  <DesktopDatePicker closeOnSelect={false} />
  ```

  - Default `views` prop: `['year', 'day']`
  - Explicit `closeOnSelect` prop: `false`

  **Behavior:** The picker won't call `onAccept` when selecting a value.

  :::success
  If you want to set `closeOnSelect` to `false` on a desktop picker, you should consider enabling the action bar to allow the user to validate the value:

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

  **Behavior:** The picker will call `onAccept` when selecting the year.

- ```tsx
  <DesktopTimePicker />
  ```

  - Default `views` prop: `['hours', 'minutes']` (plus a `meridiem` view if the locale is in 12-hours format)
  - Default `closeOnSelect` prop: `true`

  **Behavior:** The picker will call `onAccept` when selecting the minutes or meridiem (if a 12-hour clock is used).

#### When the picker is manually closed

When the user presses <kbd class="key">Escape</kbd> or clicks outside the picker, `onAccept` is called with:

- the current value, if the last view has been completed
- the last accepted value, if the last view has not been completed

#### When a value is selected using the action bar

If the component is controlled (i.e: if it has a `value` prop),
clicking on any built-in actions will call `onAccept` if the value to publish is different from the current value.

If the component is not controlled, the behavior is the same, except for the _Clear_, _Today_, and _OK_ actions that will call `onAccept` if no value has ever been published, even if the current value equals the value to publish.

#### When a shortcut is picked

Clicking on a shortcut will call `onAccept`, except if the `changeImportance` property has been set to `"set"` instead of `"accept"`.
You can find more information [in the dedicated doc section](/x/react-date-pickers/shortcuts/#behavior-when-selecting-a-shortcut).

## Classic scenarios

### "DatePicker" on desktop

#### Controlled "DesktopDatePicker": basic usage

```tsx
<DesktopDatePicker value={value} onChange={(newValue) => setValue(newValue)} />
```

**Action n°1:** Opening the picker

- Opens the picker on the `day` view

**Action n°2:** Clicking on a day

- Fires `onClose` (and closes the picker if the `open` prop is not controlled)
- Fires `onChange` with the selected day (keeps the time of the previous value)
- Fires `onAccept` with the selected day (keeps the time of the previous value)

#### Controlled "DesktopDatePicker": picking year, month and day

```tsx
<DesktopDatePicker
  value={value}
  onChange={(newValue) => setValue(newValue)}
  views={['year', 'month', 'day']}
/>
```

**Action n°1:** Opening the picker

- Opens the picker on the `day` view

**Action n°2:** Switch to the `year` view on the header

**Action n°3:** Clicking on a year

- Fires `onChange` with the selected year (keeps the month, date and time of the previous value)
- Moves to the `month` view

**Action n°4:** Clicking on a month

- Fires `onChange` with the selected month (keeps the date and time of the previous value)
- Moves to the `day` view

**Action n°4:** Clicking on a day

- Fires `onClose` (and closes the picker if the `open` prop is not controlled)
- Fires `onChange` with the selected day (keeps the time of the previous value)
- Fires `onAccept` with the selected day (keeps the time of the previous value)

### "DatePicker" on mobile

#### Controlled "MobileDatePicker": basic usage

```tsx
<MobileDatePicker value={value} onChange={(newValue) => setValue(newValue)} />
```

**Action n°1:** Opening the picker

- Opens the picker on the `day` view

**Action n°2:** Clicking on a day

- Fires `onChange` with the selected day (keeps the time of the previous value)

**Action n°3:** Clicking on the _OK_ action

- Fires `onClose` (and closes the picker if the `open` prop is not controlled)
- Fires `onAccept` with the selected day (keeps the time of the previous value)

## Only update for valid values

The `onChange` callback receives a 2nd parameter (context object) containing the validation error associated with the current value.
If you want to update your state only when the value is valid, you can ignore any `onChange` call with a non-null `validationError`.

In the example below, `onChange` will only be called if the date is valid and its year is 2022:

{{"demo": "LifeCycleIgnoreInvalidValue.js"}}

## Server interaction

If the selected value is used to interact with the server, you might want to avoid sending all the intermediate states.

Especially if the user is setting the date using the keyboard arrow interaction.

In such a case, the recommended UI is to add a button for validating the form.
If for some reason, you need to send the data to the server without having the user pressing a validation button, you can debounce the `onChange` as follows.

The following demo shows how to extend the Date Field component by adding an `onAccept` prop, which is a debounced version of `onChange`.
You can find more information about the `onAccept` prop [in the dedicated doc section](/x/react-date-pickers/lifecycle/#lifecycle-on-pickers-quot-onaccept-quot).

{{"demo": "ServerInteraction.js"}}
