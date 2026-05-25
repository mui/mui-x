import {
  DATA_STUDIO_PROTOCOL_VERSION,
  type DataStudioCreateRowRequest,
  type DataStudioDeleteRowRequest,
  type DataStudioEndpointAction,
  type DataStudioRowsRequest,
  type DataStudioUpdateRowRequest,
} from '../models';
import { DataStudioServerError } from './errors';
import type {
  DataStudioEndpointRequest,
  DataStudioEndpointResponse,
  DataStudioRequestContext,
  DataStudioServer,
} from './types';

const ACTION_ALIASES: Record<string, DataStudioEndpointAction> = {
  schema: 'schema',
  _schema: 'schema',
  rows: 'rows',
  get: 'rows',
  createRow: 'createRow',
  'create-row': 'createRow',
  create: 'createRow',
  updateRow: 'updateRow',
  'update-row': 'updateRow',
  update: 'updateRow',
  deleteRow: 'deleteRow',
  'delete-row': 'deleteRow',
  delete: 'deleteRow',
};

function getAction(request: DataStudioEndpointRequest): DataStudioEndpointAction {
  if (request.action) {
    return request.action;
  }

  const url = new URL(request.url ?? '/', 'http://localhost');
  const action = url.searchParams.get('action');
  const pathname = url.pathname.replace(/\/+$/, '');

  if (action && ACTION_ALIASES[action]) {
    return ACTION_ALIASES[action];
  }

  const pathAction = ACTION_ALIASES[pathname.split('/').at(-1) ?? ''];
  if (pathAction) {
    return pathAction;
  }

  throw new DataStudioServerError(
    `MUI X Data Studio: Missing Data Studio endpoint action.
This prevents the server from choosing between schema discovery and row loading.
Use a /schema, /rows, /create-row, /update-row, or /delete-row endpoint, or pass an action query parameter.`,
  );
}

async function readBody(request: DataStudioEndpointRequest) {
  if (request.body !== undefined) {
    return request.body;
  }

  if (request.json) {
    return request.json();
  }

  return undefined;
}

function assertMethod(request: DataStudioEndpointRequest, expectedMethod: string, action: string) {
  const method = request.method?.toUpperCase() ?? 'GET';

  if (method !== expectedMethod) {
    throw new DataStudioServerError(
      `MUI X Data Studio: The ${action} endpoint received ${method}, but expected ${expectedMethod}.
This prevents the endpoint from handling the Data Studio protocol request.
Use ${expectedMethod} for the ${action} endpoint.`,
      405,
    );
  }
}

function normalizeBaseRequest(body: unknown, action: DataStudioEndpointAction) {
  if (!body || typeof body !== 'object') {
    throw new DataStudioServerError(
      `MUI X Data Studio: The ${action} endpoint received an invalid request body.
This prevents the server from reading the Data Studio request payload.
Send a JSON Data Studio protocol payload.`,
    );
  }

  const request = body as Partial<
    | DataStudioRowsRequest
    | DataStudioCreateRowRequest
    | DataStudioUpdateRowRequest
    | DataStudioDeleteRowRequest
  >;

  if (request.version !== DATA_STUDIO_PROTOCOL_VERSION) {
    throw new DataStudioServerError(
      `MUI X Data Studio: Unsupported protocol version "${String(request.version)}".
This prevents the server from safely handling the Data Studio request.
Use Data Studio protocol version ${DATA_STUDIO_PROTOCOL_VERSION}.`,
    );
  }

  return request;
}

function normalizeRowsRequest(body: unknown): DataStudioRowsRequest {
  const request = normalizeBaseRequest(body, 'rows') as Partial<DataStudioRowsRequest>;

  if (!request.dataSourceId || !request.params) {
    throw new DataStudioServerError(
      `MUI X Data Studio: The rows endpoint request is missing dataSourceId or params.
This prevents the server from routing and translating the Data Grid request.
Send both dataSourceId and GridGetRowsParams in the JSON body.`,
    );
  }

  return request as DataStudioRowsRequest;
}

function normalizeCreateRowRequest(body: unknown): DataStudioCreateRowRequest {
  const request = normalizeBaseRequest(body, 'createRow') as Partial<DataStudioCreateRowRequest>;

  if (!request.dataSourceId || !request.row) {
    throw new DataStudioServerError(
      `MUI X Data Studio: The createRow endpoint request is missing dataSourceId or row.
This prevents the server from creating the row.
Send both dataSourceId and row in the JSON body.`,
    );
  }

  return request as DataStudioCreateRowRequest;
}

