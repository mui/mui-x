---
title: Data Grid - Conditional formatting
---

# Data Grid - Conditional formatting [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Style the cells that match a condition, and export the rules to Excel as conditional formats.</p>

Pass a list of rules to the `conditionalFormatting` prop.
Each `highlight` rule names the columns it applies to, a condition, and the style of the cells that match it.

```ts
{
  type: 'highlight',
  fields: ['stock'],
  condition: { type: 'cell', operator: 'lessThan', value: 10 },
  style: { color: '#c62828', fontWeight: 'bold' },
}
```

The demo below has three rules:

- **Stock** below 10 is red and bold.
- **Product** and **Status** of discontinued products are struck through: a formula condition reads the **Status** of the row.
- **Product** and **Price** get a green background when the price is more than twice the cost.

Edit the values to see the styles update, or export to Excel from the toolbar.

{{"demo": "ConditionalFormattingBasic.js", "bg": "inline"}}

## Conditions

### Cell value

A `cell` condition compares the value of the cell with `value`.
The operators are `equal`, `notEqual`, `greaterThan`, `greaterThanOrEqual`, `lessThan`, `lessThanOrEqual`, `between` and `notBetween`.
`between` and `notBetween` also read the upper bound from `valueTo`. Both bounds are inclusive.

A number only matches number cells, a date only matches date cells, and a string only matches text cells. Boolean cells never match.
On a date column, a date can also be an ISO string, as dates are once a saved state is parsed from JSON.
Strings are compared case-insensitively.

```ts
{ type: 'cell', operator: 'between', value: 10, valueTo: 20 }
```

### Text

A `text` condition matches the text of the cell, case-insensitively.
For columns that are not number, boolean or date columns, it reads the formatted value, like the label of a single select option.
On date cells, only `isEmpty` and `isNotEmpty` match.
The operators are `contains`, `notContains`, `startsWith`, `endsWith`, `isEmpty` and `isNotEmpty`.

```ts
{ type: 'text', operator: 'startsWith', value: 'USB' }
```

### Formula

A `formula` condition matches the rows where the formula evaluates to `TRUE`.
It uses the [formula syntax](/x/react-data-grid/formula-syntax/) and can only reference columns of the same row, including [computed columns](/x/react-data-grid/computed-columns/).

```ts
{ type: 'formula', formula: '=AND(stock < 10, status = "Active")' }
```

A formula reads the values of the cells, not their formatted text.

Formula conditions need the formula feature, injected through the `featureDependencies` prop as described in [Enabling formulas](/x/react-data-grid/formulas/#enabling-formulas).
Like formulas, they have no effect with `disableFormulas` or a `dataSource`.

## Styles

A rule sets any of `color`, `backgroundColor`, `fontWeight: 'bold'`, `fontStyle: 'italic'` and `textDecoration` (`'underline'` or `'line-through'`).
Colors are hex strings, such as `#c62828`. Other values are ignored.

When several rules match a cell and set the same property, the first rule wins.
Selected cells and rows keep the selection background.

The rules apply to data rows, including pinned rows and the parent rows of tree data. Row grouping rows and aggregation rows are not formatted.

## Controlled rules

Use `conditionalFormatting` and `onConditionalFormattingChange` to control the rules, or `initialState.conditionalFormatting.model` to set them once.
`apiRef.current.setConditionalFormatting()` replaces them.
The rules are part of the [exported state](/x/react-data-grid/state/#save-and-restore-the-state).

## Excel export

The [Excel export](/x/react-data-grid/export/#excel-export) writes each rule as a conditional format on the exported columns, so the styles follow the data when it changes in Excel.

Formula conditions are exported when the formula feature is injected and the formula only calls registered functions.
A rule whose formula references a column that is not exported is skipped.

With a [web worker](/x/react-data-grid/export/#using-a-web-worker), an `exceljsPreProcess` that adds rows before the headers shifts the conditional formats.

## API

- [`DataGridPremium`](/x/api/data-grid/data-grid-premium/)
- [`GridApi`](/x/api/data-grid/grid-api/)
