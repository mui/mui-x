# File-by-File Review Notes

## `packages/x-chat/src/ChatBox/ChatBox.tsx`

`ChatBox` accepts `slots`, `slotProps`, `children`, and root-level visual props, but it always renders `ChatBoxStyled` directly. `slots.root` and `slotProps.root` are never read. `children` is collected into `...other`, then overridden by explicit JSX children inside `ChatBoxStyled`, so consumer children are effectively dropped. This directly contradicts the docs that say hooks work in children of `ChatBox`.

Relevant lines: `ChatBox.tsx:62-105`, `ChatBox.tsx:155-175`.

## `packages/x-chat/src/ChatBox/ChatBox.types.ts`

The type surface advertises `root?: React.ElementType` and `slotProps.root`. It also documents wrapper-only layout slots. That makes the ignored root slot in `ChatBox.tsx` a public API bug, not an implementation detail.

Relevant lines: `ChatBox.types.ts:56-72`, `ChatBox.types.ts:357-385`.

## `packages/x-chat/src/ChatBox/ChatBoxContent.tsx`

The file is doing too much: responsive mode resolution, drawer focus management, slot translation, list rendering, empty states, suggestions, scroll affordances, and composer layout. The most suspicious parts are:

- Initial responsive mode is `standard` until container measurement arrives, which can flash or render the wrong layout on narrow containers.
- The ResizeObserver hook depends on the stable ref object, not the current DOM node, so it will not reattach if the root node is replaced.
- `slotProps.messageList` is treated as a plain `Partial<ChatMessageListProps>` object; this does not fit the broader callback-form slot prop story.
- The narrow overlay closes on keyboard selection only when `activeConversationId` changes. Pressing Enter on the already-active conversation leaves the overlay open and focus trapped.
- The split-mode back button calls `setActiveConversation(undefined)`, which is fine for uncontrolled state but should have stronger controlled-state coverage.

Relevant lines: `ChatBoxContent.tsx:52-92`, `ChatBoxContent.tsx:665-688`, `ChatBoxContent.tsx:741-743`, `ChatBoxContent.tsx:761-774`, `ChatBoxContent.tsx:780-796`, `ChatBoxContent.tsx:827-832`.

## `packages/x-chat/src/ChatMessageList/ChatMessageList.tsx`

This file is the clearest evidence that callback-form `slotProps` support was implemented inconsistently. It partitions row/list slot props, then builds list-level `slotProps` by spreading `listSlotProps?.messageList`, `messageListScroller`, and `messageListContent`. If a consumer passes a callback, the function is flattened to `{}` and ignored. This is exactly the bug `mergeSlotProps.ts` says it solves.

Relevant lines: `ChatMessageList.tsx:146-159`, `ChatMessageList.tsx:201-217`.

## `packages/x-chat/src/ChatMessageList/DefaultMessageItem.tsx`

The row slot pipeline is conceptually reasonable, but it depends on the rest of the flat slot API being consistent. It forwards row slot props into `ChatMessageGroup`, but the upstream public types are `Partial<...Props>` rather than a uniform slot-prop callback vocabulary, so behavior differs by slot family.

Relevant lines: `DefaultMessageItem.tsx:59-110`.

## `packages/x-chat/src/ChatConversationList/ChatConversationList.tsx`

The resolved slots object spreads `...slots` last, so the explicit fallbacks are dead for any provided key. If a consumer supplies a key with `undefined`, the wrapper can fall back to the headless `ScrollArea` scrollbar/viewport defaults instead of the wrapper's plain-div/no-op replacements. The comments say rendering those without `ScrollArea.Root` throws during SSR.

Only `item` has callback-form slot prop handling. The root, scroller, avatar, content, title, preview, timestamp, unread badge, and actions slots still spread maybe-functions as objects. Compact-mode item actions are also hidden via opacity and revealed on hover only; keyboard focus and touch do not reveal them.

Relevant lines: `ChatConversationList.tsx:87-105`, `ChatConversationList.tsx:165-171`, `ChatConversationList.tsx:297-315`, `ChatConversationList.tsx:709-724`, `ChatConversationList.tsx:736-785`.

## `packages/x-chat/src/ChatMessage/ChatMessage.tsx`

The root slot prop has the same callback-form bug. `slotProps.root` is spread as an object, so callback-form props are silently ignored.

Relevant lines: `ChatMessage.tsx:276-290`.

## `packages/x-chat/src/ChatComposer/ChatComposer.tsx`

The composer root slot has the same callback-form bug. `slotProps.root` is spread as an object. Because `composerRoot` is one of the wrapper-only slots promoted by `ChatBox`, this breaks the advertised customization path.

Relevant lines: `ChatComposer.tsx:255-280`.

## `packages/x-chat/src/ChatMessage/ChatMessageContent.tsx`

`ChatToolPartRoot` spreads consumer props and then installs its own `onToggle`, which clobbers any consumer `onToggle` on the tool details root. That is especially bad because the branch has a commit claiming this was fixed. Tool parts are also one of the higher-value customization targets for AI-agent docs.

Relevant lines: `ChatMessageContent.tsx:323-350`, `ChatMessageContent.tsx:1182-1193`.

## `packages/x-chat-headless/src/message-group/MessageGroup.tsx`

The new custom-children path clones every non-DOM React element and injects private props. This catches fragments and arbitrary consumer components. `React.Fragment` will warn when cloned with props other than `key`/`children`, and consumer wrappers can accidentally forward `isGrouped` / `groupAuthorName` to the DOM. The fallback also uses `children ? ... : ...`, so `children={null}` renders the default message tree instead of rendering nothing.

