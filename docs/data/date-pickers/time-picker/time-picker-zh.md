---
title: React Time Picker（时间选择器）组件
components: DesktopTimePicker, MobileTimePicker, StaticTimePicker, TimePicker, ClockPicker
githubLabel: 'component: TimePicker'
packageName: '@mui/x-date-pickers'
materialDesign: https://material.io/components/time-pickers
---

# Time Picker 时间选择器

<p class="description">时间选择器允许用户选择一个单独的时间。</p>

时间选择器允许用户选择一个单一的时间（格式为：小时：分钟）。 选定的时间由时针末端的填充圆圈表示。

## 基本用法

The time picker is rendered as a modal dialog on mobile, and a textbox with a popup on desktop.

{{"demo": "BasicTimePicker.js"}}

## 静态模式

It's possible to render any time picker inline. 这将启用自定义弹出提示/模态框的容器。 This will enable building custom popover/modal containers.

{{"demo": "StaticTimePickerDemo.js", "bg": true}}

## 响应式

时间选择器组件是为它运行的设备设计和优化。

- The `MobileTimePicker` component works best for touch devices and small screens.
- The `DesktopTimePicker` component works best for mouse devices and large screens.

By default, the `TimePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches. 你也可以使用 `desktopModeMediaQuery` 属性来自定义它。 This can be customized with the `desktopModeMediaQuery` prop.

{{"demo": "ResponsiveTimePickers.js"}}

## Form props 表单的属性

The time picker component can be disabled or read-only.

{{"demo": "FormPropsTimePickers.js"}}

## Localization 本地化

使用 `LocalizationProvider` 来改变用于渲染时间选择器的数据引擎的本地化。 时间选择器会自动调整为当地时间，即 12 小时或 24 小时格式。 这可以通过 `ampm` 属性来控制。

{{"demo": "LocalizedTimePicker.js"}}

## 验证时间

{{"demo": "TimeValidationTimePicker.js"}}

## 横屏

{{"demo": "StaticTimePickerLandscape.js", "bg": true}}

## 子组件

Some lower-level sub-components (`ClockPicker`) are also exported. 这些都是在没有包装器或外部逻辑（屏蔽输入、日期值解析和验证等）的情况下渲染的。 These are rendered without a wrapper or outer logic (masked input, date values parsing and validation, etc.).

{{"demo": "SubComponentsTimePickers.js"}}

## 秒

秒的输入可以用来选择一个精确的时间点。

{{"demo": "SecondsTimePicker.js"}}
