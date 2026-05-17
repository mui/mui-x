import path from 'path';
import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import readFile from '../../../util/readFile';

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
const NESTED_MAP: Record<string, { family: string; newKey: string }> = {
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

// Family-name keys whose values may already be the nested object shape (idempotent).
// When the property's value is an ObjectExpression, keep it as-is and merge with any
// additional sub-keys lifted in this pass. When it's anything else (component, function,
// JSX), treat it as the wrapper-only `family.root` override.
const FAMILY_ROOT_MAP: Record<string, string> = {
  conversation: 'conversation',
  messagesList: 'messagesList',
  message: 'message',
  composer: 'composer',
};

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
      existingProp: any | null;
    };
    const buckets: Record<string, FamilyBucket> = {
      conversation: { existingObject: null, additions: [], existingProp: null },
      messagesList: { existingObject: null, additions: [], existingProp: null },
      message: { existingObject: null, additions: [], existingProp: null },
      composer: { existingObject: null, additions: [], existingProp: null },
    };

    expr.properties.forEach((prop: any) => {
      const keyName = getPropertyKeyName(prop);
      if (!keyName) {
        outerProps.push(prop);
        return;
      }

      // Idempotency / wrapper-only lift: a family-name key whose value is an
      // ObjectExpression is already in the new nested shape — preserve it and
      // merge with any sub-keys we lift in this pass.
      const familyForKey = FAMILY_ROOT_MAP[keyName];
      if (familyForKey) {
        if (prop.value && prop.value.type === 'ObjectExpression') {
          buckets[familyForKey].existingObject = prop.value;
          buckets[familyForKey].existingProp = prop;
        } else {
          // Non-object value (component / function / JSX) — wrapper-only override
          // for that family. Lift to `family: { root: <value> }`.
          const newProp = j.property('init', j.identifier('root'), prop.value);
          newProp.shorthand = false;
          buckets[familyForKey].additions.push(newProp);
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

      // Unknown key — leave it alone so the codemod is a no-op for unrelated props.
      outerProps.push(prop);
    });

    // Reassemble: outer props in source order, then each family bucket (if any).
    const familyOrder: ReadonlyArray<keyof typeof buckets> = [
      'conversation',
      'messagesList',
      'message',
      'composer',
    ];

    const familyProps: any[] = [];
    familyOrder.forEach((family) => {
      const bucket = buckets[family];
      if (!bucket.existingObject && bucket.additions.length === 0) {
        return;
      }
      let familyObject: any;
      if (bucket.existingObject) {
        familyObject = bucket.existingObject;
        // Merge new additions into the existing object; skip keys already present
        // so idempotency holds when running on already-migrated code.
        bucket.additions.forEach((addProp) => {
          const addedKeyName = getPropertyKeyName(addProp);
          if (!addedKeyName) {
            familyObject.properties.push(addProp);
            return;
          }
          const exists = familyObject.properties.some(
            (existing: any) => getPropertyKeyName(existing) === addedKeyName,
          );
          if (!exists) {
            familyObject.properties.push(addProp);
          }
        });
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
