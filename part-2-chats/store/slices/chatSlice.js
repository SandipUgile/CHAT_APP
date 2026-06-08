import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setLoading } from './uiSlice';

// ── Mock data ──────────────────────────────────────────

const MOCK_CHATS = [
  { id: 'c1', name: 'Alice Johnson',  userId: 'u1', isGroup: false, lastMessage: 'Hey! How are you doing?',      timestamp: '10:30 AM', unread: 2, avatarColor: 'green'  },
  { id: 'c2', name: 'Project Team',   groupId: 'g1', isGroup: true,  lastMessage: 'Meeting at 3 PM today.',        timestamp: '9:45 AM',  unread: 5, avatarColor: 'orange' },
  { id: 'c3', name: 'Bob Smith',      userId: 'u2', isGroup: false, lastMessage: 'See you tomorrow!',             timestamp: 'Yesterday', unread: 0, avatarColor: 'purple' },
  { id: 'c4', name: 'Carol White',    userId: 'u3', isGroup: false, lastMessage: 'Thanks for your help!',         timestamp: 'Yesterday', unread: 0, avatarColor: 'pink'   },
  { id: 'c5', name: 'Study Group',    groupId: 'g2', isGroup: true,  lastMessage: 'Chapter 5 notes uploaded.',    timestamp: 'Mon',       unread: 1, avatarColor: 'teal'   },
  { id: 'c6', name: 'David Brown',    userId: 'u4', isGroup: false, lastMessage: 'Great work on the project!',    timestamp: 'Mon',       unread: 0, avatarColor: ''       },
  { id: 'c7', name: 'Emma Wilson',    userId: 'u5', isGroup: false, lastMessage: 'Are you free this weekend?',   timestamp: 'Sun',       unread: 0, avatarColor: 'purple' },
];

const MOCK_MESSAGES = {
  c1: [
    { id: 'm1', senderId: 'u1', senderName: 'Alice', text: 'Hey Kaushik! How are you doing?',   timestamp: '10:28 AM', isStarred: false },
    { id: 'm2', senderId: 'u0', senderName: 'Me',    text: 'I am doing great, thanks for asking!', timestamp: '10:29 AM', isStarred: false },
    { id: 'm3', senderId: 'u1', senderName: 'Alice', text: 'That is wonderful to hear! 😊',       timestamp: '10:30 AM', isStarred: true  },
  ],
  c2: [
    { id: 'm4', senderId: 'u1', senderName: 'Alice', text: 'Hey team! Good morning 👋',           timestamp: '9:40 AM', isStarred: false },
    { id: 'm5', senderId: 'u2', senderName: 'Bob',   text: 'Good morning everyone!',               timestamp: '9:42 AM', isStarred: false },
    { id: 'm6', senderId: 'u1', senderName: 'Alice', text: 'Meeting at 3 PM today.',               timestamp: '9:45 AM', isStarred: true  },
  ],
  c3: [
    { id: 'm7', senderId: 'u0', senderName: 'Me',    text: 'Hey Bob, see you tomorrow!',           timestamp: 'Yesterday', isStarred: false },
    { id: 'm8', senderId: 'u2', senderName: 'Bob',   text: 'See you tomorrow!',                     timestamp: 'Yesterday', isStarred: false },
  ],
  c4: [
    { id: 'm9', senderId: 'u3', senderName: 'Carol', text: 'Thanks for your help with the assignment!', timestamp: 'Yesterday', isStarred: false },
    { id: 'm10', senderId: 'u0', senderName: 'Me',   text: 'Of course! Anytime 😊',               timestamp: 'Yesterday', isStarred: false },
  ],
  c5: [
    { id: 'm11', senderId: 'u4', senderName: 'David', text: 'Chapter 5 notes are uploaded in the shared folder.', timestamp: 'Mon', isStarred: false },
    { id: 'm12', senderId: 'u5', senderName: 'Emma',  text: 'Thanks David! Very helpful.',          timestamp: 'Mon', isStarred: false },
  ],
  c6: [
    { id: 'm13', senderId: 'u4', senderName: 'David', text: 'Great work on the project presentation!', timestamp: 'Mon', isStarred: false },
  ],
  c7: [
    { id: 'm14', senderId: 'u5', senderName: 'Emma', text: 'Hey! Are you free this weekend?',       timestamp: 'Sun', isStarred: false },
  ],
};

