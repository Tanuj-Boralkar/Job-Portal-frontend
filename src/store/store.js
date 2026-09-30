import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './authSlice';
import { jobsApi } from './jobsApi';

export const store = configureStore({
  reducer: { auth: authReducer, [jobsApi.reducerPath]: jobsApi.reducer },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(jobsApi.middleware)
});
let previousAuth = store.getState().auth;
store.subscribe(() => {
  const auth = store.getState().auth;
  if (auth.token === previousAuth.token && auth.user === previousAuth.user) return;
  previousAuth = auth;
  try {
    if (auth.token && auth.user) localStorage.setItem('userInfo', JSON.stringify({ token: auth.token, user: auth.user }));
    else localStorage.removeItem('userInfo');
  } catch { /* Session remains usable in memory when browser storage is unavailable. */ }
});
setupListeners(store.dispatch);
