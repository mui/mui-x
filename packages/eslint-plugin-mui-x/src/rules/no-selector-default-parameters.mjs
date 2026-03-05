/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'problem',
    messages: {
      'no-default-param':
        'Default parameters in selector combiners break memoization because Function.length ignores them. Pass the default value at the call site instead.',
    },
    schema: [],
  },
  create(context) {
    const SELECTOR_FUNCTIONS = new Set([
      'createSelector',
      'createSelectorMemoized',
    ]);

    /**
     * Check if any parameters of a function node use default values (AssignmentPattern).
     * Reports each parameter that has a default.
     */
    function checkFunctionParams(node) {
      for (const param of node.params) {
        reportDefaultPatterns(param);
      }
    }

    /**
     * Recursively find and report AssignmentPattern nodes within a parameter.
     */
    function reportDefaultPatterns(node) {
      if (node.type === 'AssignmentPattern') {
        context.report({ node, messageId: 'no-default-param' });
        // Also check the left side for nested defaults (e.g. { field = 'name' } = {})
        reportDefaultPatterns(node.left);
      } else if (node.type === 'ObjectPattern') {
        for (const prop of node.properties) {
          reportDefaultPatterns(prop.type === 'Property' ? prop.value : prop);
        }
      } else if (node.type === 'ArrayPattern') {
        for (const element of node.elements) {
          if (element) {
            reportDefaultPatterns(element);
          }
        }
      }
    }

    /**
     * Given call arguments, check if the last argument is a function with default params.
     */
    function checkLastArg(args) {
      if (args.length === 0) {
        return;
      }
      const lastArg = args[args.length - 1];
      if (
        lastArg.type === 'ArrowFunctionExpression' ||
        lastArg.type === 'FunctionExpression'
      ) {
        checkFunctionParams(lastArg);
      }
    }

    return {
      CallExpression(node) {
        const { callee } = node;

        // createSelector(...) or createSelectorMemoized(...)
        if (callee.type === 'Identifier' && SELECTOR_FUNCTIONS.has(callee.name)) {
          checkLastArg(node.arguments);
          return;
        }

        // createSelectorMemoizedWithOptions()(...) — the outer call returns a function that is then called
        if (
          callee.type === 'CallExpression' &&
          callee.callee.type === 'Identifier' &&
          callee.callee.name === 'createSelectorMemoizedWithOptions'
        ) {
          checkLastArg(node.arguments);
        }
      },
    };
  },
};

export default rule;
