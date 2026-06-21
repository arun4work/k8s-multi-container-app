import { FibApi, Configuration } from '../../openapi';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const apiConfig = new Configuration({
  basePath: API_BASE_URL,
});

// This is your Singleton Instance
export const api = new FibApi(apiConfig);
