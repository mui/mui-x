export class DataStudioServerError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'DataStudioServerError';
    this.status = status;
  }
}

export function assertDataStudioRequest(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new DataStudioServerError(message);
  }
}
