import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import Cookies from "js-cookie";
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
      const token = Cookies.get("accessToken") ?? null;
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
      if (
        axiosError.response?.status === 401 &&
        url !== "/users/login" &&
        url !== "/users/refresh-token"
      ) {
        try {
          const refreshResp = await axios.post<{ accessToken?: string }>(
            `${baseUrl}/users/refresh-token`,
            {},
            { withCredentials: true },
          );
          const newToken = refreshResp.data.accessToken ?? null;
          if (newToken) {
            Cookies.set("accessToken", newToken, {
              expires: 7,
              sameSite: "lax",
              secure:
                typeof window !== "undefined" &&
                window.location.protocol === "https:",
            });
            const retry = await axios({
              url: `${baseUrl}${url}`,
              method,
              data,
              params,
              headers: {
                Authorization: `Bearer ${newToken}`,
              },
              withCredentials: true,
            });
            return { data: retry.data };
          }
          Cookies.remove("accessToken");
          Cookies.remove("role");
        } catch {
          Cookies.remove("accessToken");
          Cookies.remove("role");
        }
      }

      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
        },
      };
    }
  };
