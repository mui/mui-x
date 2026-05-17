import path from 'path';
import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import readFile from '../../../util/readFile';

type Family = 'conversation' | 'messagesList' | 'message' | 'composer';

const FAMILIES = ['conversation', 'messagesList', 'message', 'composer'] as const;

// Top-level keys that stay flat in the new nested vocabulary.
const FLAT_KEYS = new Set([
  'root',
  'layout',
  'conversationsPane',
  'threadPane',
  'typingIndicator',
  'scrollToBottom',
  'suggestions',
  'emptyState',
]);

// Maps any legacy slot key (pre-rename `messageAvatar`, post-rename `avatar`,
// or pre-rename family-root `composerRoot`) onto its nested destination.
const NESTED_MAP: Record<string, { family: Family; newKey: string }> = {
  // ---- conversation family ----
  conversationList: { family: 'conversation', newKey: 'list' },
  conversationHeader: { family: 'conversation', newKey: 'header' },
  conversationTitle: { family: 'conversation', newKey: 'title' },
  conversationSubtitle: { family: 'conversation', newKey: 'subtitle' },
  conversationHeaderInfo: { family: 'conversation', newKey: 'headerInfo' },
  conversationHeaderActions: { family: 'conversation', newKey: 'headerActions' },

  // ---- messagesList family ----
  messageList: { family: 'messagesList', newKey: 'root' },
  messageGroup: { family: 'messagesList', newKey: 'group' },
  group: { family: 'messagesList', newKey: 'group' },
  dateDivider: { family: 'messagesList', newKey: 'dateDivider' },
  unreadMarker: { family: 'messagesList', newKey: 'unreadMarker' },

  // ---- message family (pre-rename) ----
  messageRoot: { family: 'message', newKey: 'root' },
  messageAvatar: { family: 'message', newKey: 'avatar' },
  messageContent: { family: 'message', newKey: 'content' },
  messageMeta: { family: 'message', newKey: 'meta' },
  messageActions: { family: 'message', newKey: 'actions' },

  // ---- message family (post-flat-rename) ----
  avatar: { family: 'message', newKey: 'avatar' },
  content: { family: 'message', newKey: 'content' },
  meta: { family: 'message', newKey: 'meta' },
  inlineMeta: { family: 'message', newKey: 'inlineMeta' },
  error: { family: 'message', newKey: 'error' },
  actions: { family: 'message', newKey: 'actions' },
  authorName: { family: 'message', newKey: 'authorName' },

  // ---- composer family (pre-rename) ----
  composerRoot: { family: 'composer', newKey: 'root' },
  composerInput: { family: 'composer', newKey: 'input' },
  composerSendButton: { family: 'composer', newKey: 'send' },
  composerAttachButton: { family: 'composer', newKey: 'attach' },
  composerAttachmentList: { family: 'composer', newKey: 'attachmentList' },
  composerToolbar: { family: 'composer', newKey: 'toolbar' },
  composerHelperText: { family: 'composer', newKey: 'helperText' },

  // ---- composer family (post-flat-rename) ----
  input: { family: 'composer', newKey: 'input' },
  send: { family: 'composer', newKey: 'send' },
  attach: { family: 'composer', newKey: 'attach' },
  attachmentList: { family: 'composer', newKey: 'attachmentList' },
  toolbar: { family: 'composer', newKey: 'toolbar' },
  helperText: { family: 'composer', newKey: 'helperText' },
};

// Family-name keys whose value may already be the nested object shape — idempotency:
// preserve the existing object and merge any sub-keys lifted in this pass into it.
// A non-object value (component / JSX) is treated as the wrapper-only `family.root` override.
const FAMILY_KEYS = new Set<string>(FAMILIES);

// Slot attributes we transform. Renaming everywhere would clash with locale-text keys.
const SLOT_ATTRIBUTE_NAMES = new Set(['slots', 'slotProps']);

// JSX element names whose `slots` / `slotProps` shape changed to the nested
// vocabulary. Limiting the transform to these names keeps the codemod from
// touching headless components (`MessageGroup`, `Message.Root`, …) whose slot
// keys happen to collide with ChatBox's flat keys (`group`, `authorName`, …).
const TARGET_JSX_NAMES = new Set([
  'ChatBox',
  'ChatMessageList',
  'ChatMessageGroup',
  'ChatMessage',
  'ChatComposer',
  'ChatConversation',
]);

function getJSXElementName(openingElement: any): string | null {
  const name = openingElement?.name;
  if (!name) {
    return null;
  }
  if (name.type === 'JSXIdentifier') {
    return name.name;
  }
  // <Foo.Bar /> — use the property name; covers e.g. `ChatBox.Root` if added.
  if (name.type === 'JSXMemberExpression' && name.property?.type === 'JSXIdentifier') {
    return name.property.name;
  }
  return null;
}

