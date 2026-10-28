
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchChats = createAsyncThunk(
  "chats/fetchChats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/chats");
      return response.data.chats;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load chats"
      );
    }
  }
);

export const createChat = createAsyncThunk(
  "chats/createChat",
  async (recipientId, { rejectWithValue }) => {
    try {
      const response = await api.post("/chats", { recipientId });
      return response.data.chat;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create chat"
      );
    }
  }
);

const chatSlice = createSlice({
  name: "chats",
  initialState: {
    chats: [],
    activeChatId: null,
    search: "",
    loading: false,
    error: null,
  },
  reducers: {
    setActiveChat(state, action) {
      state.activeChatId = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
    updateLastMessage(state, action) {
      const { chatId, message } = action.payload;
      const chat = state.chats.find(
        (item) => item._id === chatId || item.id === chatId
      );
      if (chat) chat.lastMessage = message;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        const chat = action.payload;
        const exists = state.chats.some(
          (item) => item._id === chat._id
        );
        if (!exists) state.chats.unshift(chat);
        state.activeChatId = chat._id;
      })
      .addCase(createChat.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  setActiveChat,
  setSearch,
  updateLastMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
