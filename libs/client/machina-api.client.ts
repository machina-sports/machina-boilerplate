/**
 * Machina API Client
 *
 * Client for communicating with Machina API (api-staging.machina.gg)
 * Handles authentication, requests, and streaming.
 */

import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

// Base URL for Machina API
const MACHINA_API_BASE_URL =
  process.env.NEXT_PUBLIC_MACHINA_API_URL || 'https://api-staging.machina.gg';

// API Key for authentication
const MACHINA_API_KEY = process.env.NEXT_PUBLIC_MACHINA_API_KEY || '';

export interface MachinaApiOptions extends Omit<AxiosRequestConfig, 'auth'> {
  auth?: boolean; // Whether to include authentication
  apiKey?: string; // Override API key
}

/**
 * Machina API Client
 */
class MachinaApiClient {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = MACHINA_API_BASE_URL;
    this.apiKey = MACHINA_API_KEY;
  }

  /**
   * Build headers for API requests
   */
  private buildHeaders(options?: MachinaApiOptions): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authentication if needed
    if (options?.auth !== false) {
      const apiKey = options?.apiKey || this.apiKey;
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }
    }

    // Merge with custom headers
    if (options?.headers) {
      Object.assign(headers, options.headers);
    }

    return headers;
  }

  /**
   * Build full URL
   */
  private buildUrl(path: string): string {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${this.baseURL}/${cleanPath}`;
  }

  /**
   * Generic fetch method
   */
  async fetch<T = any>(path: string, options: MachinaApiOptions = {}): Promise<T> {
    try {
      const url = this.buildUrl(path);
      const headers = this.buildHeaders(options);

      // Omit custom properties (auth, apiKey) that aren't part of AxiosRequestConfig
      const { auth, apiKey, ...axiosOptions } = options;

      const config: AxiosRequestConfig = {
        ...axiosOptions,
        url,
        headers,
      };

      const response: AxiosResponse<T> = await axios(config);
      return response.data;
    } catch (error: any) {
      console.error('Machina API Error:', error);

      if (error?.response) {
        throw {
          status: error.response.status,
          message: error.response.data?.message || error.response.statusText,
          data: error.response.data,
        };
      }

      throw new Error('Failed to connect to Machina API');
    }
  }

  /**
   * GET request
   */
  async get<T = any>(path: string, options?: MachinaApiOptions): Promise<T> {
    return this.fetch<T>(path, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T = any>(path: string, data?: any, options?: MachinaApiOptions): Promise<T> {
    return this.fetch<T>(path, { ...options, method: 'POST', data });
  }

  /**
   * PUT request
   */
  async put<T = any>(path: string, data?: any, options?: MachinaApiOptions): Promise<T> {
    return this.fetch<T>(path, { ...options, method: 'PUT', data });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(path: string, options?: MachinaApiOptions): Promise<T> {
    return this.fetch<T>(path, { ...options, method: 'DELETE' });
  }

  /**
   * Stream request (for NDJSON streaming)
   * Returns an async generator that yields parsed JSON objects
   */
  async *stream<T = any>(
    path: string,
    data?: any,
    options?: MachinaApiOptions
  ): AsyncGenerator<T, void, unknown> {
    const url = this.buildUrl(path);
    const headers = this.buildHeaders(options);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          // Decode chunk and add to buffer
          buffer += decoder.decode(value, { stream: true });

          // Process complete lines (NDJSON)
          const lines = buffer.split('\n');

          // Keep last incomplete line in buffer
          buffer = lines.pop() || '';

          // Parse and yield each complete line
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine) {
              try {
                const parsed = JSON.parse(trimmedLine) as T;
                yield parsed;
              } catch (parseError) {
                console.error('Failed to parse NDJSON line:', trimmedLine, parseError);
              }
            }
          }
        }

        // Process remaining buffer
        if (buffer.trim()) {
          try {
            const parsed = JSON.parse(buffer.trim()) as T;
            yield parsed;
          } catch (parseError) {
            console.error('Failed to parse final buffer:', buffer, parseError);
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error('Machina API Stream Error:', error);
      throw error;
    }
  }

  /**
   * Set API key (useful for runtime updates)
   */
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Set base URL (useful for switching environments)
   */
  setBaseUrl(baseUrl: string) {
    this.baseURL = baseUrl;
  }
}

// Export singleton instance
export const machinaApiClient = new MachinaApiClient();

// Export class for custom instances
export default MachinaApiClient;
