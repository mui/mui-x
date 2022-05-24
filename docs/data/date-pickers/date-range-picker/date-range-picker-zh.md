---
title: React Date Range Picker（日期范围选择器）组件
components: DateRangePicker, DateRangePickerDay, DesktopDateRangePicker, MobileDateRangePicker, StaticDateRangePicker
githubLabel: 'component: DateRangePicker'
packageName: '@mui/x-date-pickers-pro'
materialDesign: https://material.io/components/date-pickers
---

# Date Range Picker [<span class="plan-pro"></span>](https://mui.com/store/items/mui-x-pro/)

<p class="description">日期选择器让用户选择一系列的日期。</p>

日期范围选择器让用户选择一个日期范围。

## 基本用法

请注意，你可以从 [DatePicker](/x/react-date-pickers/date-picker/) 中传递几乎任何的属性。

{{"demo": "BasicDateRangePicker.js"}}

## 静态模式

可以将任何选择器内嵌渲染。 这将启用自定义弹出提示/模态框的容器。

{{"demo": "StaticDateRangePickerDemo.js", "bg": true}}

## 响应式

日期范围选择器组件是针对运行它的设备进行设计并优化的。

- The `MobileDateRangePicker` component works best for touch devices and small screens.
- The `DesktopDateRangePicker` component works best for mouse devices and large screens.

By default, the `DateRangePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches. 你也可以使用 `desktopModeMediaQuery` 属性来自定义它。 你也可以使用 `desktopModeMediaQuery` 属性来自定义它。

{{"demo": "ResponsiveDateRangePicker.js"}}

## Form props 表单的属性

The date range picker component can be disabled or read-only.

{{"demo": "FormPropsDateRangePickers.js"}}

## 不同的月数

请注意，`calendars` 属性仅运行在桌面端。

{{"demo": "CalendarsDateRangePicker.js"}}

## 禁用日期

禁用日期的行为与 `DatePicker` 相同。

{{"demo": "MinMaxDateRangePicker.js"}}

## 自定义输入组件

你可以使用 `renderInput` 属性来渲染自定义的输入。 对于 `DateRangePicker`，它需要**两个**参数 – 分别是开始和结束输入。 如果你需要渲染自定义的输入，请确保将 `ref` 和 `inputProps` 都正确地传入到输入组件中。

{{"demo": "CustomDateRangeInputs.js"}}

## 自定义日期渲染

你可以通过 `renderDay` 函数属性来自定义所显示的日期。 You can take advantage of the internal [DateRangePickerDay](/x/api/date-pickers/date-range-picker-day/) component.

{{"demo": "CustomDateRangePickerDay.js"}}
