import { configureStore } from '@reduxjs/toolkit';
import authReducer    from './slices/authSlice';
import chatReducer    from './slices/chatSlice';
import groupReducer   from './slices/groupSlice';
import contactReducer from './slices/contactSlice';
import statusReducer  from './slices/statusSlice';
import privacyReducer from './slices/privacySlice';
import uiReducer      from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth:    authReducer,
    chat:    chatReducer,
    group:   groupReducer,
    contact: contactReducer,
    status:  statusReducer,
    privacy: privacyReducer,
    ui:      uiReducer,
  },
});

export default store;
