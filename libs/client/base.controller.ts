import axios, { type AxiosRequestConfig } from 'axios';

type FetchOptions = AxiosRequestConfig & { body?: unknown };

class ClientBaseController {
  async fetch(url: string, options: FetchOptions) {
    try {
      const requestOp: FetchOptions = { ...options };
      requestOp.headers = options.headers ?? {};
      requestOp.params = options.params ?? {};
      requestOp.validateStatus = options.validateStatus ?? undefined;

      if (!requestOp.headers['Content-Type']) {
        requestOp.headers['Content-Type'] = 'application/json';
      }

      const { headers, body, method, params } = requestOp;

      const response = await axios({
        url,
        headers,
        data: body,
        method,
        params,
      });

      return response ? response.data : null;
    } catch (error: any) {
      if (error?.response) {
        throw error.response.data;
      }
      console.error('Network or axios error:', error?.message);
      throw new Error('Failed to connect to the server');
    }
  }

  get(url: string, options: FetchOptions) {
    return this.fetch(url, { ...options, method: 'GET' });
  }

  patch(url: string, body: unknown, options: FetchOptions) {
    return this.fetch(url, { ...options, method: 'PATCH', body });
  }

  post(url: string, body: unknown, options: FetchOptions = {}) {
    return this.fetch(url, { ...options, method: 'POST', body });
  }

  put(url: string, body: unknown, options: FetchOptions = {}) {
    return this.fetch(url, { ...options, method: 'PUT', body });
  }

  delete(url: string, body: unknown = {}) {
    return this.fetch(url, { method: 'DELETE', body });
  }
}

export default new ClientBaseController();
