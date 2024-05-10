const { ESLintUtils, AST_NODE_TYPES } = require('@typescript-eslint/utils');

const createESLintRule = ESLintUtils.RuleCreator(() => ``);

function checkIsAccessingMember(maybeMemberExpression, propertyName) {
  if (!maybeMemberExpression) {
    return undefined;
  }
  if (maybeMemberExpression.type === AST_NODE_TYPES.MemberExpression) {
    const property = maybeMemberExpression.property;
    if (property.type === AST_NODE_TYPES.Identifier && property.name === propertyName) {
      return maybeMemberExpression.object;
    }
  }
  return undefined;
}

function reportIfDirectlyAccessingState(node, context, nodeToReport = node) {
  const maybeApiRef = checkIsAccessingMember(checkIsAccessingMember(node, 'state'), 'current');

  if (maybeApiRef && maybeApiRef.type !== AST_NODE_TYPES.Identifier) {
    return;
  }

  const { parserServices } = context.sourceCode;
  const checker = parserServices.program.getTypeChecker();

  const originalNode = parserServices.esTreeNodeToTSNodeMap.get(maybeApiRef);
  const nodeType = checker.getTypeAtLocation(originalNode);

  if (nodeType.aliasSymbol && nodeType.aliasSymbol.escapedName === 'GridApiRef') {
    context.report({ node: nodeToReport, messageId: 'direct-access' });
  }
}

const rule = createESLintRule({
  name: 'no-direct-state-access',
  meta: {
    type: 'problem',
    messages: {
      'direct-access': "Don't access directly state values. Prefer a selector.",
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      // Checks `const rows = apiRef.current.state.rows;`
      MemberExpression(node) {
        // We can ignore the rightmost path since it doesn't make difference.
        // We're only interested in the nodes after it.
        // apiRef.current.state.rows
        // ^^^^^^^^^^^^^^^^^^^^
        if (node.parent && node.parent.type === AST_NODE_TYPES.MemberExpression) {
          reportIfDirectlyAccessingState(node, context);
        }
      },
      // Checks `const { rows } = apiRef.current.state;`
      VariableDeclarator(node) {
        // Ensure that the variable id is of form `const { foo } = obj;`
        if (node.id.type === AST_NODE_TYPES.ObjectPattern) {
          if (node.init.type === AST_NODE_TYPES.MemberExpression) {
            reportIfDirectlyAccessingState(node.init, context, node);
          }
        }
      },
    };
  },
});

module.exports = rule;
