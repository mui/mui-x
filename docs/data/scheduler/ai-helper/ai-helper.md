---
productId: x-scheduler
title: React Scheduler AI Helper
packageName: '@mui/x-scheduler'
githubLabel: 'scope: scheduler'
---

# Scheduler - AI Helper

<p class="description">Create events using natural language with AI assistance.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

:::warning
This feature requires an API key from OpenAI or Anthropic.
:::

## Demo

Press **Cmd+K** (Mac) or **Ctrl+K** (Windows/Linux) to open the AI helper command palette. Describe the event you want to create in natural language, and the AI will parse it into a structured event.

{{"demo": "AiHelperDemo.js", "bg": "inline"}}

## Usage

```tsx
<EventCalendar
  events={events}
  onEventsChange={setEvents}
  // Enable AI helper
  aiHelper
  aiHelperApiKey="your-api-key"
  aiHelperProvider="openai" // or "anthropic"
  aiHelperModel="gpt-4o-mini" // optional
  aiHelperDefaultDuration={60} // optional, in minutes
/>
```

## Props

| Prop                      | Type                      | Default         | Description                       |
| ------------------------- | ------------------------- | --------------- | --------------------------------- |
| `aiHelper`                | `boolean`                 | `false`         | Enable the AI helper feature      |
| `aiHelperApiKey`          | `string`                  | -               | API key for the LLM provider      |
| `aiHelperProvider`        | `'openai' \| 'anthropic'` | `'openai'`      | The LLM provider to use           |
| `aiHelperModel`           | `string`                  | `'gpt-4o-mini'` | The model to use                  |
| `aiHelperDefaultDuration` | `number`                  | `60`            | Default event duration in minutes |
| `aiHelperExtraContext`    | `string`                  | -               | Additional context for the LLM    |

## Examples of natural language input

- "Meeting with John tomorrow at 3pm"
- "Lunch with the team on Friday at noon for 2 hours"
- "Dentist appointment next Monday morning"
- "Project deadline all day on December 15th"