function normalizeUpdateRowRequest(body: unknown): DataStudioUpdateRowRequest {
  const request = normalizeBaseRequest(body, 'updateRow') as Partial<DataStudioUpdateRowRequest>;

  if (!request.dataSourceId || !request.params) {
    throw new DataStudioServerError(
      `MUI X Data Studio: The updateRow endpoint request is missing dataSourceId or params.
This prevents the server from updating the row.
Send both dataSourceId and GridUpdateRowParams in the JSON body.`,
    );
  }

  return request as DataStudioUpdateRowRequest;
}

function normalizeDeleteRowRequest(body: unknown): DataStudioDeleteRowRequest {
  const request = normalizeBaseRequest(body, 'deleteRow') as Partial<DataStudioDeleteRowRequest>;

  if (!request.dataSourceId || request.rowId == null) {
    throw new DataStudioServerError(
      `MUI X Data Studio: The deleteRow endpoint request is missing dataSourceId or rowId.
This prevents the server from deleting the row.
Send both dataSourceId and rowId in the JSON body.`,
    );
  }

  return request as DataStudioDeleteRowRequest;
}

function jsonResponse(status: number, body: unknown): DataStudioEndpointResponse {
  return {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return String(error);
}

function reportEndpointError(params: {
  action: DataStudioEndpointAction | undefined;
  dataSourceId: string | undefined;
  error: unknown;
}) {
  const context = {
    action: params.action,
    dataSourceId: params.dataSourceId,
  };

  console.error('MUI X Data Studio: Endpoint request failed.', context, params.error);
}

function createUnexpectedEndpointErrorResponse(
  action: DataStudioEndpointAction | undefined,
  dataSourceId: string | undefined,
  error: unknown,
) {
  const actionLabel = action ?? 'unknown';
  const dataSourceLabel = dataSourceId ? ` for data source "${dataSourceId}"` : '';

  return jsonResponse(500, {
    error: `MUI X Data Studio: The ${actionLabel} endpoint failed${dataSourceLabel}.
${getErrorMessage(error)}`,
  });
}

export async function createDataStudioEndpointResponse<
  TContext extends DataStudioRequestContext = DataStudioRequestContext,
>(
  server: DataStudioServer<TContext>,
  request: DataStudioEndpointRequest,
): Promise<DataStudioEndpointResponse> {
  let action: DataStudioEndpointAction | undefined;
  let dataSourceId: string | undefined;

  try {
    action = getAction(request);

    if (action === 'schema') {
      assertMethod(request, 'GET', action);
      const result = await server.runRequest({ operation: action, request }, (context) =>
        server.getSchema(context),
      );
      return jsonResponse(200, result);
    }

    assertMethod(request, 'POST', action);
    const body = await readBody(request);

    if (action === 'rows') {
      const rowsRequest = normalizeRowsRequest(body);
      dataSourceId = rowsRequest.dataSourceId;
      const result = await server.runRequest(
        {
          operation: action,
          request,
          dataSourceId: rowsRequest.dataSourceId,
          body: rowsRequest,
        },
        (context) => server.getRows(rowsRequest.dataSourceId, rowsRequest.params, context),
      );
      return jsonResponse(200, result);
    }

    if (action === 'createRow') {
      const createRowRequest = normalizeCreateRowRequest(body);
      dataSourceId = createRowRequest.dataSourceId;
      const result = await server.runRequest(
        {
          operation: action,
          request,
          dataSourceId: createRowRequest.dataSourceId,
          body: createRowRequest,
        },
        (context) =>
          server.createRow(createRowRequest.dataSourceId, { row: createRowRequest.row }, context),
      );
      return jsonResponse(200, result);
    }

    if (action === 'updateRow') {
      const updateRowRequest = normalizeUpdateRowRequest(body);
      dataSourceId = updateRowRequest.dataSourceId;
      const result = await server.runRequest(
        {
          operation: action,
          request,
          dataSourceId: updateRowRequest.dataSourceId,
          body: updateRowRequest,
        },
        (context) =>
          server.updateRow(updateRowRequest.dataSourceId, updateRowRequest.params, context),
      );
      return jsonResponse(200, result);
    }

    const deleteRowRequest = normalizeDeleteRowRequest(body);
    dataSourceId = deleteRowRequest.dataSourceId;
    const result = await server.runRequest(
      {
        operation: action,
        request,
        dataSourceId: deleteRowRequest.dataSourceId,
        body: deleteRowRequest,
      },
      (context) =>
        server.deleteRow(
          deleteRowRequest.dataSourceId,
          { rowId: deleteRowRequest.rowId, row: deleteRowRequest.row },
          context,
        ),
    );
    return jsonResponse(200, result);
  } catch (error) {
    if (error instanceof DataStudioServerError) {
      return jsonResponse(error.status, { error: error.message });
    }

    reportEndpointError({ action, dataSourceId, error });
    return createUnexpectedEndpointErrorResponse(action, dataSourceId, error);
  }
}

export const createDataStudioEndpoint = createDataStudioEndpointResponse;
