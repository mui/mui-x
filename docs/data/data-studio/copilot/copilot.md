---
productId: x-data-studio
title: Data Studio - Copilot
packageName: '@mui/x-data-studio'
githubLabel: 'scope: data studio'
---

# Data Studio - Copilot

<p class="description">Drive Data Studio with a Copilot panel: add views, switch dataSources, edit per-view grid state from chat.</p>

The Studio Copilot is built on top of [`@mui/x-copilot`](https://mui.com/x/react-data-grid/copilot/). The Studio package wires the generic core to its imperative state machine — `useDataStudioState` — so the chat agent can drive view CRUD, dataSource selection, view-level grid state edits, and chart config edits through a single seam.

{{"demo": "StudioCopilot.js", "bg": "inline"}}

> **Mock adapter vs. live backend.** The demo ships with a small mock adapter that recognises a fixed set of prompts (`add a view`, `switch to customers`, `rename to ...`, `sort by revenue desc`, `filter to West region`, `delete the view`). Toggle the switch above the studio to send to the same backend the Grid Copilot demo uses — the request body includes a `studioContext` field with the state document and the `studio.*` command catalog so a host-aware backend can branch on it. The current backend is configured for the Grid's command vocabulary; you'll see Studio command suggestions land once the backend prompt is updated to read `studioContext`.

## Quick start

```tsx
import {
  DataStudio,
  createStudioCopilotLocalStorageAdapter,
  studioFormulaPlugin,
  studioPdfReportPlugin,
} from '@mui/x-data-studio';

const COPILOT_PLUGINS = [studioFormulaPlugin(), studioPdfReportPlugin()];

const chatAdapter = createStudioCopilotLocalStorageAdapter(myBackendAdapter, {
  key: 'app-namespace',
});

<DataStudio
  dataSources={dataSources}
  copilotChatAdapter={chatAdapter}
  copilotPlugins={COPILOT_PLUGINS}
/>;
```

When `copilotChatAdapter` is provided, Data Studio:

- mounts a right-side drawer with a `StudioCopilotPanel`,
- adds a toolbar trigger that toggles the drawer,
- wires the studio's `useDataStudioState` into the executor so the agent's tool calls land on the live state machine,
- forwards `copilotPlugins` to plugin renderers via `CopilotPluginRenderProvider`.

## What the agent can drive

The Copilot's executor recognizes two tool calls:

- `runCommands` — JSONL of imperative commands. Studio registers ten:
  `studio.addView`, `studio.selectView`, `studio.selectDataSource`, `studio.updateView`,
  `studio.renameView`, `studio.duplicateView`, `studio.deleteView`,
  `studio.moveView`, `studio.invalidateDataSource`, `studio.invalidateAll`.
- `setGridState` — JSONL of [RFC 6902](https://www.rfc-editor.org/rfc/rfc6902) JSON Patch ops applied to the Studio state document. The supported slice paths are:

  | Path                             | Effect                                               |
  | -------------------------------- | ---------------------------------------------------- |
  | `/active/dataSourceId`           | `stateApi.selectDataSource(value)`                   |
  | `/active/viewId`                 | `stateApi.selectView(value)`                         |
  | `/views/<id>/label`              | `stateApi.renameView(id, value)`                     |
  | `/views/<id>/dataSourceId`       | `stateApi.updateView(id, { dataSourceId: value })`   |
  | `/views/<id>/initialState[/...]` | `stateApi.updateView(id, { initialState: subtree })` |

  Views are keyed by id (not array index) so the agent can reference a view across turns without tracking array positions. View CRUD (add / delete / move) lives in `runCommands` so the order array stays in sync.

## Guards

Each handler is gated by a guard flag. Pass `copilotFeatures` on `<DataStudio>` to turn subsets off:

```tsx
<DataStudio
  copilotChatAdapter={adapter}
  copilotFeatures={{
    mutations: false,    // read-only mode
    dataQuery: false,    // disable the queryStudioData approval flow
  }}
/>
```

The default guards enable every capability: `mutations`, `viewCrud`, `viewEditing`, `dataSourceSwitching`, `dataQuery`.

## Slots

```tsx
<DataStudio
  copilotChatAdapter={adapter}
  slots={{
    copilotPanel: MyCustomPanel,   // override the chat panel entirely
    copilotTrigger: MyTriggerIcon, // customize the toolbar trigger button
  }}
/>
```

## Plugins

The PDF and Formula plugins are host-agnostic; Studio re-exports them with bindings that read from the active dataSource's rows + the Studio plugin render context. See the [Grid Copilot docs](https://mui.com/x/react-data-grid/copilot/#generating-pdf-reports-plugin) for the PDF spec format.

## API

- [DataStudio](/x/api/data-studio/data-studio/)
