/// <reference types="vite/client" />
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";
import { updateTokenData, clearToken } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL+"/api" ,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.value.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const baseQueryWithReauth: typeof baseQuery = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we got an unauthorized error
  if (result.error && result.error.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth.value.refreshToken;

    // Try to refresh the token
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          body: { refreshToken: refreshToken },
        },
        api,
        extraOptions
      );

      const resp = refreshResult.data  as {
        status: number;
        data: { accessToken: string; refreshToken: string; _id: string };
      };
      
      if (resp && resp.data) {
        const { accessToken, refreshToken, _id } = resp.data 

        // Update store and indexDB
        api.dispatch(updateTokenData({ accessToken, refreshToken, _id }));
        // Retry the original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed — clear tokens
        api.dispatch(clearToken());
      }
    }
  }

  return result;
};
