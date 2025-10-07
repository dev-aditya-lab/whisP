## API Endpoints

### Auth
- POST `/api/v1/auth/send-otp`
- POST `/api/v1/auth/authintication`
- POST `/api/v1/auth/avatar` (auth required)
- POST `/api/v1/auth/logout` (auth required)

### Users
- GET `/api/v1/user/profile` (auth required)
- PUT `/api/v1/user/profileUpdate` (auth required)

### Reports
- POST `/api/v1/reportUser/` (auth required)

### Chats (one-to-one only)
- POST `/api/v1/chats/one-to-one` (auth required)
  - body: `{ receiverUid }` (UID only)
  - returns existing or creates new chat between auth user and the receiver UID

- GET `/api/v1/chats` (auth required)
  - returns all chats for auth user

- GET `/api/v1/chats/messages/:chatId` (auth required)
  - returns messages for the chat if user is a participant 

- POST `/api/v1/chats/send-message` (auth required)
  - body: `{ chatId, content, attachments?, deleteAfterSeconds? }`
  - sends a message in the chat; emits `chat:new-message` via Socket.IO

- POST `/api/v1/chats/block-user` (auth required)
  - body: `{ userId }`

### Socket.IO
- Connect to the default namespace
- Emit `chat:join` with `chatId` to join room `chat:<chatId>`
- Emit `chat:leave` with `chatId`
- Listen for `chat:new-message` for new messages in joined chats

### Notes
- All chat endpoints require Authorization Bearer token or `accessToken` cookie.
- Only one-to-one chats are supported; group chats are not available.

