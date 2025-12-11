import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export class HttpClient {
  private readonly client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      withCredentials: true,
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Surface errors centrally; replace with telemetry/logging if needed.
        console.error('[http]', error);
        return Promise.reject(error);
      }
    );
  }

  request<T = unknown>(config: AxiosRequestConfig) {
    return this.client.request<T>(config);
  }
}
