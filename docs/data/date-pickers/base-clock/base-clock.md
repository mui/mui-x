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
  <Clock.Hour12List>
    {({ options }) => options.map((option) => <Clock.Cell value={option} />)}
  </Clock.Hour12List>
  <Clock.Hour24List>
    {({ options }) => options.map((option) => <Clock.Cell value={option} />)}
  </Clock.Hour24List>
  <Clock.MinuteList>
    {({ options }) => options.map((option) => <Clock.Cell value={option} />)}
  </Clock.MinuteList>
  <Clock.SecondList>
    {({ options }) => options.map((option) => <Clock.Cell value={option} />)}
  </Clock.SecondList>
  <Clock.MeridiemList>
    {({ options }) => options.map((option) => <Clock.Cell value={option} />)}
  </Clock.MeridiemList>
</Clock.Root>
```

## Multi column layout

### Hours without meridiem

{{"demo": "Hour24Demo.js", "defaultCodeOpen": false}}

### Hours with meridiem

WIP

{{"demo": "Hour12Demo.js", "defaultCodeOpen": false}}

### Custom seconds step

```tsx
<Clock.SecondList step={5}>{/** Options */}</Clock.SecondList>
```

{{"demo": "SecondWithCustomStepDemo.js", "defaultCodeOpen": false}}

### Custom minutes step

```tsx
<Clock.MinuteList step={5}>{/** Options */}</Clock.MinuteList>
```

{{"demo": "MinuteWithCustomStepDemo.js", "defaultCodeOpen": false}}

## Single column layout

### Basic example

{{"demo": "FullTimeDemo.js", "defaultCodeOpen": false}}

### Custom step

```tsx
<Clock.FullTimeList precision="minute" step={30}>{/** Options */}</Clock.MinuteList>
```

{{"demo": "FullTimeWithCustomStepDemo.js", "defaultCodeOpen": false}}

### Custom format

```tsx
<Clock.Cell format="hh:mm:ss" />
```

{{"demo": "FullTimeWithCustomFormatDemo.js", "defaultCodeOpen": false}}
