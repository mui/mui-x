# Review Scope

Branch: `x-chat-docs-overview-gallery`

HEAD: `ba653b0600f6cecea5e7e1c00469c3923ebcf940`

Review base used: `upstream/master` at `27222bc794d2966051f3c6e3117f7cce732a13a2`.

I did not use `origin/master` as the branch base because it is stale in this checkout:

- `origin/master`: `f8e4bf86a8143f85b2c015211e7404da8e006f05`
- `git diff origin/master...HEAD`: 1168 files, mostly unrelated upstream drift
- `git diff upstream/master...HEAD`: 523 files, 27264 insertions, 5594 deletions

Extra working-tree scope on top of the branch:

- Modified: `docs/data/chat/basics/chatbox/ChatBoxPlayground.js`
- Modified: `docs/data/chat/basics/chatbox/ChatBoxPlayground.tsx`
- Modified: `docs/src/modules/components/chat-playground/PlaygroundCard.tsx`
- Modified: `docs/src/modules/components/overview/chat/mainDemo/MainDemo.tsx`
- Modified: `packages/x-chat/src/ChatIndicators/ChatUnreadMarker.tsx`
- Untracked scratch artifacts at repo root: `.vale-temp.XXXXXX.ini`, multiple `*.jpeg`, `*.json`, `playground-props-variations.html`, and `thoughts/`

I reviewed the branch delta plus the dirty tracked diff. The generated `.js` demo companions and API JSON files were treated as mirrors of the TypeScript/docs source unless the source/generated relationship was itself the problem.

Primary implementation areas reviewed:

- `packages/x-chat/src/ChatBox/*`
- `packages/x-chat/src/ChatMessageList/*`
- `packages/x-chat/src/ChatConversationList/*`
- `packages/x-chat/src/ChatMessage/*`
- `packages/x-chat/src/ChatComposer/*`
- `packages/x-chat-headless/src/message-group/MessageGroup.tsx`
- `docs/src/modules/components/chat-playground/*`
- `docs/src/modules/chat-gallery/*`
- `docs/data/chat/**/*`

Commands used for scope:

- `rtk git branch --show-current`
- `rtk git rev-parse HEAD`
- `rtk git rev-parse origin/master upstream/master`
- `rtk git merge-base origin/master HEAD`
- `rtk git merge-base upstream/master HEAD`
- `rtk git diff --stat upstream/master...HEAD`
- `rtk git diff --name-status upstream/master...HEAD`
- `rtk git diff`
- `rtk git status --porcelain=v1`
