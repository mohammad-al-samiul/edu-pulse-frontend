import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { RootState } from "./store";
type AxiosBaseQueryArgs = {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
};

type AxiosBaseQueryError = {
  status?: number;
  data?: unknown;
};

export const axiosBaseQuery =
  ({
    baseUrl,
  }: {
    baseUrl: string;
  }): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> =>
  async ({ url, method, data, params }, api) => {
    try {
      const state = api.getState() as RootState;
      const token = state.auth.accessToken;

      const result = await axios({
        url: `${baseUrl}${url}`,
        method,
        data,
        params,
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
        withCredentials: true,
      });

      return { data: result.data };
    } catch (error) {
      const axiosError = error as AxiosError;

      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
        },
      };
    }
  };
