export class RowReorderValidator {
    rules;
    constructor(rules) {
        this.rules = rules;
    }
    validate(context) {
        // Check all validation rules
        for (const rule of this.rules) {
            if (rule.applies(context) && rule.isInvalid(context)) {
                return false;
            }
        }
        return true;
    }
}
