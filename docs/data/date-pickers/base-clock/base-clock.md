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

## Single column layout

{{"demo": "SingleColumnDemo.js", "defaultCodeOpen": false}}

## Multi column layout

### Hours without meridiem

{{"demo": "HourMinuteSecondDemo.js", "defaultCodeOpen": false}}

### Hours with meridiem

WIP

{{"demo": "HourWithMeridiemMinuteSecondDemo.js", "defaultCodeOpen": false}}

## Custom step

### Seconds

```tsx
<Clock.SecondOptions step={5}>{/** Options */}</Clock.SecondOptions>
```

{{"demo": "StepSecondOptions.js", "defaultCodeOpen": false}}

### Minutes

```tsx
<Clock.MinuteOptions step={5}>{/** Options */}</Clock.MinuteOptions>
```

{{"demo": "StepMinuteOptions.js", "defaultCodeOpen": false}}
