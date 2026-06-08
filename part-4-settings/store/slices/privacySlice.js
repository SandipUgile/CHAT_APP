import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const MOCK_PRIVACY = {
  lastSeen:    'Everyone',
  profilePhoto:'My Contacts',
  about:       'My Contacts',
  status:      'My Contacts',
  readReceipts: true,
};

const MOCK_BLOCKED = [
  { id: 'u6', name: 'Frank Miller', phone: '+91 32109 87654', avatarColor: 'teal' },
];

export const fetchPrivacySettingsThunk = createAsyncThunk('privacy/fetchSettings', async () => {
  await new Promise(r => setTimeout(r, 200));
  return MOCK_PRIVACY;
});

export const updatePrivacyThunk = createAsyncThunk('privacy/updateSetting', async ({ field, value }) => {
  await new Promise(r => setTimeout(r, 200));
  return { field, value };
});

export const fetchBlockedUsersThunk = createAsyncThunk('privacy/fetchBlocked', async () => {
  await new Promise(r => setTimeout(r, 200));
  return MOCK_BLOCKED;
});

export const blockUserThunk = createAsyncThunk('privacy/blockUser', async (user) => {
  await new Promise(r => setTimeout(r, 300));
  return user;
});

export const unblockUserThunk = createAsyncThunk('privacy/unblockUser', async (userId) => {
  await new Promise(r => setTimeout(r, 300));
  return userId;
});

const privacySlice = createSlice({
  name: 'privacy',
  initialState: {
    settings:     null,
    blockedUsers: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrivacySettingsThunk.fulfilled, (state, action) => { state.settings = action.payload; })
      .addCase(updatePrivacyThunk.fulfilled, (state, action) => {
        if (state.settings) state.settings[action.payload.field] = action.payload.value;
      })
      .addCase(fetchBlockedUsersThunk.fulfilled, (state, action) => { state.blockedUsers = action.payload; })
      .addCase(blockUserThunk.fulfilled,   (state, action) => {
        if (!state.blockedUsers.find(u => u.id === action.payload.id))
          state.blockedUsers.push(action.payload);
      })
      .addCase(unblockUserThunk.fulfilled, (state, action) => {
        state.blockedUsers = state.blockedUsers.filter(u => u.id !== action.payload);
      });
  },
});

export default privacySlice.reducer;
