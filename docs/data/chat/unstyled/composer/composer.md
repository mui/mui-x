---
productId: x-chat
title: Chat - Unstyled composer
packageName: '@mui/x-chat-unstyled'
components: ComposerRoot, ComposerInput, ComposerSendButton, ComposerAttachButton, ComposerToolbar, ComposerHelperText
---

# Unstyled composer

<p class="description">Assemble the draft surface from structural primitives that already handle submission, IME-safe Enter, attachments, helper text, and disabled states.</p>

## Primitive set

The composer surface is built from:

- `Composer.Root`
- `Composer.Input`
- `Composer.Toolbar`
- `Composer.AttachButton`
- `Composer.HelperText`
- `Composer.SendButton`

## Canonical composition

```tsx
import { Composer } from '@mui/x-chat-unstyled';

function ThreadComposer() {
  return (
    <Composer.Root>
      <Composer.Input placeholder="Write a message" />
      <Composer.HelperText />
      <Composer.Toolbar>
        <Composer.AttachButton />
        <Composer.SendButton />
      </Composer.Toolbar>
    </Composer.Root>
  );
}
```

This pattern gives you a working structural composer while leaving every visual decision in user land.

## `Composer.Root`

`Composer.Root` is a structural form wrapper around the headless composer state.

It owns:

- submit-on-form-submit wiring
- composer context for the child primitives
- owner state such as `hasValue`, `isSubmitting`, `isStreaming`, and `attachmentCount`

That makes it the place to style global draft states such as empty, busy, or attachment-heavy composers.

## `Composer.Input`

`Composer.Input` is a textarea-based primitive that already handles the runtime-specific behaviors that usually make chat inputs fiddly to implement.

It supports:

- binding to the current composer value
- automatic textarea resizing as the draft grows
- `Enter` to submit
- `Shift+Enter` for a new line
- composition tracking for IME input
- focus restoration when the active conversation changes and the previous input unmounts

### IME-safe Enter behavior

The input only submits when all of these are true:

- the key is `Enter`
- `Shift` is not pressed
- the native event is not composing
- no earlier `onKeyDown` handler prevented the default behavior

That means East Asian IME flows stay intact without requiring extra app-level bookkeeping.

### Input example

```tsx
<Composer.Input aria-label="Message" minRows={1} placeholder="Reply in thread" />
```

If you replace the root slot, preserve the textarea-like behavior unless you are intentionally building a different draft surface.

## `Composer.AttachButton`

`Composer.AttachButton` pairs a visible trigger with a hidden file input.

By default it:

- opens the hidden input on click
- accepts multiple files
- adds each selected file into the composer attachment collection
- resets the file input value after selection so the same file can be picked again

The primitive exposes both `root` and `input` slots, which is useful when you want a custom trigger element or need to style the hidden input for a testing harness.

### Attachment example

```tsx
<Composer.AttachButton
  aria-label="Add files"
  slotProps={{
    input: {
      accept: 'image/*,.pdf',
    },
  }}
/>
```

## `Composer.HelperText`

`Composer.HelperText` is the default place for draft-level status and error messaging.

It renders:

- explicit children when you provide them
- otherwise the current runtime error message from the composer context

That makes it a good structural slot for validation copy, transport errors, and retry guidance.

```tsx
<Composer.HelperText>
  Files are uploaded after the message is sent.
</Composer.HelperText>
```

If you omit children, the component falls back to the active runtime error text and returns `null` when there is nothing to show.

## `Composer.SendButton`

`Composer.SendButton` is a submit button that understands composer state.

It disables itself when:

- the draft is empty
- a stream is already active
- the button is disabled externally

The default button type is `submit`, so it works naturally inside `Composer.Root`.

## Slots and owner state

Composer primitives expose `slots` and `slotProps` throughout the surface.
Custom slots receive owner state derived from the composer context, including:

- `hasValue`
- `isSubmitting`
- `isStreaming`
- `attachmentCount`

Use these values for styling patterns such as:

- hiding the send button until a value exists
- emphasizing the attach trigger when attachments are present
- dimming the toolbar while a stream is active

## Adjacent pages

- Continue with [Indicators](/x/react-chat/unstyled/indicators/) to add typing, unread, and scroll affordances around the composer.
- Continue with [Customization](/x/react-chat/unstyled/customization/) for slot and owner-state patterns across the full unstyled surface.
- Continue with [Composer with attachments](/x/react-chat/unstyled/examples/composer-with-attachments/) for the recipe version of this page.
