---
title: Data Grid - Formula Bar component
productId: x-data-grid
components: FormulaBar
packageName: '@mui/x-data-grid-premium'
githubLabel: 'scope: data grid'
---

# Data Grid - Formula Bar component [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">A spreadsheet-style formula bar for viewing and editing the focused cell's formula.</p>

The formula bar is part of the [formulas feature](/x/react-data-grid/formulas/).
On the default toolbar, enable it with `slotProps.toolbar.formulaBar`—see [Formulas—Formula bar](/x/react-data-grid/formulas/#formula-bar).

Use the Formula Bar component together with the [Toolbar](/x/react-data-grid/components/toolbar/) component when implementing a custom toolbar.
The bar renders nothing when formulas are unavailable (`disableFormulas`, a [data source](/x/react-data-grid/server-side-data/), or active [pivoting](/x/react-data-grid/pivoting/)).

## Basic usage

The demo below renders the Formula Bar from a custom toolbar.

{{"demo": "GridFormulaBar.js", "bg": "inline", "defaultCodeOpen": false}}

## Anatomy

```tsx
import { FormulaBar } from '@mui/x-data-grid-premium';

<FormulaBar />;
```

`<FormulaBar />` renders a full-width strip with the focused cell's address, the formula input—the same editor the cells use, with reference coloring and autocomplete—and the live result preview while a draft is being edited.

## Placement

The component only requires the grid's React context, not a place inside the grid's DOM: render it from any slot, and portal it wherever the formula bar should live—an app header, a side panel:

```tsx
import * as ReactDOM from 'react-dom';

function PortaledFormulaBar() {
  return ReactDOM.createPortal(
    <FormulaBar />,
    document.getElementById('app-header')!,
  );
}

<DataGridPremium showToolbar slots={{ toolbar: PortaledFormulaBar }} />;
```

Editing behavior is unaffected by the placement: interacting with the bar never closes a cell edit it mirrors, and committing from the bar returns the focus to the grid.

## Accessibility

The bar is a labeled `group`; the formula input is a `combobox` (or a `textbox` when the [autocomplete](/x/react-data-grid/formulas/#autocomplete) is disabled) and is marked read-only for cells that cannot be edited.
The labels come from the `formulaBarLabel`, `formulaBarInputLabel`, and `formulaBarAddressLabel` [locale text](/x/react-data-grid/localization/) keys.
