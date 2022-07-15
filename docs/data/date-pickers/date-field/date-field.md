---
title: React Date Field component
---

# Date field

<p class="description">The date field let the user select a date with the keyboard.</p>

## Basic usage

{{"demo": "BasicDateField.js"}}

## Customize the input props

{{"demo": "CustomInputDateField.js"}}

## Customize the date management props

{{"demo": "CustomDateManagementDateField.js"}}

## Headless usage

Usage with Joy

```tsx
const { inputRef, inputProps } = useDateField(props);

return (
  <TextField
    {...inputProps}
    componentsProps={{
      input: { componentsProps: { input: { ref: inputRef } } },
    }}
  />
);
```

{{"demo": "JoyDateField.js", "defaultCodeOpen": false }}