function getPropertyKeyName(prop: any): string | null {
  if (!prop || (prop.type !== 'ObjectProperty' && prop.type !== 'Property')) {
    return null;
  }
  if (prop.computed) {
    return null;
  }
  const key = prop.key;
  if (!key) {
    return null;
  }
  if (key.type === 'Identifier') {
    return key.name;
  }
  if (key.type === 'StringLiteral') {
    return key.value;
  }
  if (key.type === 'Literal' && typeof key.value === 'string') {
    return key.value;
  }
  return null;
}

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  root.find(j.JSXAttribute).forEach((attrPath) => {
    const node = attrPath.node;
    const attrName = node.name && node.name.type === 'JSXIdentifier' ? node.name.name : null;
    if (!attrName || !SLOT_ATTRIBUTE_NAMES.has(attrName)) {
      return;
    }
    // Walk up to the JSXOpeningElement so we can scope by component name.
    const openingElement = attrPath.parent?.node;
    if (!openingElement || openingElement.type !== 'JSXOpeningElement') {
      return;
    }
    const jsxName = getJSXElementName(openingElement);
    if (!jsxName || !TARGET_JSX_NAMES.has(jsxName)) {
      return;
    }
    if (!node.value || node.value.type !== 'JSXExpressionContainer') {
      return;
    }
    const expr = node.value.expression;
    if (!expr || expr.type !== 'ObjectExpression') {
      return;
    }

    const outerProps: any[] = [];
    type FamilyBucket = {
      existingObject: any | null;
      additions: any[];
    };
    const buckets: Record<Family, FamilyBucket> = {
      conversation: { existingObject: null, additions: [] },
      messagesList: { existingObject: null, additions: [] },
      message: { existingObject: null, additions: [] },
      composer: { existingObject: null, additions: [] },
    };

    expr.properties.forEach((prop: any) => {
      const keyName = getPropertyKeyName(prop);
      if (!keyName) {
        outerProps.push(prop);
        return;
      }

      // Family-name key with an ObjectExpression value is the already-nested
      // shape (idempotency). A non-object value is treated as wrapper-only
      // `family.root` so consumers don't lose the override.
      if (FAMILY_KEYS.has(keyName)) {
        const family = keyName as Family;
        if (prop.value && prop.value.type === 'ObjectExpression') {
          buckets[family].existingObject = prop.value;
        } else {
          const newProp = j.property('init', j.identifier('root'), prop.value);
          newProp.shorthand = false;
          buckets[family].additions.push(newProp);
        }
        return;
      }

      if (FLAT_KEYS.has(keyName)) {
        outerProps.push(prop);
        return;
      }

      const mapping = NESTED_MAP[keyName];
      if (mapping) {
        const newProp = j.property('init', j.identifier(mapping.newKey), prop.value);
        newProp.shorthand = false;
        buckets[mapping.family].additions.push(newProp);
        return;
      }

      // Unknown key — pass through so the codemod is a no-op for unrelated props.
      outerProps.push(prop);
    });

    const familyProps: any[] = [];
    FAMILIES.forEach((family) => {
      const bucket = buckets[family];
      if (!bucket.existingObject && bucket.additions.length === 0) {
        return;
      }
      let familyObject: any;
      if (bucket.existingObject) {
        // Build a fresh ObjectExpression to avoid mutating the consumer's AST.
        // Skip additions whose key already exists so idempotency holds.
        const existingProps = bucket.existingObject.properties as any[];
        const existingKeys = new Set(existingProps.map(getPropertyKeyName).filter(Boolean));
        const merged = [
          ...existingProps,
          ...bucket.additions.filter((addProp) => {
            const name = getPropertyKeyName(addProp);
            return !name || !existingKeys.has(name);
          }),
        ];
        familyObject = j.objectExpression(merged);
      } else {
        familyObject = j.objectExpression(bucket.additions);
      }
      const familyProp = j.property('init', j.identifier(family), familyObject);
      familyProp.shorthand = false;
      familyProps.push(familyProp);
    });

    expr.properties = [...outerProps, ...familyProps];
  });

  return root.toSource(printOptions);
}

export const testConfig = () => ({
  name: 'migrate-slots',
  specFiles: [
    {
      name: 'lifts flat slot keys into nested families',
      actual: readFile(path.join(import.meta.dirname, 'actual.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected.spec.tsx')),
    },
    {
      name: 'migrates pre-rename flat keys directly to nested',
      actual: readFile(path.join(import.meta.dirname, 'pre-rename.actual.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'pre-rename.expected.spec.tsx')),
    },
  ],
});
