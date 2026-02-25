import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/axiosBaseQuery";
import { apiTags } from "./apiTags";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_API_URL ??
      "https://edu-pulse-backend-plum.vercel.app/api/v1",
  }),
  tagTypes: Object.values(apiTags),
  endpoints: () => ({}),
});
