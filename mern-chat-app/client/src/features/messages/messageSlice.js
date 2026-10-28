
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/messages/${conversationId}`);
      return {
        conversationId,
        messages: response.data.messages,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load messages"
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ conversationId, text }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/messages/${conversationId}`, {
        text,
      });
      return {
        conversationId,
        message: response.data.message,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send message"
      );
    }
  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    byChatId: {},
    loading: false,
    sending: false,
    error: null,
  },
  reducers: {
    setMessages(state, action) {
      const { conversationId, messages } = action.payload;
      state.byChatId[conversationId] = messages;
    },
    addMessage(state, action) {
      const { conversationId, message } = action.payload;
      const messages = (state.byChatId[conversationId] ||= []);
      if (!messages.some((item) => item._id === message._id)) {
        messages.push(message);
      }
    },
    clearMessages(state, action) {
      delete state.byChatId[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.byChatId[action.payload.conversationId] =
          action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        const { conversationId, message } = action.payload;
        const messages = (state.byChatId[conversationId] ||= []);
        if (!messages.some((item) => item._id === message._id)) {
          messages.push(message);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload;
      });
  },
});

export const { setMessages, addMessage, clearMessages } =
  messageSlice.actions;

export default messageSlice.reducer;
