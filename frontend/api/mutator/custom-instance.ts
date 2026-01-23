import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

interface CookieStore {
  get(name: string): unknown;
}

const isServer = typeof window === 'undefined';

const baseURL = isServer ? 'http://backend:3000/api' : '/';

const client = Axios.create({
  baseURL,
});

// add a second `options` argument here if you want to pass extra options to each generated query
export const customInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<T, any, {}>> => {
  let cookieStore = Cookies as CookieStore;
  if (isServer) {
    const { cookies, headers } = await import('next/headers');
    const headersList = await headers();
    const cookie = headersList.get('cookie');
    cookieStore = (await cookies()) as CookieStore;

    if (cookie) {
      config.headers = {
        ...config.headers,
        cookie,
        'X-CSRFToken': cookieStore.get('csrftoken') as string,
      };
    }
  } else {
    config.headers = { ...config.headers, 'X-CSRFToken': cookieStore.get('csrftoken') as string };
  }

  return client({ ...config, ...options });
};

// In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this

export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;

export default client;
