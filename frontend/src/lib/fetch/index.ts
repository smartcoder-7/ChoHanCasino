import { FetchError, FetchErrorCodes } from './FetchError';
import { AsyncResponse } from './index.types';

const authorizationExpiration: Date | null = null;
const authorizationHeader: string | null = null;
const authorizationFunction: (() => Promise<void>) | null = null;
const urlBase = '';

const ErrorByStatus: Record<number, string> = {
  400: FetchErrorCodes.BadRequest,
  401: FetchErrorCodes.Unauthorized,
  403: FetchErrorCodes.Forbidden,
  404: FetchErrorCodes.NotFound,
};

function buildUrl(
  path: string,
  params: Record<string, string | string[]>,
  query: Record<string, string>,
) {
  const pathWithParams = path.replace(/\{([^}]+)\}/g, (_, key: string) => {
    return encodeURIComponent(params[key].toString());
  });

  const searchParams = new URLSearchParams(query).toString();
  return pathWithParams + (searchParams ? `?${searchParams}` : '');
}

interface FetchProps<U> {
  authorizationFunctionRetriesLeft?: number;
  endpoint: string;
  formBody?: Record<string, string>;
  includeAuthorization?: boolean;
  includeUserRegion?: boolean;
  includeUserZip?: boolean;
  jsonBody?: U;
  method: RequestInit['method'];
  params?: Record<string, string | string[]>;
  query?: Record<string, string>;
  signal?: AbortSignal;
  ssoToken?: string;
}

export async function fetch<T, U = never>({
  authorizationFunctionRetriesLeft = 1,
  jsonBody,
  formBody,
  endpoint,
  includeAuthorization,
  method,
  params = {},
  query = {},
  signal,
}: FetchProps<U>): Promise<T> {
  const global = typeof globalThis !== undefined ? globalThis : window;
  if (urlBase === '') {
    throw new FetchError(
      FetchErrorCodes.UrlBaseNotConfigured,
      'fetch API not configured',
    );
  }

  const hasAuthorizationHeader = Boolean(authorizationHeader);
  const isAuthorizationExpired =
    authorizationExpiration !== null && Date.now() >= +authorizationExpiration;

  if (
    includeAuthorization &&
    authorizationFunction &&
    (!hasAuthorizationHeader || isAuthorizationExpired)
  ) {
    await authorizationFunction();
  }

  const headers: Record<string, string> = {};
  if (includeAuthorization && authorizationHeader) {
    headers.Authorization = authorizationHeader;
  }

  let body;

  if (jsonBody) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(jsonBody);
  } else if (formBody) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    body = new URLSearchParams(formBody).toString();
  }

  let response: Response;
  try {
    const url = buildUrl(`${urlBase}${endpoint}`, params, query);
    response = await global.fetch(url, {
      body,
      headers,
      method,
      signal,
    });
  } catch (error) {
    console.error(error);

    throw new FetchError(
      FetchErrorCodes[error.name] || FetchErrorCodes.NetworkError,
      error,
    );
  }

  let data: T | null = null;
  try {
    data = (await response.json()) as T;
  } catch (error) {
    if (response.status !== 204 && response.status !== 404) {
      console.error(error);
      throw new FetchError(FetchErrorCodes.InvalidJson, error);
    }
  }

  if (response.status < 200 || response.status >= 300) {
    if (
      response.status === 401 &&
      includeAuthorization &&
      authorizationFunction &&
      authorizationFunctionRetriesLeft > 0
    ) {
      await authorizationFunction();

      return fetch<T, U>({
        authorizationFunctionRetriesLeft: authorizationFunctionRetriesLeft - 1,
        endpoint,
        formBody,
        includeAuthorization,
        jsonBody,
        method,
        params,
        query,
        signal,
      });
    }

    const error = new FetchError(
      ErrorByStatus[response.status] ?? FetchErrorCodes.ServerError,
      `Invalid response status ${response.status}`,
    );
    error.data = data;
    error.statusCode = response.status;

    // avoid logging 404s to keep logs clean
    if (response.status !== 404) {
      console.error(error);
    }

    throw error;
  }

  return data as T;
}

export async function fetchWithErrorHandling<T, U = never>(
  props: FetchProps<U>,
): Promise<AsyncResponse<T>> {
  try {
    const data = await fetch<T, U>(props);
    return {
      data,
      isSuccess: true,
    };
  } catch (e) {
    return {
      error: {
        code: e.code,
        message: e.message,
        statusCode: e.statusCode || 500,
      },
      isSuccess: false,
    };
  }
}