Relevant lines: `MessageGroup.tsx:211-236`.

## `packages/x-chat/src/internals/mergeSlotProps.ts`

The helper is useful and describes the callback-form bug accurately, but it is not a complete Material-style slot-prop merge. It spreads consumer props over base props, so consumer `className` drops the wrapper utility class, consumer `sx` drops the wrapper/top-level `sx`, and consumer `ref` can replace a forwarded ref at call sites that include `ref` in the base. Adoption is also incomplete: only some wrappers use it. The current codebase now has both correct and incorrect slot prop merge patterns side by side.

Relevant lines: `mergeSlotProps.ts:3-30`.

## `packages/x-chat/src/ChatIndicators/ChatUnreadMarker.tsx`

The current dirty working-tree edit changes the default label from a styled `div` to a `Chip` adapter. Runtime now accepts Chip props through `slotProps.label`, but the inherited headless type is still `SlotComponentProps<'div'>`, so the natural props (`color`, `variant`, `size`, `icon`, etc.) are not actually typed for consumers. The private adapter also has a huge hand-copied `Chip` PropTypes block marked as generated, which is brittle and not part of the normal package PropTypes workflow.

Relevant lines: `ChatUnreadMarker.tsx:42-56`, `ChatUnreadMarker.tsx:58-161`, `ChatUnreadMarker.tsx:173-192`; compare `UnreadMarker.tsx:24-27`.

## `docs/src/modules/components/chat-playground/PlaygroundCard.tsx`

The playground is a large new reusable docs primitive. Main review issues:

- It creates a `role="tablist"` but the buttons do not have `role="tab"`, `aria-controls`, panel linkage, or arrow-key behavior.
- Copy code reports success when `navigator.clipboard` is missing, because `setCopied(true)` runs even when no write occurred.
- The classes-editor textarea has no accessible label, `aria-invalid`, or `aria-describedby` connection to parse errors.
- The dirty working-tree change adds `defaultControlsCollapsed`, but it only seeds initial state and does not respond to later prop changes. That may be acceptable if documented as initial-only, but it should be intentional.

Relevant lines: `PlaygroundCard.tsx:529-600`, `PlaygroundCard.tsx:693-743`, `PlaygroundCard.tsx:815-827`, `PlaygroundCard.tsx:1070-1079`, `PlaygroundCard.tsx:1240-1264`.

## `docs/src/modules/components/chat-playground/parseSx.ts`

The parser rejects executable expressions, which is good, but it still writes arbitrary keys into a normal object. Keys such as `__proto__`, `constructor`, and `prototype` need to be rejected or the object should be created with a null prototype. It also accepts unterminated block comments by advancing past EOF rather than throwing.

Relevant lines: `parseSx.ts:76-92`, `parseSx.ts:141-155`, `parseSx.ts:249-258`.

## `docs/src/modules/components/chat-playground/*`

`controls.tsx`, `data.ts`, `sharedFixtures.ts`, `sharedProviders.tsx`, and `useCustomizations.ts` collectively create a docs-only customization system. The concern is not one specific line; it is that this is effectively a second mini framework with its own state, parser, copy-code generator, and fixtures. It needs stronger tests around code generation, accessibility, and bad parser input.

## `docs/src/modules/chat-gallery/*`

The gallery adds a lot of hand-authored SVG-like primitives and thumbnail components. This makes the overview visually rich, but it is not tied to the actual rendered components. Several component cards link to the same generic docs page rather than an API page or a focused anchor, so "all components" is not very useful for direct component lookup.

Relevant lines: `components.tsx:95-157`, `primitives.tsx` as a whole.

## `docs/data/chat/**/*`

The docs content is broad and mostly mirrors the new component story. The strongest docs issue is in `docs/data/chat/basics/chatbox/chatbox.md`, which says hooks work inside components rendered as a child or descendant of `ChatBox`, while `ChatBox` drops consumer children.

Relevant lines: `chatbox.md:47-50`.

## `docs/data/chat/basics/chatbox/ChatBoxPlayground.tsx`

The dirty working-tree change adds `defaultControlsCollapsed` and forwards it to `PlaygroundCard`. The generated `.js` companion is currently updated too. The remaining behavior note is that `defaultControlsCollapsed` only seeds initial state in `PlaygroundCard`; changing the prop later will not reopen or collapse controls.

Relevant lines: `ChatBoxPlayground.tsx:65-75`, `ChatBoxPlayground.tsx:207-213`; `ChatBoxPlayground.js:59-61`, `ChatBoxPlayground.js:191-196`.

## `docs/src/modules/components/overview/chat/mainDemo/MainDemo.tsx`

The dirty working-tree change starts the basic ChatBox playground with controls collapsed by passing `defaultControlsCollapsed`. This is tied to the new `PlaygroundCard` prop and generated `ChatBoxPlayground` update.

Relevant lines: `MainDemo.tsx:112-118`.

## Generated docs files

The branch updates many generated `.js` demo companions, API JSON files, and page files. I did not treat every generated mirror as independent logic. The current dirty docs/demo edits include their generated `.js` companions where applicable.

## Untracked root artifacts

The root contains many untracked screenshots, JSON dumps, and temporary files. Even if they are local-only, they make review state noisy and increase the chance of accidental commits. These should be moved into a scratch directory that is ignored or deleted before publishing.
