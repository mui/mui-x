import { createDataStudioEndpointResponse } from './createDataStudioEndpoint';
import type {
  DataStudioEndpointResponse,
  DataStudioRequestContext,
  DataStudioServer,
} from './types';

function getRequestUrl(req: {
  url?: string;
  headers?: Record<string, string | string[] | undefined>;
}) {
  const host = req.headers?.host;
  const hostHeader = Array.isArray(host) ? host[0] : host;
  return `http://${hostHeader ?? 'localhost'}${req.url ?? '/'}`;
}

function sendJsonResponse(
  response: DataStudioEndpointResponse,
  res: {
    status?: (status: number) => any;
    setHeader?: (name: string, value: string) => void;
    json?: (body: unknown) => void;
    end?: (body?: string) => void;
  },
) {
  Object.entries(response.headers).forEach(([name, value]) => {
    res.setHeader?.(name, value);
  });

  if (res.status && res.json) {
    res.status(response.status).json(response.body);
    return;
  }

  res.end?.(JSON.stringify(response.body));
}

export function createNextDataStudioHandler<TContext extends DataStudioRequestContext>(
  server: DataStudioServer<TContext>,
) {
  return async function dataStudioNextHandler(
    req: {
      method?: string;
      url?: string;
      headers?: Record<string, string | string[] | undefined>;
      body?: unknown;
    },
    res: {
      status: (status: number) => { json: (body: unknown) => void };
      setHeader: (name: string, value: string) => void;
    },
  ) {
    const response = await createDataStudioEndpointResponse(server, {
      method: req.method,
      url: getRequestUrl(req),
      headers: req.headers,
      body: req.body,
    });

    sendJsonResponse(response, res);
  };
}

export function createExpressDataStudioHandler<TContext extends DataStudioRequestContext>(
  server: DataStudioServer<TContext>,
) {
  return async function dataStudioExpressHandler(
    req: {
      method?: string;
      originalUrl?: string;
      url?: string;
      headers?: Record<string, string | string[] | undefined>;
      body?: unknown;
    },
    res: {
      status: (status: number) => { json: (body: unknown) => void };
      setHeader: (name: string, value: string) => void;
    },
  ) {
    const response = await createDataStudioEndpointResponse(server, {
      method: req.method,
      url: getRequestUrl({ ...req, url: req.originalUrl ?? req.url }),
      headers: req.headers,
      body: req.body,
    });

    sendJsonResponse(response, res);
  };
}

export function createFastifyDataStudioHandler<TContext extends DataStudioRequestContext>(
  server: DataStudioServer<TContext>,
) {
  return async function dataStudioFastifyHandler(
    request: {
      method?: string;
      url?: string;
      headers?: Record<string, string | string[] | undefined>;
      body?: unknown;
    },
    reply: {
      code: (status: number) => any;
      header: (name: string, value: string) => any;
      send: (body: unknown) => void;
    },
  ) {
    const response = await createDataStudioEndpointResponse(server, {
      method: request.method,
      url: getRequestUrl(request),
      headers: request.headers,
      body: request.body,
    });

    Object.entries(response.headers).forEach(([name, value]) => {
      reply.header(name, value);
    });
    reply.code(response.status).send(response.body);
  };
}

async function readNodeRequestBody(req: AsyncIterable<Uint8Array | string>) {
  const chunks: Uint8Array[] = [];
  const encoder = new TextEncoder();

  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? encoder.encode(chunk) : chunk);
  }

  const length = chunks.reduce((total, chunk) => total + chunk.byteLength, 0);
  const bodyBytes = new Uint8Array(length);
  let offset = 0;

  chunks.forEach((chunk) => {
    bodyBytes.set(chunk, offset);
    offset += chunk.byteLength;
  });

  const body = new TextDecoder().decode(bodyBytes);
  return body ? JSON.parse(body) : undefined;
}

export function createNodeDataStudioHandler<TContext extends DataStudioRequestContext>(
  server: DataStudioServer<TContext>,
) {
  return async function dataStudioNodeHandler(
    req: AsyncIterable<Uint8Array | string> & {
      method?: string;
      url?: string;
      headers?: Record<string, string | string[] | undefined>;
    },
    res: {
      statusCode?: number;
      setHeader?: (name: string, value: string) => void;
      end?: (body?: string) => void;
    },
  ) {
    const response = await createDataStudioEndpointResponse(server, {
      method: req.method,
      url: getRequestUrl(req),
      headers: req.headers,
      body: req.method?.toUpperCase() === 'POST' ? await readNodeRequestBody(req) : undefined,
    });

    res.statusCode = response.status;
    Object.entries(response.headers).forEach(([name, value]) => {
      res.setHeader?.(name, value);
    });
    res.end?.(JSON.stringify(response.body));
  };
}
