import ClientBaseService from "@/libs/client/base.service";

class SampleService extends ClientBaseService {
  prefix = "/api/sample";

  async getWelcome(): Promise<{ message: string }> {
    // Replace with real API call when available.
    return Promise.resolve({ message: "Welcome to Machina boilerplate (API)" });
  }
}

export const sampleService = new SampleService();