const MOCK_STARRED = [
  { id: 'm3',  chatId: 'c1', chatName: 'Alice Johnson', senderId: 'u1', senderName: 'Alice', text: 'That is wonderful to hear! 😊',    timestamp: '10:30 AM' },
  { id: 'm6',  chatId: 'c2', chatName: 'Project Team',  senderId: 'u1', senderName: 'Alice', text: 'Meeting at 3 PM today.',            timestamp: '9:45 AM'  },
];

const MOCK_PINNED = [
  MOCK_CHATS[0], // Alice Johnson
  MOCK_CHATS[1], // Project Team
];

// ── Thunks ─────────────────────────────────────────────

export const fetchChatsThunk = createAsyncThunk('chat/fetchChats', async () => {
  await new Promise(r => setTimeout(r, 300));
  return MOCK_CHATS;
});

export const fetchMessagesThunk = createAsyncThunk('chat/fetchMessages', async (chatId) => {
  await new Promise(r => setTimeout(r, 200));
  return { chatId, messages: MOCK_MESSAGES[chatId] || [] };
});

export const sendMessageThunk = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatId, text }) => {
    await new Promise(r => setTimeout(r, 100));
    return {
      chatId,
      message: {
        id: 'msg-' + Date.now(),
        senderId: 'u0',
        senderName: 'Me',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isStarred: false,
      },
    };
  }
);

export const createChatThunk = createAsyncThunk('chat/createChat', async ({ userId, contact }) => {
  await new Promise(r => setTimeout(r, 200));
  // Check if chat already exists
  const existing = MOCK_CHATS.find(c => c.userId === userId);
  if (existing) return existing;
  const newChat = {
    id: 'c-' + Date.now(),
    name: contact.name,
    userId,
    isGroup: false,
    lastMessage: '',
    timestamp: 'Now',
    unread: 0,
    avatarColor: '',
  };
  return newChat;
});

export const fetchStarredThunk = createAsyncThunk('chat/fetchStarred', async () => {
  await new Promise(r => setTimeout(r, 200));
  return MOCK_STARRED;
});

export const unstarMessageThunk = createAsyncThunk('chat/unstarMessage', async (messageId) => {
  await new Promise(r => setTimeout(r, 100));
  return messageId;
});

export const fetchPinnedChatsThunk = createAsyncThunk('chat/fetchPinned', async () => {
  await new Promise(r => setTimeout(r, 200));
  return MOCK_PINNED;
});

export const unpinChatThunk = createAsyncThunk('chat/unpinChat', async (chatId) => {
  await new Promise(r => setTimeout(r, 100));
  return chatId;
});

// ── Slice ──────────────────────────────────────────────

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chatList:       [],
    activeChat:     null,
    messages:       {},       // { chatId: [ ...messages ] }
    starredMessages: [],
    pinnedChats:    [],
  },
  reducers: {
    setActiveChat: (state, action) => { state.activeChat = action.payload; },
    clearActiveChat: (state)       => { state.activeChat = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatsThunk.fulfilled, (state, action) => {
        state.chatList = action.payload;
      })
      .addCase(fetchMessagesThunk.fulfilled, (state, action) => {
        state.messages[action.payload.chatId] = action.payload.messages;
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        const { chatId, message } = action.payload;
        if (!state.messages[chatId]) state.messages[chatId] = [];
        state.messages[chatId].push(message);
        // Update last message in chatList
        const chat = state.chatList.find(c => c.id === chatId);
        if (chat) { chat.lastMessage = message.text; chat.timestamp = message.timestamp; }
      })
      .addCase(createChatThunk.fulfilled, (state, action) => {
        const exists = state.chatList.find(c => c.id === action.payload.id);
        if (!exists) state.chatList.unshift(action.payload);
        state.activeChat = action.payload;
      })
      .addCase(fetchStarredThunk.fulfilled, (state, action) => {
        state.starredMessages = action.payload;
      })
      .addCase(unstarMessageThunk.fulfilled, (state, action) => {
        state.starredMessages = state.starredMessages.filter(m => m.id !== action.payload);
      })
      .addCase(fetchPinnedChatsThunk.fulfilled, (state, action) => {
        state.pinnedChats = action.payload;
      })
      .addCase(unpinChatThunk.fulfilled, (state, action) => {
        state.pinnedChats = state.pinnedChats.filter(c => c.id !== action.payload);
      });
  },
});

export const { setActiveChat, clearActiveChat } = chatSlice.actions;
export default chatSlice.reducer;
