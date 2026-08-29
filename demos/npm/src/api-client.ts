import axios, {
  AxiosTransformer,
  AxiosProxyConfig,
  AxiosError,
  AxiosRequestConfig,
} from 'axios';

// This file is written against axios 0.21.
// The Codespace upgraded the dependency to axios 1.7 without touching this
// code, so every marked line below is now wrong.

// ── BREAKING 1 ────────────────────────────────────────────────────────────
// `AxiosTransformer` was removed in axios 1.0. Response transformers are now
// typed as `AxiosResponseTransformer` (and request ones as
// `AxiosRequestTransformer`), so this import no longer resolves at all.
export const unwrapEnvelope: AxiosTransformer = (data) => data?.payload ?? data;

// ── BREAKING 2 ────────────────────────────────────────────────────────────
// `AxiosProxyConfig` used to carry `username` / `password` directly. In
// axios 1.0 those moved into a nested `auth: { username, password }` object,
// so these two properties no longer exist on the type.
export const proxy: AxiosProxyConfig = {
  host: 'proxy.internal',
  port: 8080,
  username: 'svc-reports',
  password: 'hunter2',
};

// ── BREAKING 3 ────────────────────────────────────────────────────────────
// In axios 0.x `AxiosError` was an *interface*, so an object literal could be
// assigned to it. In axios 1.0 it became a *class*, and a plain object is no
// longer assignable — you have to construct one.
export const notFound: AxiosError = {
  name: 'AxiosError',
  message: 'Not Found',
  isAxiosError: true,
  config: {},
  toJSON: () => ({}),
};

export async function fetchReport(id: string): Promise<unknown> {
  const config: AxiosRequestConfig = {
    proxy,
    transformResponse: [unwrapEnvelope],
  };

  const response = await axios.get(`/reports/${id}`, config);
  return response.data;
}
