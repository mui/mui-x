# X Chat Attachment Object URL Lifecycle

## Problem

`useChatComposer` creates object URLs for image attachments when they enter the draft and tracks those URLs through the draft and message lifecycles. Non-image attachments do not receive draft preview URLs. Instead, `submit` creates an object URL while building the outgoing file part.

That submission-created URL is absent from both ownership maps. It therefore remains allocated after the message is removed or the composer unmounts. Repeatedly sending documents such as PDFs leaks browser memory.

## Design

Keep non-image draft behavior unchanged: non-image attachments will continue to have no `previewUrl`. While constructing an outgoing message, collect every object URL referenced by its file parts:

- Existing image preview URLs transfer from draft ownership to message ownership.
- Object URLs created during submission go directly into message ownership.
- Message-owned URLs remain valid while the message can render or expose its file link.
- Removing the message or unmounting the composer revokes its owned URLs through the existing cleanup paths.

If a failed send restores the draft, only an attachment's actual draft `previewUrl` transfers back to draft ownership. A submission-only URL remains owned by the failed message. This prevents a retry from replacing the tracked URL while leaking a newly created one.

## Error Handling

If constructing message parts throws after creating one or more object URLs, revoke the newly created submission-only URLs before rethrowing. Existing draft preview URLs stay owned by the draft until construction succeeds and ownership transfers.

## Tests

Use `URL.createObjectURL` and `URL.revokeObjectURL` spies in the existing `useChatComposer` tests.

1. Submit a PDF, assert that its object URL is not exposed as a draft preview and is not revoked while the sent message exists, remove the message, and assert that the URL is revoked.
2. Submit a PDF and unmount the hook while the message remains, then assert that its URL is revoked.
3. If needed to cover the failure boundary independently, make a later attachment's URL creation throw and assert that an earlier submission-only URL is revoked while draft preview URLs are retained.

The production change stays confined to `useChatComposer`; no public types or APIs change.
