import { ReorderValidationContext } from './reorderValidationTypes';

export interface ValidationRule {
  name: string;
  applies: (ctx: ReorderValidationContext) => boolean;
  isInvalid: (ctx: ReorderValidationContext) => boolean;
  message?: string;
}

export class RowReorderValidator {
  private rules: ValidationRule[];

  constructor(rules: ValidationRule[]) {
    this.rules = rules;
  }

  addRule(rule: ValidationRule): void {
    this.rules.push(rule);
  }

  removeRule(ruleName: string): void {
    this.rules = this.rules.filter((r) => r.name !== ruleName);
  }

  validate(context: ReorderValidationContext): boolean {
    // Check all validation rules
    for (const rule of this.rules) {
      if (rule.applies(context) && rule.isInvalid(context)) {
        return false;
      }
    }

    return true;
  }
}
