# Signals — Part 2: Chats

## Your Responsibility

You own the **core messaging experience** — the chat list, individual chat screens, contact profiles, new message flow, and search.

---

## Your Pages

| File | Route | What it does |
|------|-------|-------------|
| `pages/ChatList.jsx` | `/chats` | Welcome screen shown in right panel when no chat is selected |
| `pages/ChatScreen.jsx` | `/chat/:chatId` | The actual chat — works for both 1-1 and group chats |
| `pages/NewMessage.jsx` | `/new-message` | Pick a contact to start a new chat |
| `pages/Search.jsx` | `/search` | Search across people, chats, messages (3 tabs, debounced) |
| `pages/ContactProfile.jsx` | `/contact/:userId` | View a contact's profile, Message/Call/Video buttons |

## Your Redux Slices

| File | What it manages |
|------|----------------|
| `store/slices/chatSlice.js` | `chatList`, `activeChat`, `messages`, `starredMessages`, `pinnedChats` |
| `store/slices/contactSlice.js` | `contacts`, `searchResults` |

## Thunks You Need to Wire to the Real API

| Thunk | Replace with |
|-------|-------------|
| `fetchChatsThunk` | `GET /api/chats` → returns array of chats |
| `fetchMessagesThunk(chatId)` | `GET /api/chats/:chatId/messages` → returns message array |
| `sendMessageThunk({ chatId, text })` | `POST /api/chats/:chatId/messages` → `{ text }` |
| `createChatThunk({ userId })` | `POST /api/chats` → `{ userId }` → returns `{ chatId }` |
| `fetchStarredThunk` | `GET /api/messages/starred` |
| `unstarMessageThunk(messageId)` | `DELETE /api/messages/:id/star` |
| `fetchPinnedChatsThunk` | `GET /api/chats/pinned` |
| `unpinChatThunk(chatId)` | `DELETE /api/chats/:id/pin` |
| `fetchContactsThunk` | `GET /api/contacts` |
| `fetchContactThunk(userId)` | `GET /api/users/:userId` |
| `searchThunk(query)` | `GET /api/search?q=query` → returns `{ users, chats, messages }` |

## Key Logic Notes

### ChatScreen — 1-1 vs Group
- Check `chat.activeChat.isGroup`
- If `true` → show sender name above each message bubble
- If `false` → don't show sender name (only 2 people)

### Clicking the Chat Header
- 1-1 chat → navigate to `/contact/:userId`
- Group chat → navigate to `/group/:groupId/info`

### Message Bubbles
- Own messages (`senderId === currentUser.id`) → right side, blue
- Others' messages → left side, white/bordered

## Shared Files (do not modify without coordinating)
- `components/AppShell.jsx`, `components/LeftPanel.jsx`
- `components/PrivateRoute.jsx`, `components/ConfirmModal.jsx`
- `styles/app.css`, `store/index.js`

## Full Project Location
```
signals/         ← full project, run `npm run dev` here
signals-team/    ← split parts folder
```
