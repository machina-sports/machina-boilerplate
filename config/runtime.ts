export const runtimeConfig = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'Machina Boilerplate Frontend',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api',
};

export type RuntimeConfig = typeof runtimeConfig;
