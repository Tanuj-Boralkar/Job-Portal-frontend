// Compatibility hook: all existing role-based pages now read Redux state.
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, logout, updateUser } from '../store/authSlice';
import { jobsApi } from '../store/jobsApi';
export const useAuth = () => {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const authenticate = thunk => async payload => {
    try { const data = await dispatch(thunk(payload)).unwrap(); return { success: true, user: data.user, message: data.message }; }
    catch (error) { return { success: false, message: typeof error === 'string' ? error : error.message }; }
  };
  return { ...auth, login: authenticate(loginUser), register: authenticate(registerUser),
    logout: () => { dispatch(logout()); dispatch(jobsApi.util.resetApiState()); },
    updateUser: partial => dispatch(updateUser(partial)) };
};
