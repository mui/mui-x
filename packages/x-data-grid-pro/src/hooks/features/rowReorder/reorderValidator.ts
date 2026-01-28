import type { ReorderValidationContext } from './models';

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
