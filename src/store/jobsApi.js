import { createApi } from '@reduxjs/toolkit/query/react';
import api, { getErrorMessage } from '../services/api';

export const jobsApi = createApi({
  reducerPath: 'jobsApi',
  baseQuery: async ({ url, params }, { signal }) => {
    try { return { data: (await api.get(url, { params, signal })).data.data }; }
    catch (error) { return { error: { status: error.response?.status || 'NETWORK_ERROR', message: getErrorMessage(error) } }; }
  },
  endpoints: builder => ({
    getJobs: builder.query({ query: params => ({ url: '/jobs', params }) })
  }),
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true
});
export const { useGetJobsQuery } = jobsApi;
