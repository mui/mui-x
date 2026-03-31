export class GridGetRowsError extends Error {
    /**
     * The parameters used in the failed request
     */
    params;
    /**
     * The original error that caused this error
     */
    cause;
    constructor(options) {
        super(options.message);
        this.name = 'GridGetRowsError';
        this.params = options.params;
        this.cause = options.cause;
    }
}
export class GridUpdateRowError extends Error {
    /**
     * The parameters used in the failed request
     */
    params;
    /**
     * The original error that caused this error
     */
    cause;
    constructor(options) {
        super(options.message);
        this.name = 'GridUpdateRowError';
        this.params = options.params;
        this.cause = options.cause;
    }
}
