# X Chat Attachment Object URL Lifecycle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent object URLs created for submitted non-image attachments from leaking after their messages are removed or the composer unmounts.

**Architecture:** Extend `useChatComposer`'s existing message-level object URL ownership to include URLs created while constructing outgoing file parts. Keep non-image draft attachments without `previewUrl`, retain submission-only URLs under failed messages, and revoke partially created submission URLs if part construction throws.

**Tech Stack:** React, TypeScript, Vitest, `@mui/internal-test-utils`, MUI X store hooks.

## Global Constraints

- Keep the public `ChatDraftAttachment` shape and non-image `previewUrl` behavior unchanged.
- Keep changes confined to `useChatComposer` and its existing unit test file.
- Use strict red-green TDD and observe every new regression test fail for the intended reason before changing production code.
- Do not revoke a URL while a stored message still owns and references it.

---

### Task 1: Track submission-created attachment URLs

**Files:**

- Modify: `packages/x-chat-headless/src/hooks/useChatComposer.ts:171-258`
- Test: `packages/x-chat-headless/src/hooks/useChatComposer.test.tsx`

**Interfaces:**

- Consumes: `URL.createObjectURL(file: Blob): string`, `URL.revokeObjectURL(url: string): void`, `ChatStore.removeMessage(id: string): void`.
- Produces: internal message ownership for every object URL created by `useChatComposer`; no public API changes.

- [x] **Step 1: Write the failing lifecycle regression tests**

Add a test that renders both `useChatComposer()` and `useChatStore()`, attaches `doc.pdf`, submits it, confirms the PDF has no draft `previewUrl`, and removes the stored user message:

```tsx
it('revokes a non-image attachment URL when its sent message is removed', async () => {
  const objectUrls = mockObjectUrlApis();

  try {
    const { Wrapper } = createProviderWrapper({
      adapter: createAdapter(),
      initialActiveConversationId: 'c1',
    });
    const { result } = renderHook(
      () => ({ composer: useChatComposer(), store: useChatStore() }),
      { wrapper: Wrapper },
    );

    act(() => {
      result.current.composer.addAttachment(
        new File(['pdf-content'], 'doc.pdf', { type: 'application/pdf' }),
      );
    });

    expect(result.current.composer.attachments[0].previewUrl).toBeUndefined();

    await act(async () => {
      await result.current.composer.submit();
    });

    expect(objectUrls.createObjectURL).toHaveBeenCalledTimes(1);
    expect(objectUrls.revokeObjectURL).not.toHaveBeenCalledWith('blob:doc.pdf-1');

    const userMessage = Object.values(result.current.store.state.messagesById).find(
      (message) => message.role === 'user',
    );
    expect(userMessage).toBeDefined();

    act(() => {
      result.current.store.removeMessage(userMessage!.id);
    });

    await waitFor(() => {
      expect(objectUrls.revokeObjectURL).toHaveBeenCalledWith('blob:doc.pdf-1');
    });
  } finally {
    objectUrls.restore();
  }
});
```

Add a second test for the existing unmount cleanup consumer:

```tsx
it('revokes a submitted non-image attachment URL on unmount', async () => {
  const objectUrls = mockObjectUrlApis();

  try {
    const { Wrapper } = createProviderWrapper({
      adapter: createAdapter(),
      initialActiveConversationId: 'c1',
    });
    const { result, unmount } = renderHook(() => useChatComposer(), {
      wrapper: Wrapper,
    });

    act(() => {
      result.current.addAttachment(
        new File(['pdf-content'], 'doc.pdf', { type: 'application/pdf' }),
      );
    });

    await act(async () => {
      await result.current.submit();
    });

    unmount();

    expect(objectUrls.revokeObjectURL).toHaveBeenCalledWith('blob:doc.pdf-1');
  } finally {
    objectUrls.restore();
  }
});
```

- [x] **Step 2: Run the focused test and verify RED**

Run:

```bash
pnpm test:unit --project "x-chat-headless" --run useChatComposer
```

Expected: both new tests FAIL because `revokeObjectURL` is never called with `blob:doc.pdf-1` after message removal or unmount. Existing tests should remain green.

- [x] **Step 3: Implement message ownership for submission-created URLs**

In `submit`, collect URLs created for attachments without a preview separately while building `parts`, then merge them with draft URLs transferred to message ownership:

```tsx
const submissionCreatedUrls = new Map<string, string>();

for (const attachment of nextAttachments) {
  const url = attachment.previewUrl ?? URL.createObjectURL(attachment.file);

  if (!attachment.previewUrl) {
    submissionCreatedUrls.set(attachment.localId, url);
  }

  parts.push({
    type: 'file',
    mediaType: attachment.file.type || 'application/octet-stream',
    url,
    filename: attachment.file.name,
  });
}

const messageId = createLocalId();
const transferredUrls = submissionCreatedUrls;
for (const attachment of nextAttachments) {
  const ownedUrl = ownedPreviewUrlsRef.current.get(attachment.localId);
  if (ownedUrl) {
    transferredUrls.set(attachment.localId, ownedUrl);
    ownedPreviewUrlsRef.current.delete(attachment.localId);
  }
}
```

