import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const MOCK_CONTACTS = [
  { id: 'u1', name: 'Alice Johnson', phone: '+91 87654 32109', about: 'Hey there! I am using Signals.', avatarColor: 'green'  },
  { id: 'u2', name: 'Bob Smith',     phone: '+91 76543 21098', about: 'Available',                     avatarColor: 'purple' },
  { id: 'u3', name: 'Carol White',   phone: '+91 65432 10987', about: 'Busy — ping me later.',          avatarColor: 'pink'   },
  { id: 'u4', name: 'David Brown',   phone: '+91 54321 09876', about: 'At work.',                       avatarColor: ''       },
  { id: 'u5', name: 'Emma Wilson',   phone: '+91 43210 98765', about: 'Free to chat!',                  avatarColor: 'purple' },
  { id: 'u6', name: 'Frank Miller',  phone: '+91 32109 87654', about: 'In a meeting.',                  avatarColor: 'teal'   },
  { id: 'u7', name: 'Grace Lee',     phone: '+91 21098 76543', about: 'Working from home.',             avatarColor: 'orange' },
];

export const fetchContactsThunk = createAsyncThunk('contact/fetchContacts', async () => {
  await new Promise(r => setTimeout(r, 300));
  return MOCK_CONTACTS;
});

export const fetchContactThunk = createAsyncThunk('contact/fetchContact', async (userId) => {
  await new Promise(r => setTimeout(r, 200));
  return MOCK_CONTACTS.find(c => c.id === userId) || null;
});

export const searchThunk = createAsyncThunk('contact/search', async (query) => {
  await new Promise(r => setTimeout(r, 200));
  if (!query.trim()) return { users: [], chats: [], messages: [] };
  const q = query.toLowerCase();
  return {
    users: MOCK_CONTACTS.filter(c => c.name.toLowerCase().includes(q)),
    chats: [],    // would search chat names
    messages: [], // would search message content
  };
});

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    contacts:      [],
    searchResults: { users: [], chats: [], messages: [] },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactsThunk.fulfilled, (state, action) => { state.contacts = action.payload; })
      .addCase(fetchContactThunk.fulfilled,  (state, action) => {
        if (action.payload) {
          const existing = state.contacts.find(c => c.id === action.payload.id);
          if (!existing) state.contacts.push(action.payload);
        }
      })
      .addCase(searchThunk.fulfilled, (state, action) => { state.searchResults = action.payload; });
  },
});

export default contactSlice.reducer;
