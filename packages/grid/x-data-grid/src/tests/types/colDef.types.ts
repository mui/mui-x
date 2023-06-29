import { Equal, Expect } from './typesTestsUtils';
import { getGridNumericOperators } from '../../colDef/gridNumericOperators';
import { getGridStringOperators } from '../../colDef/gridStringOperators';
import { getGridBooleanOperators } from '../../colDef/gridBooleanOperators';
import { getGridSingleSelectOperators } from '../../colDef/gridSingleSelectOperators';
import { getGridDateOperators } from '../../colDef/gridDateOperators';

export declare namespace Tests_getGridNumericOperators {
  type ResolvedValue = ReturnType<typeof getGridNumericOperators>[number]['value'];

  // Make sure the return type for "value" is correct and not simply "string"
  type Test = Expect<
    Equal<
      ResolvedValue,
      '<=' | 'isEmpty' | 'isNotEmpty' | 'isAnyOf' | '=' | '!=' | '>' | '>=' | '<'
    >
  >;
}

export declare namespace Tests_getGridStringOperators {
  type ResolvedValue = ReturnType<typeof getGridStringOperators>[number]['value'];

  // Make sure the return type for "value" is correct and not simply "string"
  type Test = Expect<
    Equal<
      ResolvedValue,
      'isEmpty' | 'isNotEmpty' | 'isAnyOf' | 'contains' | 'equals' | 'startsWith' | 'endsWith'
    >
  >;
}

export declare namespace Tests_getGridBooleanOperators {
  type ResolvedValue = ReturnType<typeof getGridBooleanOperators>[number]['value'];

  // Make sure the return type for "value" is correct and not simply "string"
  type Test = Expect<Equal<ResolvedValue, 'is'>>;
}

export declare namespace Tests_getGridSingleSelectOperators {
  type ResolvedValue = ReturnType<typeof getGridSingleSelectOperators>[number]['value'];

  // Make sure the return type for "value" is correct and not simply "string"
  type Test = Expect<Equal<ResolvedValue, 'isAnyOf' | 'is' | 'not'>>;
}

export declare namespace Tests_getGridDateOperators {
  type ResolvedValue = ReturnType<typeof getGridDateOperators>[number]['value'];

  // Make sure the return type for "value" is correct and not simply "string"
  type Test = Expect<
    Equal<
      ResolvedValue,
      'isEmpty' | 'isNotEmpty' | 'is' | 'not' | 'after' | 'onOrAfter' | 'before' | 'onOrBefore'
    >
  >;
}