When restoring a failed draft, remove only actual draft preview URLs from message ownership; leave submission-created URLs mapped to the failed message:

```tsx
const previouslyTransferred = messageOwnedPreviewUrlsRef.current.get(messageId);

store.setComposerValue(nextValue);
for (const attachment of nextAttachments) {
  store.addComposerAttachment(attachment);

  const previewUrl = attachment.previewUrl;
  if (previewUrl && previouslyTransferred?.get(attachment.localId) === previewUrl) {
    ownedPreviewUrlsRef.current.set(attachment.localId, previewUrl);
    previouslyTransferred.delete(attachment.localId);
  }
}

if (previouslyTransferred?.size === 0) {
  messageOwnedPreviewUrlsRef.current.delete(messageId);
}
```

- [x] **Step 4: Run the focused tests and verify GREEN**

Run:

```bash
pnpm test:unit --project "x-chat-headless" --run useChatComposer
```

Expected: PASS, including the new message-removal regression test.

- [x] **Step 5: Write and verify the failing construction-error regression test**

Configure `createObjectURL` to return one URL and throw for the second PDF. Submit and assert rejection, cleanup of the first URL, and preservation of both draft attachments:

```tsx
it('revokes submission-created URLs when constructing file parts fails', async () => {
  const objectUrls = mockObjectUrlApis();
  objectUrls.createObjectURL
    .mockReturnValueOnce('blob:first.pdf-1')
    .mockImplementationOnce(() => {
      throw new Error('Object URL creation failed');
    });

  try {
    const { Wrapper } = createProviderWrapper({
      adapter: createAdapter(),
      initialActiveConversationId: 'c1',
    });
    const { result } = renderHook(() => useChatComposer(), { wrapper: Wrapper });

    act(() => {
      result.current.addAttachment(
        new File(['first'], 'first.pdf', { type: 'application/pdf' }),
      );
      result.current.addAttachment(
        new File(['second'], 'second.pdf', { type: 'application/pdf' }),
      );
    });

    await expect(result.current.submit()).rejects.toThrow(
      'Object URL creation failed',
    );

    expect(objectUrls.revokeObjectURL).toHaveBeenCalledWith('blob:first.pdf-1');
    expect(result.current.attachments).toHaveLength(2);
  } finally {
    objectUrls.restore();
  }
});
```

Run before adding production cleanup:

```bash
pnpm test:unit --project "x-chat-headless" --run useChatComposer
```

Expected: FAIL because `blob:first.pdf-1` is not revoked; the lifecycle tests from Step 1 remain green.

- [x] **Step 6: Implement construction-error cleanup and verify GREEN**

Wrap the file-part construction loop from Step 3 and revoke only submission-created URLs on error:

```tsx
try {
  for (const attachment of nextAttachments) {
    const url = attachment.previewUrl ?? URL.createObjectURL(attachment.file);

    if (!attachment.previewUrl) {
      submissionCreatedUrls.set(attachment.localId, url);
    }

    parts.push({
      type: 'file',
      mediaType: attachment.file.type || 'application/octet-stream',
      url,
      filename: attachment.file.name,
    });
  }
} catch (error) {
  for (const url of submissionCreatedUrls.values()) {
    revokeAttachmentPreviewUrl(url);
  }
  throw error;
}
```

Rerun:

```bash
pnpm test:unit --project "x-chat-headless" --run useChatComposer
```

Expected: PASS.

- [x] **Step 7: Run package verification**

Run:

```bash
pnpm test:unit --project "x-chat-headless" --run
pnpm --filter "@mui/x-chat-headless" run typescript
pnpm prettier
pnpm eslint
```

Expected: all commands exit 0 with no new failures or diagnostics.

- [x] **Step 8: Prove the regression test detects the production bug**

Temporarily reverse only the production-file changes while leaving the tests in place, then run:

```bash
pnpm test:unit --project "x-chat-headless" --run useChatComposer
```

Expected: the message-removal and unmount assertions fail because `blob:doc.pdf-1` is not revoked, and the construction-failure assertion fails because `blob:first.pdf-1` is not revoked. Restore the production changes and rerun the same command; expected result is PASS.

- [x] **Step 9: Commit the verified fix**

```bash
git add packages/x-chat-headless/src/hooks/useChatComposer.ts packages/x-chat-headless/src/hooks/useChatComposer.test.tsx docs/superpowers/plans/2026-07-22-x-chat-attachment-url-lifecycle.md
git commit -m "fix(x-chat): clean up submitted attachment URLs"
```
