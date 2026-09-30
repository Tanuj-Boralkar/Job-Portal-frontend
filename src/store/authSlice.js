import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { getErrorMessage } from '../services/api';

export const readSession = () => {
  try { const s = JSON.parse(localStorage.getItem('userInfo')); return s?.token && s?.user ? s : {}; }
  catch { return {}; }
};
const authenticate = (route) => createAsyncThunk(`auth/${route}`, async (payload, { rejectWithValue }) => {
  try { return (await api.post(`/auth/${route}`, payload)).data; }
  catch (error) { return rejectWithValue(getErrorMessage(error)); }
});
export const loginUser = authenticate('login');
export const registerUser = authenticate('register');
export const restoreSession = createAsyncThunk('auth/restore', async (_, { rejectWithValue }) => {
  try { return (await api.get('/auth/me')).data.data; }
  catch (error) { return rejectWithValue({ message: getErrorMessage(error), unauthorized: [401,403].includes(error.response?.status) }); }
}, { condition: (_, { getState }) => Boolean(getState().auth.token) && getState().auth.loading });
const saved = readSession();
const slice = createSlice({
  name: 'auth',
  initialState: { user: saved.user || null, token: saved.token || null, loading: Boolean(saved.token), submitting: false, error: null, requestId: null },
  reducers: {
    logout(state) { state.user = null; state.token = null; state.loading = false; state.submitting = false; state.error = null; state.requestId = null; },
    updateUser(state, action) { if (state.user) state.user = { ...state.user, ...action.payload }; }
  },
  extraReducers: builder => {
    for (const thunk of [loginUser, registerUser]) {
      builder.addCase(thunk.pending, (state, action) => { state.submitting = true; state.error = null; state.requestId = action.meta.requestId; });
      builder.addCase(thunk.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.user = action.payload.user; state.token = action.payload.token; state.submitting = false; state.loading = false; state.requestId = null;
      });
      builder.addCase(thunk.rejected, (state, action) => { if (state.requestId === action.meta.requestId) { state.submitting = false; state.error = action.payload || action.error.message; state.requestId = null; } });
    }
    builder.addCase(restoreSession.pending, (state, action) => { state.requestId = action.meta.requestId; });
    builder.addCase(restoreSession.fulfilled, (state, action) => { if (state.requestId === action.meta.requestId) { state.user = action.payload; state.loading = false; state.requestId = null; } });
    builder.addCase(restoreSession.rejected, (state, action) => {
      if (state.requestId !== action.meta.requestId) return;
      state.loading = false; state.requestId = null;
      if (action.payload?.unauthorized) { state.user = null; state.token = null; }
      state.error = action.payload?.message || action.error.message;
    });
  }
});
export const { logout, updateUser } = slice.actions;
export default slice.reducer;
