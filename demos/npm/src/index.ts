import axios, { AxiosTransformer } from 'axios';

// axios 0.x exports the AxiosTransformer type for response transformers.
/** Strip the wrapper envelope from a response body. */
export const unwrapEnvelope: AxiosTransformer = (data) => data;

/** Fetch a URL and return its unwrapped JSON body. */
export async function fetchJson(url: string): Promise<unknown> {
  const res = await axios.get(url, { transformResponse: [unwrapEnvelope] });
  return res.data;
}
