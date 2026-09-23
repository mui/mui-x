---
title: Chat - Composer with attachments
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Composer with attachments

<p class="description">Compose messages with text and file attachments using the headless `Composer` primitives.</p>

Chat composers hide a lot of behavior behind a simple surface: autosizing, disabled states, IME-safe submit, attachment selection, and helper text.

The demo below shows the headless composer wired up with text input, attachment selection, helper text, and send state:

{{"demo": "ComposerWithAttachments.js"}}

## Wiring the composer primitives

- `Composer.Root` for form submission and shared composer context
- `Composer.TextArea` for autosizing textarea behavior and IME-safe submit
- `Composer.AttachButton` for the visible trigger plus hidden file input
- `Composer.HelperText` for error or helper messaging
- `Composer.SendButton` for runtime-aware disabled and submit state

## Composing with attachments

- Show both text-only and attachment-backed drafts.
- Make the helper text visible through either explicit copy or a runtime error so its role is clear.
- Keep the visual design plain so the hidden file-input relationship is the main lesson.

## Common use cases

Use this pattern when:

- A product surface needs upload support.
- The send action depends on runtime state.

This applies to support chat with screenshots, copilots that accept reference files, and internal tools where users need to attach evidence or export artifacts alongside text.

## What to pay attention to

- `Composer.AttachButton` owns the visible-trigger and hidden-input relationship—the page layer doesn't need attachment plumbing.
- `Composer.HelperText` surfaces both authored guidance and runtime error fallback.
- `Composer.TextArea` handles IME and Enter behavior.

## See also

- See [Composer](/x/react-chat/headless/composer/) for details on the reference-level API and behaviors.
- See [Slot customization](/x/react-chat/headless/examples/slot-customization/) for details on adapting the composer markup to a custom design system.

## API

- [`ChatRoot`](/x/api/chat/chat-root/)
