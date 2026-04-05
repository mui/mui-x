---
title: Chat - Composer
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Composer

<p class="description">Build a custom draft area with attachments, preview URLs, and IME-safe submit behavior.</p>

This demo uses `useChatComposer()` directly with plain DOM controls to demonstrate the full draft lifecycle:

- draft value management
- file attachment add and remove
- image preview URLs with automatic cleanup
- IME composition tracking
- submit and clear behavior

## Key concepts

### The `useChatComposer()` hook

`useChatComposer()` returns everything needed to build a custom draft area:

```tsx
const composer = useChatComposer();

// Draft text
composer.value; // current text
composer.setValue('hello'); // update text

// Attachments
composer.attachments; // ChatDraftAttachment[]
composer.addAttachment(file); // add a file
composer.removeAttachment(localId); // remove by local ID

// Actions
composer.submit(); // send the message
composer.clear(); // clear text and attachments
composer.isSubmitting; // true while a stream is active
```

### Attachment preview URLs

When you add an image file, `useChatComposer()` automatically creates an object URL via `URL.createObjectURL()`.
The URL is available on `attachment.previewUrl` for rendering inline previews:

```tsx
{
  composer.attachments.map((attachment) => (
    <div key={attachment.localId}>
      {attachment.previewUrl && (
        <img src={attachment.previewUrl} alt={attachment.file.name} />
      )}
      <span>{attachment.file.name}</span>
      <button onClick={() => composer.removeAttachment(attachment.localId)}>
        Remove
      </button>
    </div>
  ));
}
```

Preview URLs are revoked automatically when:

- the attachment is removed
- the composer is cleared
- the component unmounts

### IME-safe submission

For East Asian input methods, the composer tracks IME composition state.
`submit()` blocks while an IME session is active, preventing accidental sends during text composition.

Wire composition events on your input element:

```tsx
<textarea
  onCompositionStart={() => store.setComposerIsComposing(true)}
  onCompositionEnd={() => store.setComposerIsComposing(false)}
  onKeyDown={(event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      composer.submit();
    }
  }}
/>
```

{{"demo": "ComposerHeadlessChat.js"}}

## Key takeaways

- `useChatComposer()` manages the full draft lifecycle without any UI opinions
- Image preview URLs are created and cleaned up automatically
- IME composition tracking prevents accidental submission during text input
- `submit()` also blocks while a stream is already active, preventing double sends

## See also

- [Hooks](/x/react-chat/headless/hooks/) for the full `useChatComposer()` API reference
- [Streaming lifecycle](/x/react-chat/headless/examples/streaming-lifecycle/) for what happens after submission
- [Minimal headless chat](/x/react-chat/headless/examples/minimal-chat/) for a simpler draft pattern without `useChatComposer()`

## API

- [ChatRoot](/x/api/chat/chat-root/)
