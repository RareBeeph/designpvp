import Axios, { AxiosRequestConfig } from 'axios';

const isServer = typeof window === 'undefined';

const baseURL = isServer
  ? 'http://backend:3000/api'
  : '/api';

export const AXIOS_INSTANCE = Axios.create({baseURL});

export const customInstance = async <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  // Forward cookies during SSR
  if (isServer) {
    // Dynamic import to avoid bundling next/headers on client
    const { headers } = await import('next/headers');
    const headersList = await headers();
    const cookie = headersList.get('cookie');

    if (cookie) {
      config.headers = {
        ...config.headers,
        cookie,
      };
    }
  }

  return AXIOS_INSTANCE({...config, ...options});
};

export default customInstance;
