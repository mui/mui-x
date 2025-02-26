---
productId: x-date-pickers
title: React Calendar component
packageName: '@mui/x-date-pickers'
---

# Date Calendar

<p class="description">POC of a Clock component using the Base UI DX.</p>

## Anatomy

```tsx
<Clock.Root>
  <Clock.HourOptions>
    {({ options }) => options.map((option) => <Clock.Option value={option} />)}
  </Clock.HourOptions>
  <Clock.MinuteOptions>
    {({ options }) => options.map((option) => <Clock.Option value={option} />)}
  </Clock.MinuteOptions>
  <Clock.SecondOptions>
    {({ options }) => options.map((option) => <Clock.Option value={option} />)}
  </Clock.SecondOptions>
</Clock.Root>
```

## Basic example

{{"demo": "BasicClockDemo.js", "defaultCodeOpen": false}}
