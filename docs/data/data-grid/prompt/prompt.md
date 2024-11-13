---
title: Data Grid - Prompt
---

# Data Grid - Prompt [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Translates natural language into a set of grid state updates and applies those to the Data Grid component.</p>

:::warning
To use this feature, you need to have a prompt processing backend. MUI offers this service as a part of a premium package add-on. Check [licensing page](/x/introduction/licensing/) for more information.
:::

The prompt feature allows users to interact with the Data Grid component using natural language. The user can type commands like "sort by name" or "filter by country" in the prompt input field, and the Data Grid will update accordingly. To increase the accuracy of the prompt processing, the user should provide example values for the available columns. This can be done in two ways.

## Custom examples

The user can provide custom examples for the prompt processing through the `examples` prop of the column in the `columns` array. The `examples` prop should be an array of values that are possible values for that column.

{{"demo": "PromptWithExamples.js", "bg": "inline"}}

## Use row data for examples

If you pass `allowDataSampling` flag to the `GridToolbarPromptControl`, it will use the row data to generate examples for the prompt processing. This is useful if you are dealing with non-sensitive data and want to skip creating custom examples for each column.

{{"demo": "PromptWithDataSampling.js", "bg": "inline"}}
