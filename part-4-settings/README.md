# Signals — Part 4: Settings

## Responsibility

You own the **entire settings section** — account management, privacy controls, blocked users, and help.

---

##  Pages

| File | Route | What it does |
|------|-------|-------------|
| `pages/Settings.jsx` | `/settings` | Main settings hub — shows profile + links to sub-pages |
| `pages/AccountSettings.jsx` | `/settings/account` | Phone, email display, log out, link to delete |
| `pages/AccountDelete.jsx` | `/settings/account/delete` | Danger zone — delete account with double confirmation |
| `pages/PrivacySettings.jsx` | `/settings/privacy` | Last seen, profile photo, about, status visibility + read receipts toggle |
| `pages/BlockedUsers.jsx` | `/settings/privacy/blocked` | List of blocked users |
| `pages/BlockUser.jsx` | `/user/:userId/block` | Block or unblock a specific contact |
| `pages/HelpSupport.jsx` | `/settings/help` | Help Center, Contact Us, FAQ accordion |

## Redux Slice

| File | What it manages |
|------|----------------|
| `store/slices/privacySlice.js` | `settings` (last seen, profile photo, about, status, readReceipts), `blockedUsers` |

## Thunks You Need to Wire to the Real API

| Thunk | Replace with |
|-------|-------------|
| `fetchPrivacySettingsThunk` | `GET /api/user/privacy` → returns privacy settings object |
| `updatePrivacyThunk({ field, value })` | `PATCH /api/user/privacy` → `{ field, value }` |
| `fetchBlockedUsersThunk` | `GET /api/user/blocked` → returns blocked users array |
| `blockUserThunk(user)` | `POST /api/user/blocked` → `{ blockedUserId }` |
| `unblockUserThunk(userId)` | `DELETE /api/user/blocked/:userId` |

## Key Logic Notes

### Settings Page — reads from authSlice
```js
const user = useSelector(s => s.auth.user); // name, phone, avatar
```
Settings page does NOT own `authSlice` — it just reads from it.

### AccountSettings — Logout
- Dispatch `logoutThunk` from `authSlice` (owned by Part 1 team)
- On success → navigate to `/login`

### AccountDelete
- Button is disabled until user checks the confirmation checkbox
- Uses `deleteAccountThunk` from `authSlice` (owned by Part 1 team)
- `ui.loading` from `uiSlice` disables the button while request is in-flight

### BlockUser Page
- On mount → dispatch `fetchContactThunk(userId)` from `contactSlice` (Part 2 team)
- Check `privacy.blockedUsers` to show Block vs Unblock button
- Always shows a `ConfirmModal` before executing

### PrivacySettings — Dropdowns
- Each visibility setting (Last Seen, Profile Photo, About, Status) uses a `<select>` dropdown
- Options: `Everyone` / `My Contacts` / `Nobody`
- onChange → immediately dispatch `updatePrivacyThunk({ field, value })` (no save button)

## Shared Files (do not modify without coordinating)
- `components/AppShell.jsx`, `components/LeftPanel.jsx`
- `components/PrivateRoute.jsx`, `components/ConfirmModal.jsx`
- `styles/app.css`, `store/index.js`

## Full Project Location
```
signals/         ← full project, run `npm run dev` here
signals-team/    ← split parts folder
```
