---
title: AI Assistant
---

# AI Assistant [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Translate natural language into Data Grid views.</p>

The AI Assistant feature lets users interact with the Data Grid component using natural language.
Type a prompt like "sort by name", "show amounts larger than 1000", or even make more complex queries like "which customers brought the most revenue the past year" in the prompt input field and the Data Grid will update accordingly.
In [supported browsers](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#browser_compatibility), users can also prompt the assistant using their voice.

The AI Assistant does not process prompts itself.
It sends each prompt to a prompt processor that you run on your own server, and applies the result to the grid.
You choose the AI provider and model, and keep full control over prompts, logging, and data handling.

:::info
The demos on this page send prompts to a demo endpoint with limited capacity.
Use your own prompt processor in production.
:::

{{"demo": "AssistantWithExamples.js", "bg": "inline", "defaultCodeOpen": false}}

## How it works

1. The user types a prompt in the assistant panel.
2. The Data Grid calls `onPrompt()` with the prompt, a `context` string that describes the columns, and the ID of the current conversation.
3. `onPrompt()` sends them to your server, which asks a language model to turn the prompt into grid updates.
4. Your server returns a `PromptResponse`, and the Data Grid applies the filters, sorting, grouping, aggregation, pivoting, row selection, and chart settings it contains.

## Get started

To enable this feature on the Data Grid, pass the `aiAssistant` prop, use the `GridAiAssistantPanel` component for the `aiAssistantPanel` slot, and pass an `onPrompt()` callback that calls your prompt processor.
`unstable_gridDefaultPromptResolver()` posts the prompt to the URL you pass and returns the response data:

```tsx
import {
  DataGridPremium,
  GridAiAssistantPanel,
  unstable_gridDefaultPromptResolver as promptResolver,
} from '@mui/x-data-grid-premium';

function processPrompt(prompt: string, context: string, conversationId?: string) {
  return promptResolver('/api/prompt', prompt, context, conversationId);
}

// ...
<DataGridPremium
  aiAssistant
  onPrompt={processPrompt}
  slots={{ aiAssistantPanel: GridAiAssistantPanel }}
/>;
```

### Request

`unstable_gridDefaultPromptResolver()` sends a `POST` request with a JSON body:

```ts
type PromptRequest = {
  query: string; // the user's prompt
  context: string; // JSON string describing the columns
  conversationId?: string; // ID returned by the previous response in this conversation
  options?: {
    additionalContext?: string; // extra context you pass to the resolver
  };
};
```

`context` is a JSON-serialized array with one entry per column:

```ts
type ColumnContext = {
  field: string;
  description: string | null;
  type: string; // 'string', 'number', 'date', 'singleSelect', ...
  allowedOperators: string[]; // filter operators the column supports
  examples: unknown[]; // column examples or sampled row values
  derivedFrom?: string; // set on pivot derived columns
};
```

The request includes cookies (`credentials: 'include'`), so you can authenticate users with your existing session.

### Response

Return a `Result<PromptResponse>`:

```ts
type Result<T> = { ok: false; message: string } | { ok: true; data: T };

type PromptResponse = {
  conversationId: string;
  select: number; // number of top rows to select, -1 for none
  filters: { column: string; operator: string; value: unknown }[];
  filterOperator?: 'and' | 'or';
  aggregation: Record<string, 'avg' | 'sum' | 'min' | 'max' | 'size'>;
  sorting: { column: string; direction: 'asc' | 'desc' }[];
  grouping: { column: string }[];
  pivoting:
    | {
        columns: { column: string; direction: 'asc' | 'desc' }[];
        rows: string[];
        values: Record<string, 'avg' | 'sum' | 'min' | 'max' | 'size'>[];
      }
    | {};
  chart: { dimensions: string[]; values: string[] } | null;
};
```

Column names in the response must match the `field` values from `context`, and filter operators must come from that column's `allowedOperators`.

The Data Grid stores `conversationId` and sends it back with the next prompt, so follow-up prompts like "now only show the top 10" can build on earlier ones.
Your server decides what a conversation is: for example, keep the previous messages keyed by this ID and send them to the model with the new prompt.

### Minimal server

The route below shows the shape of a prompt processor in Next.js.
`callModel()` stands for your AI provider's SDK: ask it for a JSON object that matches `PromptResponse`, ideally with the provider's structured output mode.
Keep your provider's API key on the server.

```ts
// app/api/prompt/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { callModel } from './model';

const SYSTEM_PROMPT = `You translate natural language questions about a table into table state.
The user message contains the table columns as JSON and the question.
Reply with a JSON object that matches the PromptResponse type.
Only use column fields and filter operators listed in the columns.`;

export async function POST(request: NextRequest) {
  const { query, context, conversationId, options } = await request.json();

  try {
    const id = conversationId ?? crypto.randomUUID();
    const data = await callModel({
      system: SYSTEM_PROMPT,
      // Add earlier messages of the conversation `id` here
      prompt: [
        `Columns: ${context}`,
        options?.additionalContext && `Context: ${options.additionalContext}`,
        `Question: ${query}`,
      ]
        .filter(Boolean)
        .join('\n'),
    });

    return NextResponse.json({ ok: true, data: { ...data, conversationId: id } });
  } catch {
    return NextResponse.json({
      ok: false,
      message: 'Could not process the prompt. Try rephrasing it.',
    });
  }
}
```

### Custom integration

`unstable_gridDefaultPromptResolver()` is optional.
`onPrompt()` can call your service any way you like, as long as it returns `Promise<PromptResponse>`.

The [`aiAssistant` API](/x/api/data-grid/grid-api/#grid-api-prop-aiAssistant) lets you process prompts and manage conversations from your own components.
You can also skip `PromptResponse` and apply the result with other Grid APIs such as [`setFilterModel()`](/x/api/data-grid/grid-api/#grid-api-prop-setFilterModel) or [`setSortModel()`](/x/api/data-grid/grid-api/#grid-api-prop-setSortModel).

## Improving accuracy with example values

To increase the accuracy of the language processing, provide example values for the available columns via one of the methods below.

### Provide custom examples

Use the `examples` property on items of the `columns` array to provide custom examples as context for prompt processing.
The `examples` property should contain an array of possible values for each respective column.
The demo at the top of the page uses this approach.

:::success
Provide examples for the [derived columns](/x/react-data-grid/pivoting/#derived-columns-in-pivot-mode) using the `getPivotDerivedColumns` prop.
:::

### Use row data for examples

Pass the `allowAiAssistantDataSampling` prop to use row data to generate examples.
This is useful if you're dealing with non-sensitive data and want to skip creating custom examples for each column.

Data is collected randomly at the cell level, which means that the examples for a given column might not come from the same rows.

{{"demo": "AssistantWithDataSampling.js", "bg": "inline"}}

### Using server-side data

The example below shows how to combine the AI Assistant with [server-side data](/x/react-data-grid/server-side-data/).

{{"demo": "AssistantWithDataSource.js", "bg": "inline"}}

### Data visualization

AI Assistant analyzes the query to determine if it is helpful to visualize the results.

[Integrate](/x/react-data-grid/charts-integration/) the Data Grid with [MUI X Charts](/x/react-charts/) to enable the Data Grid to apply the visualization instructions.

{{"demo": "AssistantWithCharts.js", "bg": "inline"}}

## Error handling

When `onPrompt` rejects, the Data Grid automatically displays the error message in the assistant panel.
`unstable_gridDefaultPromptResolver()` converts `{ ok: false, message }` responses into a rejected promise, so this happens without any extra handling in your code.

If you want to log errors to an external service before the Data Grid handles them, wrap your implementation in a try/catch and re-throw:

```ts
async function processPrompt(
  query: string,
  context: string,
  conversationId?: string,
) {
  try {
    return await unstable_gridDefaultPromptResolver(
      '/api/prompt',
      query,
      context,
      conversationId,
    );
  } catch (error) {
    // Report to your error tracking service (Sentry, Datadog, etc.)
    console.error('[AI Assistant] Prompt processing failed:', error);
    throw error;
  }
}
```

If users receive unexpected or incorrect grid updates, provide more specific column `examples` or add an `additionalContext` string describing what the rows represent.
This gives the model enough context to interpret ambiguous queries correctly.

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
