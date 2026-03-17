---
title: Chat - Composer with attachments
productId: x-chat
packageName: '@mui/x-chat-unstyled'
---

# Composer with attachments

<p class="description">Build the full unstyled draft surface with a textarea, hidden file input, helper text, and send action.</p>

This recipe isolates the draft area so the interaction model is easy to understand before it is embedded into a larger chat shell.

That is useful because chat composers often look simple but hide a lot of behavior: autosizing, disabled states, IME-safe submit, attachment selection, and helper text.

{{"demo": "ComposerWithAttachments.js"}}

## What it shows

- `Composer.Root`
- `Composer.Input`
- `Composer.AttachButton`
- `Composer.HelperText`
- `Composer.SendButton`
- attachment flows and IME-safe input behavior

## Key primitives

- `Composer.Root` for form submission and shared composer context
- `Composer.Input` for autosizing textarea behavior and IME-safe submit
- `Composer.AttachButton` for the visible trigger plus hidden file input
- `Composer.HelperText` for error or helper messaging
- `Composer.SendButton` for runtime-aware disabled and submit state

## Implementation notes

- Show both text-only and attachment-backed drafts.
- Make the helper text visible through either explicit copy or a runtime error so its role is clear.
- Keep the visual design plain so the hidden file-input relationship is the main lesson.

## When to use this pattern

Use this recipe when:

- a product surface needs upload support
- the send action depends on runtime state
- the team needs a clear example of the unstyled composer contract

This applies to support chat with screenshots, copilots that accept reference files, and internal tools where users need to attach evidence or export artifacts alongside text.

## What to pay attention to

- `Composer.AttachButton` owns the visible-trigger plus hidden-input relationship, so the page layer does not need attachment plumbing.
- `Composer.HelperText` is the natural place for both authored guidance and runtime error fallback.
- `Composer.Input` already handles the IME and Enter behavior that teams often reimplement by hand.

## Next steps

- Continue with [Composer](/x/react-chat/unstyled/composer/) for the reference-level API and behaviors.
- Continue with [Slot customization](/x/react-chat/unstyled/examples/slot-customization/) when the default composer structure is correct but the markup needs to match a custom design system.
