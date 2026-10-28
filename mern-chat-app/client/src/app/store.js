import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import chatReducer from "../features/chats/chatSlice";
import messageReducer from "../features/messages/messageSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chats: chatReducer,
    messages: messageReducer,
  },
});