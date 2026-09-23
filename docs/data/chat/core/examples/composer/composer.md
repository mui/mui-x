---
title: Chat - Composer
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Composer

<p class="description">Build a custom draft area with attachments, preview URLs, and IME-safe submit behavior.</p>

Call `useChatComposer()` directly with plain DOM controls to manage the full draft lifecycle:

- Draft value management.
- File attachment add and remove.
- Image preview URLs with automatic cleanup.
- IME composition tracking.
- Submit and clear behavior.

## Accessing composer state with a hook

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

## Tracking attachment previews

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

- The attachment is removed.
- The composer is cleared.
- The component unmounts.

## Handling IME-safe submission

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

The demo below shows the full composer wired up with attachments, image previews, and IME-safe submission:

{{"demo": "ComposerHeadlessChat.js"}}

## See also

- See [Hooks—`useChatComposer()`](/x/react-chat/core/hooks/#usechatcomposer) for the full API reference.
- See [Streaming lifecycle](/x/react-chat/core/examples/streaming-lifecycle/) for details on what happens after submission.
- See [Minimal core chat](/x/react-chat/core/examples/minimal-chat/) for a simpler draft pattern.

## API

- [`ChatRoot`](/x/api/chat/chat-root/)
