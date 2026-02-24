import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { store } from "./store";
import { logout, setCredentials } from "@/features/auth/authSlice";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://edu-pulse-backend-plum.vercel.app/api/v1";

let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.accessToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes("/users/login") &&
        !originalRequest.url?.includes("/users/refresh-token")
      ) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve) => {
            pendingRequests.push((token) => {
              if (token && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(axios(originalRequest));
            });
          });
        }

        isRefreshing = true;

        try {
          const refreshResponse = await axios.post<{ accessToken?: string }>(
            `${API_BASE_URL}/users/refresh-token`,
            {},
            { withCredentials: true },
          );

          const { accessToken: newToken } = refreshResponse.data;

          if (newToken) {
            const state = store.getState();

            store.dispatch(
              setCredentials({
                user: state.auth.user!,
                accessToken: newToken,
              }),
            );
          }

          pendingRequests.forEach((cb) => cb(newToken ?? null));
          pendingRequests = [];

          if (newToken && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          return axios(originalRequest);
        } catch (refreshError) {
          store.dispatch(logout());
          pendingRequests.forEach((cb) => cb(null));
          pendingRequests = [];
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

export const apiClient = createApiClient();

