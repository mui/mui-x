---
productId: x-date-pickers
title: Frequently Asked Questions - Date and Time pickers
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# Frequently asked questions

<p class="description">Can't find what you are looking for? The FAQ section has answers to some of the most frequent questions and challenges.</p>

If you still have trouble, you can refer to the [support page](/x/introduction/support/).

## What is the DemoContainer and DemoItem?

The `<DemoContainer />` is an internal component used together with the `<DemoItem />` to display multiple components in a consistent layout throughout the demos.

This helps avoid the repeated use of layout components, such as `<Box />` or `<Stack />`, while keeping the code minimal and clear, and allowing readers to focus on what is important - the demo itself.

:::warning
You should never use these components in your application.
:::

## Why is the KeyboardDatePicker not supported anymore?

It has been replaced with the `DatePicker` component, please refer to the [migration documentation](/material-ui/migration/pickers-migration/#imports) for more information.

All versions of the date and time pickers implement keyboard input for accessibility and also allow editing through the UI. Depending on your use case, you may only need keyboard editing, in which case you can use the date and time field components.

For instance, `DatePicker` allows for editing both via input and a calendar, while `DateField` only allows for editing via input. You can read more about the different types of components on the [base concepts page](/x/react-date-pickers/base-concepts/#other-components).

For more information about the fields, you can refer to the [field components page](/x/react-date-pickers/fields/).
