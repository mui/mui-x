import { ESLintUtils, AST_NODE_TYPES } from '@typescript-eslint/utils';

const createESLintRule = ESLintUtils.RuleCreator(() => ``);

// Keys that Babel inlines instead of memoizing into a temporary variable.
const INLINED_KEY_TYPES = new Set([AST_NODE_TYPES.Identifier, AST_NODE_TYPES.Literal]);

const rule = createESLintRule({
  name: 'no-computed-key-with-rest',
  meta: {
    type: 'problem',
    messages: {
      'computed-key':
        "Computed key next to a rest element. Babel's loose object rest transform drops the key when the destructured binding is unused, so the built code excludes nothing. Assign the key to a variable first and use that variable as the key.",
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      // See https://github.com/babel/babel/issues/18196
      ObjectPattern(node) {
        if (!node.properties.some((property) => property.type === AST_NODE_TYPES.RestElement)) {
          return;
        }

        for (const property of node.properties) {
          if (
            property.type === AST_NODE_TYPES.Property &&
            property.computed &&
            !INLINED_KEY_TYPES.has(property.key.type)
          ) {
            context.report({ node: property.key, messageId: 'computed-key' });
          }
        }
      },
    };
  },
});

export default rule;
