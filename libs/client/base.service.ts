import api from '@/libs/client/base.controller';

class ClientBaseService {
  prefix = '';
  api = api;

  get<T = any>(prefix = this.prefix, options: unknown) {
    return this.api.get<T>(prefix, options as any);
  }

  patch<T = any>(body: unknown, prefix = this.prefix, options: unknown) {
    return this.api.patch<T>(`${prefix}`, body, options as any);
  }

  post<T = any>(body: unknown, prefix = this.prefix, options: unknown) {
    return this.api.post<T>(prefix, body, options as any);
  }

  put<T = any>(body: unknown, prefix = this.prefix, options: unknown) {
    return this.api.put<T>(`${prefix}`, body, options as any);
  }

  delete<T = any>(prefix = this.prefix, body: unknown = {}) {
    return this.api.delete<T>(prefix, body);
  }
}

export default ClientBaseService;
