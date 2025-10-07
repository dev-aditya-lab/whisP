# Chat Persistence Feature

## Overview
All conversations and messages now persist across app restarts, just like WhatsApp, Telegram, and other modern chat apps.

## What's Stored

### 1. **Chat Metadata** (`@chats` key)
```json
[
  {
    "partnerId": "user_abc123",
    "lastMessage": "Hey, how are you?",
    "timestamp": 1696789200000,
    "unread": 0
  }
]
```

### 2. **Individual Messages** (`@messages_<partnerId>` keys)
```json
[
  {
    "senderId": "user_xyz789",
    "receiverId": "user_abc123",
    "encryptedMessage": "U2FsdGVkX1..."
  }
]
```

## How It Works

### Chat List (`app/(tabs)/chat.jsx`)
1. **Loads stored chats** on app launch
2. **Merges with online users** to show both:
   - Recent conversations (even if user is offline)
   - Currently online users
3. **Sorts by recency** - most recent chats at the top
4. **Shows last message preview** for each conversation
5. **Online indicator** (green dot) for active users

### Chat Screen (`app/chat/[id].jsx`)
1. **Loads stored messages** immediately when opening chat
2. **Requests server history** if available
3. **Merges both** to avoid duplicates
4. **Saves every message**:
   - When you send a message
   - When you receive a message
5. **Updates chat list** with latest message

## Key Features

### ✅ Offline Access
- View all previous conversations
- Read message history
- See last message previews
- No internet required to browse past chats

### ✅ Smart Merging
- Online users appear at the top (when they send messages)
- Offline conversations remain accessible
- No duplicate messages
- Seamless sync between local and server

### ✅ Storage Limits
- Keeps last **500 messages** per conversation
- Automatic cleanup to prevent storage bloat
- Oldest messages are removed first

### ✅ Real-time Updates
- New messages instantly appear
- Chat list updates with latest message
- Timestamps update automatically
- Online status shows in real-time

## User Experience

### Before (Without Persistence)
- ❌ Conversations disappear when users go offline
- ❌ No message history after app restart
- ❌ Empty chat list when no one is online
- ❌ Lost all context between sessions

### After (With Persistence)
- ✅ All conversations remain visible
- ✅ Full message history loads instantly
- ✅ Chat list always shows recent activity
- ✅ Seamless experience across sessions

## Technical Implementation

### Storage Utilities (`utils/chatStorage.js`)
```javascript
getChats()          // Get all conversations
saveChat()          // Update/create conversation
getMessages()       // Get messages for a conversation
saveMessages()      // Save messages for a conversation
addMessage()        // Add single message
deleteChat()        // Remove conversation
```

### Data Flow

**Sending a Message:**
```
User types → Encrypt → Emit to server → Save locally → Update UI
```

**Receiving a Message:**
```
Server → Socket event → Save locally → Update chat list → Update UI
```

**Opening a Chat:**
```
Load from storage → Display → Request server history → Merge → Save
```

## Performance

- **Instant load** - Cached messages appear immediately
- **Async storage** - Non-blocking operations
- **Smart limits** - 500 messages per chat prevents slowdown
- **Lazy loading** - Only loads active conversation

## Privacy & Security

- **End-to-end encryption** maintained in storage
- **Local only** - Messages stored on device
- **Encrypted format** - AES encryption persists
- **User isolation** - Each user ID has separate storage

## Future Enhancements

- [ ] Message search across all chats
- [ ] Export chat history
- [ ] Backup/restore functionality
- [ ] Cloud sync (optional)
- [ ] Media message storage
- [ ] Message deletion
- [ ] Clear all chats option

## Testing Checklist

✅ Send message → Close app → Reopen → Message still there  
✅ Chat with user → User goes offline → Chat still visible  
✅ Multiple chats → Sorted by most recent  
✅ Last message preview shows correctly  
✅ Online/offline indicator works  
✅ Messages load from storage first  
✅ Server history merges without duplicates  

## Code Changes

### New Files
- `utils/chatStorage.js` - Storage utility functions

### Modified Files
- `app/(tabs)/chat.jsx` - Added persistence + merged chat list
- `app/chat/[id].jsx` - Save/load messages locally

### Dependencies Used
- `@react-native-async-storage/async-storage` - Already installed
- No new dependencies required!
