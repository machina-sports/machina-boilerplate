import api from "@/libs/client/base.controller";

class ClientBaseService {
  prefix = "";
  api = api;

  get(prefix = this.prefix, options: unknown) {
    return this.api.get(prefix, options as any);
  }

  patch(body: unknown, prefix = this.prefix, options: unknown) {
    return this.api.patch(`${prefix}`, body, options as any);
  }

  post(body: unknown, prefix = this.prefix, options: unknown) {
    return this.api.post(prefix, body, options as any);
  }

  put(body: unknown, prefix = this.prefix, options: unknown) {
    return this.api.put(`${prefix}`, body, options as any);
  }

  delete(prefix = this.prefix, body: unknown = {}) {
    return this.api.delete(prefix, body);
  }
}

export default ClientBaseService;

