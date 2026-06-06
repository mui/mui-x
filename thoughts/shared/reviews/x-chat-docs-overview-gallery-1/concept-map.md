# Concept Map

The branch is trying to make the Chat docs feel product-ready while expanding the Material chat surface.

The implementation concept I reconstructed:

1. `ChatBox` becomes the complete all-in-one Material chat surface.
   - It owns a `ChatRoot`.
   - It exposes a large flat `slots` / `slotProps` API.
   - It handles conversation list, header, message list, composer, suggestions, empty state, responsive overlay/split behavior, and all default row composition.

2. Flat slots are supposed to flow through one shared pipeline.
   - `ChatBox.tsx` receives flat `slots` / `slotProps`.
   - `ChatSlotsProvider` stores them.
   - `ChatBoxContent.tsx` maps layout/list/widget slots.
   - `ChatMessageList.tsx` partitions list-level slots from row-level slots.
   - `DefaultMessageItem.tsx` reads row slots from context or props.
   - `ChatMessageGroup` maps message-group slots into `MessageGroup`.
   - `ChatMessage` maps message slots into the final root/content/avatar/meta/actions tree.

3. Wrapper-only slots are a key API promise.
   - `root`, `conversationRoot`, `messageList`, `messageGroup`, `messageRoot`, and `composerRoot` are documented as swapping the styled element while preserving the default child tree.
   - That promise matters because consumers should be able to replace markup or styled components without reimplementing the chat internals.

4. Callback-form `slotProps` are another key API promise.
   - `mergeSlotProps.ts` was added specifically because spreading a function-form `SlotComponentProps` turns it into `{}`.
   - The helper is correct in isolation, but use is inconsistent across the new pipeline.

5. The docs layer is now a major part of the feature.
   - `PlaygroundCard` is a reusable docs playground shell with controls, code output, classes editor, copy code, responsive preview, and tabs.
   - `parseSx.ts` parses editable `sx` snippets for playground class overrides.
   - `chat-gallery` adds a component overview gallery with hand-authored schematic thumbnails.
   - Large sets of docs demos and generated JS companions were added or updated.

The high-level failure mode: the public story says "complete, composable, slot-driven ChatBox", but several exposed slots and slot props are either ignored, swallowed, or only partially implemented. The docs then advertise the same API surface, so the implementation and the docs can fail together for realistic customizations.
